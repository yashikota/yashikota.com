import {
  createMinimalLinkCardData,
  decodeDisplayUrl,
  getFaviconFallbackUrl,
  type LinkCardData,
  renderLinkCardHtml,
} from "./lib/link-card";

const HTML_CONTENT_TYPES = ["text/html", "application/xhtml+xml"];
const LINK_CARD_CACHE_TTL_SECONDS = 60 * 60 * 24;
const LINK_CARD_ERROR_TTL_SECONDS = 60 * 10;
const REMOTE_FETCH_TIMEOUT_MS = 5000;
const LINK_CARD_CACHE_URL =
  "https://link-card-cache.yashikota.internal/preview";

type AssetBinding = {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
};

type Env = {
  ASSETS: AssetBinding;
};

type ExecutionContextLike = {
  waitUntil(promise: Promise<unknown>): void;
};

type CloudflareCacheStorage = CacheStorage & {
  default: Cache;
};

type LinkPreviewMetadata = {
  description?: string;
  faviconUrl?: string;
  ogImageUrl?: string;
  title?: string;
};

type LinkPreviewResult = {
  data: LinkCardData;
  ttl: number;
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContextLike,
  ): Promise<Response> {
    const response = await env.ASSETS.fetch(request);

    if (!shouldRewriteHtml(request, response)) {
      return response;
    }

    return new HTMLRewriter()
      .on(
        'a[data-link-card="true"]',
        new LinkCardElementHandler({
          ctx,
        }),
      )
      .transform(response);
  },
};

class LinkCardElementHandler {
  constructor(
    private readonly options: {
      ctx: ExecutionContextLike;
    },
  ) {}

  async element(element: any): Promise<void> {
    const rawUrl =
      element.getAttribute("data-link-card-url") ||
      element.getAttribute("href");
    const displayUrl = decodeDisplayUrl(
      element.getAttribute("data-link-card-display-url") || "",
    );
    const url = tryParseHttpUrl(rawUrl);

    if (!url) {
      return;
    }

    const preview = await getLinkPreview(url, displayUrl, this.options.ctx);
    element.replace(renderLinkCardHtml(preview), {
      html: true,
    });
  }
}

function shouldRewriteHtml(request: Request, response: Response): boolean {
  if (request.method !== "GET") {
    return false;
  }

  if (!response.ok || !response.body) {
    return false;
  }

  const contentType = response.headers.get("content-type") || "";
  return HTML_CONTENT_TYPES.some((type) => contentType.includes(type));
}

