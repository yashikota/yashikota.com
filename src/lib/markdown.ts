import { h } from "hastscript";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExpressiveCode from "rehype-expressive-code";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import rehypeVideo from "rehype-video";
import remarkGfm from "remark-gfm";
import remarkAlert from "remark-github-blockquote-alert";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import "remark-github-blockquote-alert/alert.css";

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
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "prepend",
      content() {
        return h(
          "span.copy-link-btn inline-flex items-center align-middle mr-2 cursor-pointer align-middle",
          {
            title: "リンクをコピー",
            tabindex: 0,
            role: "button",
            "aria-label": "この見出しへのリンクをコピー",
          },
          [
            h(
              "svg",
              {
                width: "1em",
                height: "1em",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": 2,
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                class: "block align-middle flex-shrink-0 self-center",
                style: "display: block; vertical-align: middle;"
              },
              [
                h("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
                h("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
              ],
            ),
          ],
        );
      },
    })
    .use(rehypeKatex)
    .use(rehypeExpressiveCode)
    .use(rehypeVideo, { details: false })
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}
