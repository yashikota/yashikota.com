// Ref: https://github.com/okaryo/remark-link-card-plus
import type { Html, Link, Root, Text } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { createLinkCardPlaceholder } from "./link-card";

type Options = {
  shortenUrl?: boolean;
};

const defaultOptions: Options = {
  shortenUrl: true,
};

const remarkLinkCard: Plugin<[Options], Root> =
  (userOptions: Options) => (tree) => {
    const options = { ...defaultOptions, ...userOptions };

    const isValidUrl = (value: string): boolean => {
      if (!URL.canParse(value)) return false;

      const basicUrlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
      if (!basicUrlPattern.test(value)) return false;

      const youtubePattern =
        /^https:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)/;
      if (youtubePattern.test(value)) {
        return false;
      }

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

      const replaceParagraph = (url: string) => {
        if (index === undefined) {
          return;
        }

        const linkCardNode = createLinkCardNode(new URL(url), options);
        tree.children.splice(index, 1, linkCardNode);
        processedUrl = url;
      };

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

        replaceParagraph(linkNode.url);
      });

      visit(paragraph, "text", (textNode) => {
        if (!isValidUrl(textNode.value)) return;
        if (processedUrl === textNode.value) return;

        if (
          unmatchedLink &&
          textNode.value === (unmatchedLink.children[0] as Text).value &&
          textNode.position?.start.line === unmatchedLink.position?.start.line
        ) {
          return;
        }

        replaceParagraph(textNode.value);
      });
    });

    return tree;
  };

const isSameUrlValue = (a: string, b: string) => {
  try {
    return new URL(a).toString() === new URL(b).toString();
  } catch {
    return false;
  }
};

const createLinkCardNode = (url: URL, options: Options): Html => {
  return {
    type: "html",
    value: createLinkCardPlaceholder(url, {
      shortenUrl: options.shortenUrl,
    }),
  };
};

export default remarkLinkCard;
