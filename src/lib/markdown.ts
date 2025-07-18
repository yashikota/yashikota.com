import { toHtml } from "hast-util-to-html";
import { h } from "hastscript";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExpressiveCode from "rehype-expressive-code";
import rehypeImageCaption from "rehype-image-caption";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import rehypeExternalLinks from "rehype-external-links";
import rehypeToc from "rehype-toc";
import rehypeVideo from "rehype-video";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkAlert from "remark-github-blockquote-alert";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkValidateLinks from "remark-validate-links";
import remarkYoutube from "remark-youtube";
import { unified } from "unified";
import remarkImageSize from "./remark-image-size";
import remarkLinkCard from "./remark-linkcard";

import "remark-github-blockquote-alert/alert.css";

/**
 * マークダウンをHTMLに変換し、TOC（h2, h3のみ）も返す
 * @param markdown マークダウン文字列
 * @returns { html: string, toc: string }
 */
export async function markdownToHtmlWithToc(
  markdown: string,
): Promise<{ html: string; toc: string }> {
  let tocNode: any = null;
  const result = await unified()
    .use(remarkParse)
    .use(remarkImageSize)
    .use(remarkAlert, { legacyTitle: true })
    .use(remarkValidateLinks)
    .use(remarkBreaks)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkYoutube)
    .use(remarkLinkCard, { cache: true, shortenUrl: true })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeExternalLinks, { 
      target: "_blank", 
      rel: (node) => {
        const url = node.properties?.href;
        // Don't add noreferrer for yashikota.com links
        if (url && typeof url === "string" && url.endsWith("yashikota.com")) {
          return [];
        }
        // Add noreferrer for all other external links
        return ["noreferrer"];
      }
    })
    .use(rehypeSlug)
    .use(rehypeToc, {
      headings: ["h2", "h3"],
      nav: true,
      position: "beforeend",
      customizeTOC(toc) {
        tocNode = toc;
        return false; // ページには挿入しない
      },
      cssClasses: {
        toc: "toc-nav",
        list: "toc-list",
        listItem: "toc-li",
        link: "toc-link",
      },
    })
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      content() {
        return h(
          "span.copy-link-btn markdown-copy-link-btn inline-flex items-center align-middle ml-2 cursor-pointer align-middle",
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
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": 2,
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                class: "block align-middle flex-shrink-0 self-center",
                style:
                  "display: block; vertical-align: middle; width: 16px; height: 16px;",
              },
              [
                h("path", {
                  d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
                }),
                h("path", {
                  d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
                }),
              ],
            ),
          ],
        );
      },
    })
    .use(rehypeKatex)
    .use(rehypeExpressiveCode, { themes: ["slack-dark"] })
    .use(rehypeImageCaption)
    .use(rehypeVideo, { details: false })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  let tocHtml = "";
  if (tocNode) {
    tocHtml = toHtml(tocNode);
  }
  return { html: result.toString(), toc: tocHtml };
}
