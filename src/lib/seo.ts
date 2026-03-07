import { loadDefaultJapaneseParser } from "budoux";

export const SITE_NAME = "こたのお考え";
const DEFAULT_SITE_URL = "https://yashikota.com";
const resolveSiteUrl = (): string => {
  const envSiteUrl =
    import.meta.env.SITE_URL ?? import.meta.env.PUBLIC_SITE_URL;
  if (!envSiteUrl) {
    return DEFAULT_SITE_URL;
  }

  try {
    const url = new URL(envSiteUrl);
    return url.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
};

export const SITE_URL = resolveSiteUrl();
export const DEFAULT_DESCRIPTION = "こたのお考え";

const parser = loadDefaultJapaneseParser();

export function toAbsoluteUrl(
  value: string,
  baseUrl: string = SITE_URL,
): string {
  return new URL(value, baseUrl).toString();
}

export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
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
  if (!source) {
    return [];
  }

  const chunks = parser.parse(source);
  const tokens = chunks.flatMap((chunk) => {
    if (!/[A-Za-z]/.test(chunk)) {
      return [chunk];
    }

    const parts = chunk.match(
      /[A-Za-z0-9][A-Za-z0-9'._-]*|[^\S\r\n]+|[^A-Za-z0-9\s]+/g,
    );
    return parts ?? [chunk];
  });

  const isAsciiWord = (value: string): boolean =>
    /^[A-Za-z0-9][A-Za-z0-9'._-]*$/.test(value);

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

  const truncateByDisplayWidth = (value: string, maxWidth: number): string => {
    if (getDisplayWidth(value) <= maxWidth) {
      return value;
    }

    const ellipsis = "…";
    const targetWidth = Math.max(maxWidth - getDisplayWidth(ellipsis), 0);
    let result = "";
    let width = 0;

    for (const char of Array.from(value)) {
      const charWidth = getCharDisplayWidth(char);
      if (width + charWidth > targetWidth) {
        break;
      }

      result += char;
      width += charWidth;
    }

    return `${result.trimEnd()}${ellipsis}`;
  };

  const pushLine = (lines: string[], line: string): string => {
    lines.push(line.trimEnd());
    return "";
  };

  const lines: string[] = [];
  let currentLine = "";
  let index = 0;
  let isTruncated = false;

  while (index < tokens.length) {
    const token = tokens[index];

    if (/^\s+$/.test(token)) {
      if (!currentLine) {
        index += 1;
        continue;
      }

      if (
        getDisplayWidth(currentLine) + getDisplayWidth(" ") >
        maxCharsPerLine
      ) {
        lines.push(currentLine.trimEnd());
        currentLine = "";

        if (lines.length >= maxLines) {
          isTruncated = true;
          break;
        }
      } else {
        currentLine += " ";
      }

      index += 1;
      continue;
    }

    const room = maxCharsPerLine - getDisplayWidth(currentLine);
    if (getDisplayWidth(token) <= room) {
      currentLine += token;
      index += 1;
      continue;
    }

    if (isAsciiWord(token)) {
      if (currentLine) {
        currentLine = pushLine(lines, currentLine);

        if (lines.length >= maxLines) {
          isTruncated = true;
          break;
        }

        continue;
      }

      currentLine = truncateByDisplayWidth(token, maxCharsPerLine);
      currentLine = pushLine(lines, currentLine);
      isTruncated = getDisplayWidth(token) > maxCharsPerLine;
      break;
    }

    const remainingChars = Array.from(token);
    let cursor = 0;
    while (cursor < remainingChars.length) {
      const lineRoom = maxCharsPerLine - getDisplayWidth(currentLine);
      if (lineRoom <= 0) {
        currentLine = pushLine(lines, currentLine);

        if (lines.length >= maxLines) {
          isTruncated = true;
          break;
        }

        continue;
      }

      let consumed = 0;
      let consumedWidth = 0;
      while (cursor + consumed < remainingChars.length) {
        const nextChar = remainingChars[cursor + consumed];
        const nextWidth = getCharDisplayWidth(nextChar);
        if (nextWidth > lineRoom - consumedWidth) {
          break;
        }
        consumed += 1;
        consumedWidth += nextWidth;
      }

      if (consumed <= 0) {
        if (!currentLine) {
          currentLine += remainingChars[cursor];
          cursor += 1;
          continue;
        }

        currentLine = pushLine(lines, currentLine);
        if (lines.length >= maxLines) {
          isTruncated = true;
          break;
        }
        continue;
      }

      const segment = remainingChars.slice(cursor, cursor + consumed).join("");
      currentLine += segment;
      cursor += consumed;

      if (getDisplayWidth(currentLine) >= maxCharsPerLine - 1e-6) {
        currentLine = pushLine(lines, currentLine);

        if (lines.length >= maxLines) {
          isTruncated =
            cursor < remainingChars.length || index + 1 < tokens.length;
          break;
        }
      }
    }

    if (isTruncated) {
      break;
    }

    index += 1;
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine.trimEnd());
  }

  const clipped = lines.slice(0, maxLines);
  const hasRemainingTokens = index < tokens.length;

  if ((isTruncated || hasRemainingTokens) && clipped.length > 0) {
    const lastIndex = clipped.length - 1;
    clipped[lastIndex] = truncateByDisplayWidth(
      clipped[lastIndex],
      maxCharsPerLine,
    );
  }

  return clipped;
}
