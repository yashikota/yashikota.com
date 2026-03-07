import type { Element, Root, RootContent } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const MERMAID_LANGUAGE_CLASS = "language-mermaid";

const getClassNames = (className: unknown): string[] => {
  if (Array.isArray(className)) {
    return className.filter((name): name is string => typeof name === "string");
  }

  if (typeof className === "string") {
    return className.split(/\s+/).filter(Boolean);
  }

  return [];
};

const getTextContent = (nodes: RootContent[]): string => {
  return nodes
    .map((node) => {
      if (node.type === "text") {
        return node.value;
      }

      if (node.type === "element") {
        return getTextContent(node.children as RootContent[]);
      }

      return "";
    })
    .join("");
};

const rehypeMermaid: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (!parent || index === undefined || node.tagName !== "pre") {
        return;
      }

      const codeNode = node.children[0];
      if (
        !codeNode ||
        codeNode.type !== "element" ||
        codeNode.tagName !== "code"
      ) {
        return;
      }

      const classNames = getClassNames(codeNode.properties?.className);
      if (!classNames.includes(MERMAID_LANGUAGE_CLASS)) {
        return;
      }

      const source = getTextContent(codeNode.children as RootContent[]);

      parent.children[index] = {
        type: "element",
        tagName: "pre",
        properties: {
          className: ["mermaid"],
        },
        children: [
          {
            type: "text",
            value: source,
          },
        ],
      } as Element;
    });
  };
};

export default rehypeMermaid;
