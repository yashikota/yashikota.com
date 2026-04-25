// Ref: https://github.com/okaryo/remark-link-card-plus
import type { Html, Link, Root, Text } from "mdast";
import sanitizeHtml from "sanitize-html";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

type Options = {
  shortenUrl?: boolean;
  thumbnailPosition?: "right" | "left";
  noThumbnail?: boolean;
  noFavicon?: boolean;
};

type LinkCardData = {
  title: string;
  description: string;
  displayUrl: string;
  url: URL;
};

const defaultOptions: Options = {
  shortenUrl: true,
  thumbnailPosition: "right",
  noThumbnail: false,
  noFavicon: false,
};

const remarkLinkCard: Plugin<[Options?], Root> =
  (userOptions: Options = {}) =>
  (tree) => {
    const options = { ...defaultOptions, ...userOptions };
    const transformers: (() => void)[] = [];

    const addTransformer = (url: string, index: number) => {
      transformers.push(() => {
        const data = getLinkCardData(new URL(url), options);
        const linkCardNode = createLinkCardNode(data, options);
        tree.children.splice(index, 1, linkCardNode);
      });
    };

    const isValidUrl = (value: string): boolean => {
      if (!URL.canParse(value)) return false;

      const basicUrlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
      if (!basicUrlPattern.test(value)) return false;

      // YouTube URLを除外 (remark-youtubeプラグインに処理を任せる)
      const youtubePattern =
        /^https:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)/;
      if (youtubePattern.test(value)) {
        return false;
      }

      // 特定の拡張子で終わるURLを除外
      const skipExtensions = [".mp4", ".mov"];
      try {
        const url = new URL(value);
        if (
          skipExtensions.some((ext) => url.pathname.toLowerCase().endsWith(ext))
        ) {
          return false;
        }
      } catch {
        return false;
      }

      return true;
    };

    visit(tree, "paragraph", (paragraph, index, parent) => {
      if (parent?.type !== "root" || paragraph.children.length !== 1) return;

      let unmatchedLink: Link | undefined;
      let processedUrl: string | undefined;

      visit(paragraph, "link", (linkNode) => {
        if (!isValidUrl(linkNode.url)) return;
        const hasOneChildText =
          linkNode.children.length === 1 &&
          linkNode.children[0].type === "text";
        if (!hasOneChildText) return;

        const childText = linkNode.children[0] as Text;
        if (!isSameUrlValue(linkNode.url, childText.value)) {
          unmatchedLink = linkNode;
          return;
        }

        if (index !== undefined) {
          processedUrl = linkNode.url;
          addTransformer(linkNode.url, index);
        }
      });

      visit(paragraph, "text", (textNode) => {
        if (!isValidUrl(textNode.value)) return;
        if (processedUrl === textNode.value) return;

        // NOTE: Skip card conversion if the link text and URL are different, e.g., [https://example.com](https://example.org)
        if (
          unmatchedLink &&
          textNode.value === (unmatchedLink.children[0] as Text).value &&
          textNode.position?.start.line === unmatchedLink.position?.start.line
        ) {
          return;
        }

        if (index !== undefined) {
          addTransformer(textNode.value, index);
        }
      });
    });

    try {
      for (const transformer of transformers) {
        transformer();
      }
    } catch (error) {
      console.error(`[remark-link-card-plus] Error: ${error}`);
    }

    return tree;
  };

const isSameUrlValue = (a: string, b: string) => {
  try {
    return new URL(a).toString() === new URL(b).toString();
  } catch (_) {
    return false;
  }
};

const getLinkCardData = (url: URL, options: Options): LinkCardData => {
  let displayUrl = options.shortenUrl ? url.hostname : url.toString();
  try {
    displayUrl = decodeURI(displayUrl);
  } catch (error) {
    console.error(
      `[remark-link-card-plus] Error: Cannot decode url: "${url}"\n ${error}`,
    );
  }

  return {
    title: url.hostname,
    description: "",
    displayUrl,
    url,
  };
};

const className = (value: string) => {
  const prefix = "remark-link-card-plus";
  return `${prefix}__${value}`;
};

const sanitizeText = (value: string) =>
  sanitizeHtml(value, { allowedAttributes: {}, allowedTags: [] });

const escapeAttribute = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const createLinkCardNode = (data: LinkCardData, options: Options): Html => {
  const { title, description, displayUrl, url } = data;
  const isThumbnailLeft = options.thumbnailPosition === "left";
  const safeUrl = escapeAttribute(url.toString());

  const thumbnail = options.noThumbnail
    ? ""
    : `
<div class="${className("thumbnail")}" data-link-card-thumbnail hidden>
  <img class="${className("image")}" alt="ogImage" data-link-card-image>
</div>`.trim();

  const favicon = options.noFavicon
    ? ""
    : `<img class="${className("favicon")}" width="14" height="14" alt="favicon" data-link-card-favicon hidden>`;

  const mainContent = `
<div class="${className("main")}">
  <div class="${className("content")}">
    <div class="${className("title")}" data-link-card-title>${sanitizeText(title)}</div>
    <div class="${className("description")}" data-link-card-description>${sanitizeText(description)}</div>
  </div>
  <div class="${className("meta")}">
    ${favicon}
    <span class="${className("url")}">${sanitizeText(displayUrl)}</span>
  </div>
</div>
`
    .replace(/\n\s*\n/g, "\n")
    .trim();

  const content = isThumbnailLeft
    ? `
${thumbnail}
${mainContent}`
    : `
${mainContent}
${thumbnail}`;

  return {
    type: "html",
    value: `
<div class="${className("container")}" data-link-card-url="${safeUrl}">
  <a href="${safeUrl}" target="_blank" rel="noreferrer noopener" class="${className("card")}">
    ${content.trim()}
  </a>
</div>
`.trim(),
  };
};

export default remarkLinkCard;
