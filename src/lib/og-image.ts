import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

type OgRenderInput = {
  titleLines: string[];
  tags: string[];
};

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const CARD_X = 48;
const CARD_Y = 42;
const CARD_WIDTH = 1104;
const CARD_HEIGHT = 546;

type OgAssets = {
  logoDataUri: string;
  dangoDataUri: string;
};

let cachedAssets: OgAssets | null = null;
let cachedFontOptions: {
  loadSystemFonts: boolean;
  defaultFontFamily: string;
  fontFiles?: string[];
} | null = null;

const OG_FONT_CANDIDATES = [
  ".cache/fonts/NotoSansJP-Variable.ttf",
  "public/fonts/NotoSansJP-Variable.ttf",
  "public/fonts/NotoSansJP-Bold.otf",
  "public/fonts/NotoSansJP-Regular.otf",
  "public/fonts/NotoSansJP-Bold.ttf",
  "public/fonts/NotoSansJP-Regular.ttf",
];

function toDataUri(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

async function loadOgAssets(): Promise<OgAssets> {
  if (cachedAssets) {
    return cachedAssets;
  }

  const [logoBuffer, iconBuffer] = await Promise.all([
    readFile(resolve(process.cwd(), "public/logo.png")),
    readFile(resolve(process.cwd(), "public/icon.png")),
  ]);

  cachedAssets = {
    logoDataUri: toDataUri(logoBuffer, "image/png"),
    dangoDataUri: toDataUri(iconBuffer, "image/png"),
  };

  return cachedAssets;
}

async function loadOgFontOptions(): Promise<{
  loadSystemFonts: boolean;
  defaultFontFamily: string;
  fontFiles?: string[];
}> {
  if (cachedFontOptions) {
    return cachedFontOptions;
  }

  const fontFiles: string[] = [];
  for (const candidate of OG_FONT_CANDIDATES) {
    const absolutePath = resolve(process.cwd(), candidate);
    try {
      await access(absolutePath);
      fontFiles.push(absolutePath);
    } catch {
      // Ignore missing files; fallback is handled below.
    }
  }

  cachedFontOptions =
    fontFiles.length > 0
      ? {
          loadSystemFonts: false,
          defaultFontFamily: "Noto Sans JP",
          fontFiles,
        }
      : {
          loadSystemFonts: true,
          defaultFontFamily: "sans-serif",
        };

  return cachedFontOptions;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function renderOgPng(input: OgRenderInput): Promise<Uint8Array> {
  const { logoDataUri, dangoDataUri } = await loadOgAssets();
  const fontOptions = await loadOgFontOptions();
  const safeTags = input.tags
    .slice(0, 3)
    .map((tag) => `#${escapeXml(tag)}`)
    .join(" ")
    .slice(0, 42);

  const titleText = input.titleLines
    .map(
      (line, index) =>
        `<tspan x="92" dy="${index === 0 ? 0 : 78}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const logoWidth = 368;
  const logoHeight = 84;
  const logoX = (OG_WIDTH - logoWidth) / 2;
  const logoY = 56;

  const dangoSize = 120;
  const dangoX = CARD_X + CARD_WIDTH - dangoSize - 30;
  const dangoY = CARD_Y + CARD_HEIGHT - dangoSize - 26;
  const dangoCenterX = dangoX + dangoSize / 2;
  const dangoCenterY = dangoY + dangoSize / 2;
  const dangoClipRadius = 54;
  const dangoBorderRadius = 62;
  const dangoInset = 4;
  const dangoImageX = dangoX + dangoInset;
  const dangoImageY = dangoY + dangoInset;
  const dangoImageSize = dangoSize - dangoInset * 2;

  const logoImage = `<image href="${logoDataUri}" x="${logoX}" y="${logoY}" width="${logoWidth}" height="${logoHeight}" preserveAspectRatio="xMidYMid meet" image-rendering="optimizeQuality" />`;

  const svg = `
<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="header-gradient" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6ee7b7" />
      <stop offset="50%" stop-color="#86efac" />
      <stop offset="100%" stop-color="#67e8f9" />
    </linearGradient>
    <linearGradient id="card-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f8fffd" />
    </linearGradient>
    <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="18" />
    </filter>
    <clipPath id="dango-clip">
      <circle cx="${dangoCenterX}" cy="${dangoCenterY}" r="${dangoClipRadius}" />
    </clipPath>
  </defs>

  <rect width="1200" height="630" fill="url(#header-gradient)" />
  <rect x="44" y="38" width="1112" height="554" rx="34" fill="#0f172a" opacity="0.08" filter="url(#soft-shadow)" />
  <rect x="${CARD_X}" y="${CARD_Y}" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="34" fill="url(#card-gradient)" stroke="#99f6e4" stroke-width="2" />

  ${logoImage}

  <text x="92" y="232" font-size="56" font-weight="700" fill="#0f172a">${titleText}</text>
  <text x="92" y="540" font-size="28" font-weight="700" fill="#0f766e">${safeTags}</text>
  <circle cx="${dangoCenterX}" cy="${dangoCenterY}" r="${dangoBorderRadius}" fill="#ffffff" stroke="#99f6e4" stroke-width="3" />
  <image href="${dangoDataUri}" x="${dangoImageX}" y="${dangoImageY}" width="${dangoImageSize}" height="${dangoImageSize}" clip-path="url(#dango-clip)" preserveAspectRatio="xMidYMid meet" image-rendering="optimizeQuality" />
</svg>
`;

  const resvg = new Resvg(svg, {
    imageRendering: 0,
    shapeRendering: 2,
    textRendering: 1,
    fitTo: {
      mode: "width",
      value: OG_WIDTH,
    },
    font: {
      ...fontOptions,
    },
  });

  return resvg.render().asPng();
}
