import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/**
 * マークダウンをHTMLに変換する
 * @param markdown マークダウン文字列
 * @returns HTML文字列
 */
export function markdownToHtml(markdown: string): string {
  const result = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .processSync(markdown);

  return result.toString();
}
