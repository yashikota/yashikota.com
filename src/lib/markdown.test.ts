import { describe, expect, test } from "bun:test";
import { markdownToHtmlWithToc } from "./markdown";

describe("markdownToHtmlWithToc", () => {
  test("renders headings, TOC, and external link attributes", async () => {
    const markdown = [
      "## Section A",
      "",
      "本文のリンクは[Example](https://example.com)です。",
      "",
      "### Section B",
      "",
      "`inline` text",
    ].join("\n");

    const { html, toc } = await markdownToHtmlWithToc(markdown);

    expect(html).toContain('<h2 id="section-a">');
    expect(html).toContain('<h3 id="section-b">');
    expect(html).toContain("markdown-copy-link-btn");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer"');

    expect(toc).toContain('class="toc-nav"');
    expect(toc).toContain('href="#section-a"');
    expect(toc).toContain('href="#section-b"');
  });

  test("does not add noreferrer to yashikota.com links", async () => {
    const { html } = await markdownToHtmlWithToc(
      "[site](https://yashikota.com)",
    );

    expect(html).toContain('href="https://yashikota.com"');
    expect(html).toContain('target="_blank"');
    expect(html).not.toContain('rel="noreferrer"');
  });

  test("returns an empty TOC list when no h2/h3 exists", async () => {
    const { toc } = await markdownToHtmlWithToc("plain text only");

    expect(toc).toContain('class="toc-nav"');
    expect(toc).not.toContain("toc-link-h2");
    expect(toc).not.toContain("toc-link-h3");
  });
});
