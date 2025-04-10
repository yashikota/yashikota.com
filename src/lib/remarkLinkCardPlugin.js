import { visit } from 'unist-util-visit';

/**
 * リンクカードを生成するremarkプラグイン
 * 単独行のURLをリンクカードに変換します
 */
export function remarkLinkCardPlugin() {
  return (tree) => {
    const urlRegex = /^https?:\/\/[^\s<]+$/;

    visit(tree, 'paragraph', (node, index, parent) => {
      // 段落が1つのテキストノードのみを含み、それがURLの場合
      if (
        node.children.length === 1 &&
        node.children[0].type === 'text' &&
        urlRegex.test(node.children[0].value.trim())
      ) {
        const url = node.children[0].value.trim();

        // リンクカードコンポーネントに置き換え
        parent.children[index] = {
          type: 'html',
          value: `<LinkCard url="${url}" />`,
        };
      }
    });
  };
}
