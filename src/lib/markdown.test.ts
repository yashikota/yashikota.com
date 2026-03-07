import { afterEach, describe, expect, test } from "bun:test";
import { markdownToHtmlWithToc } from "./markdown";

const originalFetch = globalThis.fetch;
const linkPreviewApiPrefix =
  "https://linkpreview-api.yashikota.workers.dev/preview?url=";

function toUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("markdownToHtmlWithToc", () => {
  test("builds TOC from h2/h3 and appends heading copy button", async () => {
    const markdown = ["# Title", "", "## Section A", "", "### Section B"].join(
      "\n",
    );

    const { html, toc } = await markdownToHtmlWithToc(markdown);

    expect(html).toContain('<h1 id="title">');
    expect(html).toContain('<h2 id="section-a">');
    expect(html).toContain('<h3 id="section-b">');
    expect(html).toContain("markdown-copy-link-btn");

    expect(toc).toContain('href="#section-a"');
    expect(toc).toContain('href="#section-b"');
    expect(toc).not.toContain('href="#title"');
  });

  test("adds noreferrer for external links", async () => {
    const { html } = await markdownToHtmlWithToc("[site](https://example.com)");

    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer"');
  });

  test("does not add noreferrer for yashikota.com links", async () => {
    const { html } = await markdownToHtmlWithToc(
      "[site](https://yashikota.com)",
    );

    expect(html).toContain('href="https://yashikota.com"');
    expect(html).toContain('target="_blank"');
    expect(html).not.toContain('rel="noreferrer"');
  });

  test("supports image width suffix and caption", async () => {
    const markdown = [
      "![alt](https://example.com/image.png#250px)",
      "*caption text*",
    ].join("\n");

    const { html } = await markdownToHtmlWithToc(markdown);

    expect(html).toContain("<figure>");
    expect(html).toContain('src="https://example.com/image.png"');
    expect(html).toContain('width="250px"');
    expect(html).toContain("<figcaption>caption text</figcaption>");
  });

  test("supports GFM table and task list", async () => {
    const markdown = [
      "| A | B |",
      "| - | - |",
      "| 1 | 2 |",
      "",
      "- [x] done",
      "- [ ] todo",
    ].join("\n");

    const { html } = await markdownToHtmlWithToc(markdown);

    expect(html).toContain("<table>");
    expect(html).toContain("<thead>");
    expect(html).toContain("<tbody>");
    expect(html).toContain("contains-task-list");
    expect(html).toContain("task-list-item");
  });

  test("renders block and inline math via KaTeX", async () => {
    const markdown = [
      "$a\\ne0$",
      "",
      "$$",
      "e^{i\\theta}=\\cos\\theta+i\\sin\\theta",
      "$$",
    ].join("\n");

    const { html } = await markdownToHtmlWithToc(markdown);

    expect(html).toContain("katex-display");
    expect(html).toContain("katex-mathml");
    expect(html).toContain("katex-html");
  });

  test("supports footnotes", async () => {
    const markdown = ["Footnote[^1]", "", "[^1]: Footnote body"].join("\n");

    const { html } = await markdownToHtmlWithToc(markdown);

    expect(html).toContain("data-footnote-ref");
    expect(html).toContain("data-footnotes");
    expect(html).toContain("footnote-backref");
  });

  test("supports GitHub-style blockquote alerts", async () => {
    const markdown = ["> [!NOTE]", "> note", "", "> [!WARNING]", "> warn"].join(
      "\n",
    );

    const { html } = await markdownToHtmlWithToc(markdown);

    expect(html).toContain("markdown-alert markdown-alert-note");
    expect(html).toContain("markdown-alert markdown-alert-warning");
    expect(html).toContain("markdown-alert-title");
  });

  test("embeds YouTube URLs", async () => {
    const { html } = await markdownToHtmlWithToc(
      "https://youtu.be/enTFE2c68FQ",
    );

    expect(html).toContain("youtube-wrapper");
    expect(html).toContain("youtube-iframe");
    expect(html).toContain("https://www.youtube.com/embed/enTFE2c68FQ");
  });

  test("embeds video URLs", async () => {
    const { html } = await markdownToHtmlWithToc(
      "https://example.com/demo.mp4",
    );

    expect(html).toContain("<video");
    expect(html).toContain('src="https://example.com/demo.mp4"');
  });

  test("renders link cards for URL-only paragraphs", async () => {
    const fetchCalls: string[] = [];

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = toUrl(input);
      fetchCalls.push(url);

      if (url.startsWith(linkPreviewApiPrefix)) {
        return new Response(
          JSON.stringify({
            title: "Preview title",
            description: "Preview description",
            favicon: "https://example.com/favicon.ico",
            ogImage: "https://example.com/og.png",
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
            status: 200,
          },
        );
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    }) as typeof fetch;

    const { html } = await markdownToHtmlWithToc("https://example.com/page");

    expect(fetchCalls.length).toBeGreaterThan(0);
    expect(fetchCalls[0]).toContain(linkPreviewApiPrefix);
    expect(html).toContain("remark-link-card-plus__container");
    expect(html).toContain("Preview title");
    expect(html).toContain("Preview description");
    expect(html).toContain('class="remark-link-card-plus__url">example.com');
  });

  test("applies expressive code rendering including mermaid block", async () => {
    const markdown = [
      "```mermaid",
      "graph TB",
      "A-->B",
      "```",
      "",
      "```js",
      'console.log("x");',
      "```",
    ].join("\n");

    const { html } = await markdownToHtmlWithToc(markdown);

    expect(html).toContain("expressive-code");
    expect(html).toContain('data-language="mermaid"');
    expect(html).toContain('data-language="js"');
    expect(html).toContain("console.log");
  });
});
