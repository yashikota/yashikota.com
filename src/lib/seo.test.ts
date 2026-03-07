import { describe, expect, test } from "bun:test";
import {
  createDescriptionFromMarkdown,
  DEFAULT_DESCRIPTION,
  splitJapaneseText,
  stripMarkdown,
  toAbsoluteUrl,
  truncateText,
} from "./seo";

const getCharDisplayWidth = (char: string): number => {
  if (/\s/.test(char)) {
    return 0.35;
  }

  if (/[\u0020-\u007e]/.test(char)) {
    return 0.56;
  }

  return 1;
};

const getDisplayWidth = (value: string): number =>
  Array.from(value).reduce(
    (total, char) => total + getCharDisplayWidth(char),
    0,
  );

describe("toAbsoluteUrl", () => {
  test("resolves relative URL against provided base", () => {
    const actual = toAbsoluteUrl("/blog", "https://example.com/base/");
    expect(actual).toBe("https://example.com/blog");
  });

  test("keeps absolute URL as-is", () => {
    const actual = toAbsoluteUrl(
      "https://cdn.example.com/image.png",
      "https://example.com",
    );
    expect(actual).toBe("https://cdn.example.com/image.png");
  });
});

describe("stripMarkdown", () => {
  test("removes markdown syntax and normalizes whitespace", () => {
    const markdown = [
      "# Heading",
      "> quote line",
      "Paragraph [link](https://example.com) ![img](https://example.com/x.png) `inline`",
      "**bold** _italic_ ~~strike~~",
      "```ts",
      "const hidden = true;",
      "```",
    ].join("\n");

    const actual = stripMarkdown(markdown);

    expect(actual).toBe(
      "Heading quote line Paragraph link inline bold italic strike",
    );
  });
});

describe("truncateText", () => {
  test("returns original text when within limit", () => {
    expect(truncateText("short", 10)).toBe("short");
  });

  test("adds ellipsis and trims trailing spaces", () => {
    expect(truncateText("abc   def", 5)).toBe("abc…");
  });
});

describe("createDescriptionFromMarkdown", () => {
  test("uses default description when markdown has no text", () => {
    expect(createDescriptionFromMarkdown("   \n\n")).toBe(DEFAULT_DESCRIPTION);
  });

  test("creates a truncated description from markdown", () => {
    const actual = createDescriptionFromMarkdown("**Hello** world", 8);
    expect(actual).toBe("Hello w…");
  });
});

describe("splitJapaneseText", () => {
  test("returns an empty array for blank input", () => {
    expect(splitJapaneseText("   \n\t")).toEqual([]);
  });

  test("keeps each line within max width and line count", () => {
    const lines = splitJapaneseText(
      "これは Budoux を使った テキスト 分割 の テスト です",
      2,
      8,
    );

    expect(lines.length).toBeLessThanOrEqual(2);
    for (const line of lines) {
      expect(getDisplayWidth(line)).toBeLessThanOrEqual(8);
    }
  });

  test("truncates a long ASCII word with ellipsis", () => {
    const lines = splitJapaneseText("supercalifragilisticexpialidocious", 3, 8);

    expect(lines).toHaveLength(1);
    expect(lines[0].endsWith("…")).toBe(true);
    expect(getDisplayWidth(lines[0])).toBeLessThanOrEqual(8);
  });

  test("caps output to maxLines for long text", () => {
    const lines = splitJapaneseText("あ".repeat(30), 2, 5);

    expect(lines).toHaveLength(2);
    for (const line of lines) {
      expect(getDisplayWidth(line)).toBeLessThanOrEqual(5);
    }
  });
});