async function getLinkPreview(
  url: URL,
  displayUrl: string,
  ctx: ExecutionContextLike,
): Promise<LinkCardData> {
  const cache = (caches as CloudflareCacheStorage).default;
  const cacheKey = createCacheKey(url);
  const cached = await cache.match(cacheKey);

  if (cached) {
    return (await cached.json()) as LinkCardData;
  }

  const previewResult = await buildLinkPreview(url, displayUrl);
  const cacheResponse = new Response(JSON.stringify(previewResult.data), {
    headers: {
      "Cache-Control": `public, max-age=0, s-maxage=${previewResult.ttl}`,
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  ctx.waitUntil(cache.put(cacheKey, cacheResponse));

  return previewResult.data;
}

async function buildLinkPreview(
  url: URL,
  displayUrl: string,
): Promise<LinkPreviewResult> {
  const fallback = createMinimalLinkCardData(url, displayUrl);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "yashikota.com link-card fetcher/1.0",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(REMOTE_FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      return {
        data: fallback,
        ttl: LINK_CARD_ERROR_TTL_SECONDS,
      };
    }

    const contentType = response.headers.get("content-type") || "";
    if (!HTML_CONTENT_TYPES.some((type) => contentType.includes(type))) {
      return {
        data: fallback,
        ttl: LINK_CARD_ERROR_TTL_SECONDS,
      };
    }

    const resolvedUrl = tryParseHttpUrl(response.url) || url;
    const metadata = await extractLinkPreviewMetadata(response, resolvedUrl);
    const title = metadata.title || resolvedUrl.hostname;

    return {
      data: {
        title,
        description: metadata.description || "",
        faviconUrl:
          metadata.faviconUrl || getFaviconFallbackUrl(resolvedUrl.hostname),
        ogImageUrl: metadata.ogImageUrl || "",
        displayUrl: displayUrl || resolvedUrl.hostname,
        url: url.toString(),
      },
      ttl: LINK_CARD_CACHE_TTL_SECONDS,
    };
  } catch {
    return {
      data: fallback,
      ttl: LINK_CARD_ERROR_TTL_SECONDS,
    };
  }
}

async function extractLinkPreviewMetadata(
  response: Response,
  baseUrl: URL,
): Promise<LinkPreviewMetadata> {
  const collector = new MetadataCollector(baseUrl);

  const transformed = new HTMLRewriter()
    .on(
      'meta[property="og:title"]',
      new ContentAttributeHandler((value) => collector.setTitle(value)),
    )
    .on(
      'meta[name="twitter:title"]',
      new ContentAttributeHandler((value) => collector.setTitle(value)),
    )
    .on(
      'meta[property="og:description"]',
      new ContentAttributeHandler((value) => collector.setDescription(value)),
    )
    .on(
      'meta[name="description"]',
      new ContentAttributeHandler((value) => collector.setDescription(value)),
    )
    .on(
      'meta[name="twitter:description"]',
      new ContentAttributeHandler((value) => collector.setDescription(value)),
    )
    .on(
      'meta[property="og:image"]',
      new ContentAttributeHandler((value) => collector.setOgImage(value)),
    )
    .on(
      'meta[name="twitter:image"]',
      new ContentAttributeHandler((value) => collector.setOgImage(value)),
    )
    .on(
      'link[rel="icon"]',
      new HrefAttributeHandler((value) => collector.setFavicon(value)),
    )
    .on(
      'link[rel="shortcut icon"]',
      new HrefAttributeHandler((value) => collector.setFavicon(value)),
    )
    .on(
      'link[rel="apple-touch-icon"]',
      new HrefAttributeHandler((value) => collector.setFavicon(value)),
    )
    .on("title", new TitleTextHandler((value) => collector.setTitle(value)))
    .transform(response);

  await transformed.text();

  return collector.data;
}

class MetadataCollector {
  data: LinkPreviewMetadata = {};

  constructor(private readonly baseUrl: URL) {}

  setDescription(value: string) {
    if (!this.data.description) {
      this.data.description = value;
    }
  }

  setFavicon(value: string) {
    if (!this.data.faviconUrl) {
      this.data.faviconUrl = resolveUrl(value, this.baseUrl);
    }
  }

  setOgImage(value: string) {
    if (!this.data.ogImageUrl) {
      this.data.ogImageUrl = resolveUrl(value, this.baseUrl);
    }
  }

  setTitle(value: string) {
    if (!this.data.title) {
      this.data.title = value;
    }
  }
}

class ContentAttributeHandler {
  constructor(private readonly onValue: (value: string) => void) {}

  element(element: any) {
    const value = normalizeMetadataValue(element.getAttribute("content"));
    if (value) {
      this.onValue(value);
    }
  }
}

class HrefAttributeHandler {
  constructor(private readonly onValue: (value: string) => void) {}

  element(element: any) {
    const value = normalizeMetadataValue(element.getAttribute("href"));
    if (value) {
      this.onValue(value);
    }
  }
}

class TitleTextHandler {
  private chunks: string[] = [];

  constructor(private readonly onValue: (value: string) => void) {}

  text(text: any) {
    const value = normalizeMetadataValue(text.text);
    if (value) {
      this.chunks.push(value);
    }

    if (text.lastInTextNode) {
      const combined = normalizeMetadataValue(this.chunks.join(" "));
      if (combined) {
        this.onValue(combined);
      }
    }
  }
}

function normalizeMetadataValue(value: string | null | undefined): string {
  return value?.trim().replace(/\s+/g, " ") || "";
}

function resolveUrl(value: string, baseUrl: URL): string | undefined {
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return undefined;
  }
}

function createCacheKey(url: URL): Request {
  return new Request(
    `${LINK_CARD_CACHE_URL}?url=${encodeURIComponent(url.toString())}`,
  );
}

function tryParseHttpUrl(value: string | null | undefined): URL | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }
    return url;
  } catch {
    return undefined;
  }
}
