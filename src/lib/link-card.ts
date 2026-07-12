export type LinkCardData = {
  description?: string;
  displayUrl: string;
  faviconUrl?: string;
  ogImageUrl?: string;
  title: string;
  url: string;
};

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function getLinkCardClassName(value: string): string {
  return `remark-link-card-plus__${value}`;
}

export function decodeDisplayUrl(value: string): string {
  try {
    return decodeURI(value);
  } catch {
    return value;
  }
}

export function getDisplayUrl(
  url: URL,
  { shortenUrl = true }: { shortenUrl?: boolean } = {},
): string {
  return decodeDisplayUrl(shortenUrl ? url.hostname : url.toString());
}

export function createLinkCardPlaceholder(
  url: URL,
  { shortenUrl = true }: { shortenUrl?: boolean } = {},
): string {
  const normalizedUrl = url.toString();
  const displayUrl = getDisplayUrl(url, { shortenUrl });

  return `
<div class="${getLinkCardClassName("container")}">
  <a href="${escapeHtml(normalizedUrl)}" data-link-card="true" data-link-card-url="${escapeHtml(normalizedUrl)}" data-link-card-display-url="${escapeHtml(displayUrl)}">${escapeHtml(normalizedUrl)}</a>
</div>
`.trim();
}

export function createMinimalLinkCardData(
  url: URL,
  displayUrl?: string,
): LinkCardData {
  return {
    title: url.hostname,
    description: "",
    faviconUrl: getFaviconFallbackUrl(url.hostname),
    ogImageUrl: "",
    displayUrl: displayUrl || getDisplayUrl(url),
    url: url.toString(),
  };
}

export function renderLinkCardHtml(data: LinkCardData): string {
  const thumbnail = data.ogImageUrl
    ? `
<div class="${getLinkCardClassName("thumbnail")}">
  <img src="${escapeHtml(data.ogImageUrl)}" class="${getLinkCardClassName("image")}" alt="ogImage">
</div>`
    : "";

  const favicon = data.faviconUrl
    ? `<img src="${escapeHtml(data.faviconUrl)}" class="${getLinkCardClassName("favicon")}" width="14" height="14" alt="favicon">`
    : "";

  const description = data.description
    ? `<div class="${getLinkCardClassName("description")}">${escapeHtml(data.description)}</div>`
    : "";

  return `
<a href="${escapeHtml(data.url)}" target="_blank" rel="noreferrer noopener" class="${getLinkCardClassName("card")}">
  <div class="${getLinkCardClassName("main")}">
    <div class="${getLinkCardClassName("content")}">
      <div class="${getLinkCardClassName("title")}">${escapeHtml(data.title)}</div>
      ${description}
    </div>
    <div class="${getLinkCardClassName("meta")}">
      ${favicon}
      <span class="${getLinkCardClassName("url")}">${escapeHtml(data.displayUrl)}</span>
    </div>
  </div>
  ${thumbnail}
</a>
`
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

export function getFaviconFallbackUrl(hostname: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=256`;
}
