import { describe, expect, test } from "bun:test";
import {
  createLinkCardPlaceholder,
  createMinimalLinkCardData,
  renderLinkCardHtml,
} from "./link-card";

describe("link-card helpers", () => {
  test("creates a worker-readable placeholder", () => {
    const html = createLinkCardPlaceholder(new URL("https://example.com/path"));

    expect(html).toContain("remark-link-card-plus__container");
    expect(html).toContain('data-link-card="true"');
    expect(html).toContain('data-link-card-url="https://example.com/path"');
    expect(html).toContain('data-link-card-display-url="example.com"');
  });

  test("creates minimal fallback card data from hostname", () => {
    const data = createMinimalLinkCardData(
      new URL("https://example.com/path"),
      "example.com",
    );

    expect(data.title).toBe("example.com");
    expect(data.description).toBe("");
    expect(data.displayUrl).toBe("example.com");
    expect(data.faviconUrl).toContain("google.com/s2/favicons");
  });

  test("renders full card markup and escapes text", () => {
    const html = renderLinkCardHtml({
      title: '<script>alert("x")</script>',
      description: "hello & world",
      displayUrl: "example.com",
      faviconUrl: "https://example.com/favicon.ico",
      ogImageUrl: "https://example.com/og.png",
      url: "https://example.com/page",
    });

    expect(html).toContain('class="remark-link-card-plus__card"');
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(html).toContain("hello &amp; world");
    expect(html).toContain('src="https://example.com/og.png"');
  });
});
