// Ref: https://github.com/okaryo/remark-link-card-plus
import type { Html, Link, Root, Text } from "mdast";
import sanitizeHtml from "sanitize-html";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

// キャッシュの有効期限 (1時間)
const CACHE_TTL = 3600000;
const linkPreviewCache = new Map<string, any>();

export type OgData = {
  title: string;
  description: string;
  favicon?: string;
  image?: string;
};

type Options = {
  shortenUrl?: boolean;
  thumbnailPosition?: "right" | "left";
  noThumbnail?: boolean;
  noFavicon?: boolean;
  ogTransformer?: (og: OgData) => OgData;
};

type LinkCardData = {
  title: string;
  description: string;
  faviconUrl: string;
  ogImageUrl?: string;
  displayUrl: string;
  url: URL;
};

const defaultOptions: Options = {
  shortenUrl: true,
  thumbnailPosition: "right",
  noThumbnail: false,
  noFavicon: false,
};

const remarkLinkCard: Plugin<[Options], Root> =
  (userOptions: Options) => async (tree) => {
    const options = { ...defaultOptions, ...userOptions };
    const transformers: (() => Promise<void>)[] = [];

    const urlsToProcess: { url: string; index: number }[] = [];

    const addTransformer = (url: string, index: number) => {
      urlsToProcess.push({ url, index });

      transformers.push(async () => {
        const data = await getLinkCardData(new URL(url), options);
        const linkCardNode = createLinkCardNode(data, options);
        if (index !== undefined) {
          tree.children.splice(index, 1, linkCardNode);
        }
      });
    };

    const isValidUrl = (value: string): boolean => {
      if (!URL.canParse(value)) return false;

      const basicUrlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
      if (!basicUrlPattern.test(value)) return false;

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

      let unmatchedLink: Link;
      let processedUrl: string;

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
      // プリフェッチ処理
      for (const { url } of urlsToProcess) {
        getOpenGraph(new URL(url)).catch(() => {});
      }

      await Promise.all(transformers.map((t) => t()));
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

const getOpenGraph = async (targetUrl: URL) => {
  const url = targetUrl.toString();
  const cacheKey = url;
  const cachedData = linkPreviewCache.get(cacheKey);
  if (cachedData && cachedData.timestamp > Date.now() - CACHE_TTL) {
    return cachedData.data;
  }

  try {
    const apiUrl = `https://linkpreview-api.yashikota.workers.dev/preview?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();

    linkPreviewCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    console.error(
      `[remark-link-card-plus] Error: Failed to get the Open Graph data of ${targetUrl} due to ${error}.`,
    );
    return undefined;
  }
};

const getLinkCardData = async (url: URL, options: Options) => {
  const ogRawResult = await getOpenGraph(url);
  let ogData: OgData = {
    title: ogRawResult?.title || "",
    description: ogRawResult?.description || "",
    favicon: ogRawResult?.favicon,
    image: ogRawResult?.ogImage,
  };

  if (options.ogTransformer) {
    ogData = options.ogTransformer(ogData);
  }

  const title = ogData?.title || url.hostname;
  const description = ogData?.description || "";
  const faviconUrl = getFaviconUrl(ogData?.favicon, options);
  const ogImageUrl = options.noThumbnail ? "" : ogData.image || "";

  let displayUrl = options.shortenUrl ? url.hostname : url.toString();
  try {
    displayUrl = decodeURI(displayUrl);
  } catch (error) {
    console.error(
      `[remark-link-card-plus] Error: Cannot decode url: "${url}"\n ${error}`,
    );
  }

  return {
    title,
    description,
    faviconUrl,
    ogImageUrl,
    displayUrl,
    url,
  };
};

const getFaviconUrl = (ogFavicon: string | undefined, options: Options) => {
  if (options.noFavicon) return "";
  return ogFavicon || "";
};

const className = (value: string) => {
  const prefix = "remark-link-card-plus";
  return `${prefix}__${value}`;
};

const createLinkCardNode = (data: LinkCardData, options: Options): Html => {
  const { title, description, faviconUrl, ogImageUrl, displayUrl, url } = data;
  const isThumbnailLeft = options.thumbnailPosition === "left";

  const thumbnail = ogImageUrl
    ? `
<div class="${className("thumbnail")}">
  <img src="${ogImageUrl}" class="${className("image")}" alt="ogImage">
</div>`.trim()
    : "";

  const mainContent = `
<div class="${className("main")}">
  <div class="${className("content")}">
    <div class="${className("title")}">${sanitizeHtml(title)}</div>
    <div class="${className("description")}">${sanitizeHtml(description)}</div>
  </div>
  <div class="${className("meta")}">
    ${faviconUrl ? `<img src="${faviconUrl}" class="${className("favicon")}" width="14" height="14" alt="favicon">` : ""}
    <span class="${className("url")}">${sanitizeHtml(displayUrl)}</span>
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
<div class="${className("container")}">
  <a href="${url.toString()}" target="_blank" rel="noreferrer noopener" class="${className("card")}">
    ${content.trim()}
  </a>
</div>
`.trim(),
  };
};

export default remarkLinkCard;
