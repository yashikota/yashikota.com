import rehypeExpressiveCode from "rehype-expressive-code";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/**
 * マークダウンをHTMLに変換する
 * @param markdown マークダウン文字列
 * @returns HTML文字列
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeExpressiveCode)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}
