import rehypeExpressiveCode from "rehype-expressive-code";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkAlert from "remark-github-blockquote-alert";
import "remark-github-blockquote-alert/alert.css";
import rehypeVideo from "rehype-video";
import remarkMath from "remark-math";
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
    .use(remarkAlert, { legacyTitle: true })
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeExpressiveCode)
    .use(rehypeVideo, { details: false })
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}
