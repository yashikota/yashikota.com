import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const FONT_URL =
  process.env.OG_FONT_URL ??
  "https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf";

const FONT_PATH = resolve(
  process.cwd(),
  ".cache/fonts/NotoSansJP-Variable.ttf",
);

const MIN_FONT_SIZE = 1_000_000;

async function hasUsableFont(path) {
  try {
    const file = await stat(path);
    return file.size >= MIN_FONT_SIZE;
  } catch {
    return false;
  }
}

async function downloadFont() {
  const response = await fetch(FONT_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to download OG font: ${response.status} ${response.statusText}`,
    );
  }

  const buffer = new Uint8Array(await response.arrayBuffer());
  if (buffer.byteLength < MIN_FONT_SIZE) {
    throw new Error(`Downloaded font looks too small (${buffer.byteLength} bytes)`);
  }

  await mkdir(dirname(FONT_PATH), { recursive: true });
  await writeFile(FONT_PATH, buffer);
}

if (await hasUsableFont(FONT_PATH)) {
  console.log(`[og-font] Reusing cached font: ${FONT_PATH}`);
} else {
  console.log(`[og-font] Downloading Noto Sans JP font from ${FONT_URL}`);
  await downloadFont();
  console.log(`[og-font] Saved font to ${FONT_PATH}`);
}
