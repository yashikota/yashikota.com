import { loadDefaultJapaneseParser } from "budoux";

export const SITE_NAME = "こたのお考え";
export const SITE_URL = "https://yashikota.com";
export const DEFAULT_DESCRIPTION =
  "yashikota のブログ。技術メモや日々の気づきを発信しています。";

const parser = loadDefaultJapaneseParser();

export function toAbsoluteUrl(
  value: string,
  baseUrl: string = SITE_URL,
): string {
  if (URL.canParse(value)) {
    return new URL(value).toString();
  }

  return new URL(value, baseUrl).toString();
}

export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^>\s*/gm, "")
    .replace(/^#+\s*/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

export function createDescriptionFromMarkdown(
  markdown: string,
  maxLength = 120,
): string {
  const plainText = stripMarkdown(markdown);

  if (!plainText) {
    return DEFAULT_DESCRIPTION;
  }

  return truncateText(plainText, maxLength);
}

export function splitJapaneseText(
  text: string,
  maxLines = 3,
  maxCharsPerLine = 26,
): string[] {
  const source = text.trim();
  const chunks = parser.parse(source);
  const lines: string[] = [];
  let currentLine = "";

  for (const chunk of chunks) {
    let remaining = chunk;

    while (remaining.length > 0) {
      const room = maxCharsPerLine - currentLine.length;

      if (room <= 0) {
        lines.push(currentLine);
        currentLine = "";
        if (lines.length >= maxLines) {
          break;
        }
      }

      const take = Math.min(
        remaining.length,
        maxCharsPerLine - currentLine.length,
      );
      currentLine += remaining.slice(0, take);
      remaining = remaining.slice(take);

      if (currentLine.length >= maxCharsPerLine) {
        lines.push(currentLine);
        currentLine = "";
      }

      if (lines.length >= maxLines) {
        break;
      }
    }

    if (lines.length >= maxLines) {
      break;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  const clipped = lines.slice(0, maxLines);
  const joined = clipped.join("");
  const isTruncated = joined.length < source.length;

  if (isTruncated && clipped.length > 0) {
    const lastIndex = clipped.length - 1;
    clipped[lastIndex] = truncateText(clipped[lastIndex], maxCharsPerLine);
  }

  return clipped;
}
