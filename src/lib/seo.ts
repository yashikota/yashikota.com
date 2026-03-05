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
  const chunks = parser.parse(text.trim());
  const lines: string[] = [];
  let currentLine = "";

  for (const chunk of chunks) {
    if ((currentLine + chunk).length > maxCharsPerLine) {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = chunk;
    } else {
      currentLine += chunk;
    }

    if (lines.length === maxLines) {
      break;
    }
  }

  if (lines.length < maxLines && currentLine) {
    lines.push(currentLine);
  }

  if (lines.length > maxLines) {
    return lines.slice(0, maxLines);
  }

  const joined = lines.join("");
  if (joined.length < text.length && lines.length > 0) {
    const lastIndex = lines.length - 1;
    lines[lastIndex] = truncateText(lines[lastIndex], maxCharsPerLine);
  }

  return lines;
}
