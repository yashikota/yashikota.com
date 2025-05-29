import type { Image, Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

/**
 * ![alt](url#250px) のような記法で画像のwidthを指定できるremarkプラグイン
 */
const remarkImageSize: Plugin<[], Root> = () => (tree) => {
  visit(tree, "image", (node: Image) => {
    if (typeof node.url === "string") {
      const match = node.url.match(/^(.*)#(\d+px)$/);
      if (match) {
        node.url = match[1];
        if (!node.data) node.data = {};
        if (!node.data.hProperties) node.data.hProperties = {};
        node.data.hProperties.width = match[2];
      }
    }
  });
};

export default remarkImageSize;
