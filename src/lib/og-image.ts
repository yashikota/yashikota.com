import { Resvg } from "@resvg/resvg-js";

type OgRenderInput = {
  titleLines: string[];
  category: string;
  pubDate: string;
  tags: string[];
};

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function renderOgPng(input: OgRenderInput): Promise<Uint8Array> {
  const safeTags = input.tags
    .slice(0, 3)
    .map((tag) => `#${escapeXml(tag)}`)
    .join(" ");

  const titleText = input.titleLines
    .map(
      (line, index) =>
        `<tspan x="92" dy="${index === 0 ? 0 : 84}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const svg = `
<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e0f2fe" />
      <stop offset="100%" stop-color="#dbeafe" />
    </linearGradient>
    <filter id="blur-48" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="48" />
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)" />
  <image href="https://yashikota.com/dango.png" x="760" y="120" width="520" height="520" opacity="0.22" preserveAspectRatio="xMidYMid slice" />
  <circle cx="1020" cy="90" r="110" fill="#93c5fd" filter="url(#blur-48)" opacity="0.35" />
  <circle cx="180" cy="560" r="170" fill="#38bdf8" filter="url(#blur-48)" opacity="0.2" />

  <rect x="60" y="58" width="1080" height="514" rx="30" fill="white" fill-opacity="0.86" stroke="#bfdbfe" stroke-width="2" />
  <text x="92" y="132" font-size="30" font-weight="700" fill="#0369a1">yashikota.com</text>
  <text x="92" y="178" font-size="26" font-weight="700" fill="#334155">${escapeXml(input.category.toUpperCase())} ・ ${escapeXml(input.pubDate)}</text>

  <text x="92" y="276" font-size="66" font-weight="700" fill="#0f172a">${titleText}</text>
  <text x="92" y="544" font-size="28" font-weight="700" fill="#0369a1">${safeTags}</text>
</svg>
`;

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: OG_WIDTH,
    },
    font: {
      loadSystemFonts: true,
      defaultFontFamily: "sans-serif",
    },
  });

  return resvg.render().asPng();
}
