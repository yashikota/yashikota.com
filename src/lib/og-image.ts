import { Resvg } from "@resvg/resvg-js";

type OgRenderInput = {
  titleLines: string[];
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
        `<tspan x="92" dy="${index === 0 ? 0 : 78}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const logoImage =
    '<image href="https://yashikota.com/logo.avif" x="86" y="54" width="260" height="58" preserveAspectRatio="xMinYMid meet" />';

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
  </defs>

  <rect width="1200" height="630" fill="url(#header-gradient)" />
  <rect x="44" y="38" width="1112" height="554" rx="34" fill="#0f172a" opacity="0.08" filter="url(#soft-shadow)" />
  <rect x="48" y="42" width="1104" height="546" rx="34" fill="url(#card-gradient)" stroke="#99f6e4" stroke-width="2" />

  ${logoImage}

  <text x="92" y="200" font-size="64" font-weight="700" fill="#0f172a">${titleText}</text>
  <text x="92" y="540" font-size="28" font-weight="700" fill="#0f766e">${safeTags}</text>
  <image href="https://yashikota.com/dango.png" x="820" y="310" width="350" height="300" opacity="0.28" preserveAspectRatio="xMidYMid meet" />
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
