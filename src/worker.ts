type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
};

type ExecutionContextLike = {
  waitUntil(promise: Promise<unknown>): void;
};

type LinkPreview = {
  title: string;
  description: string;
  favicon: string;
  ogImage: string;
};

type RewriterElement = {
  getAttribute(name: string): string | null;
};

type RewriterText = {
  text: string;
};

type RewriterHandler = {
  element?(element: RewriterElement): void;
  text?(text: RewriterText): void;
};

type Rewriter = {
  on(selector: string, handlers: RewriterHandler): Rewriter;
  transform(response: Response): Response;
};

const PREVIEW_PATH = "/api/preview";
const CACHE_TTL_SECONDS = 60 * 60 * 24;
const MAX_REDIRECTS = 5;

class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

class TitleHandler {
  title = "";

  text(text: RewriterText) {
    const value = text.text.trim();
    if (!value) {
      return;
    }

    this.title = this.title ? `${this.title} ${value}` : value;
  }
}

class MetaHandler {
  title = "";
  description = "";
  ogImage = "";
  private titlePriority = 0;
  private descriptionPriority = 0;
  private imagePriority = 0;

  element(element: RewriterElement) {
    const property = element.getAttribute("property")?.toLowerCase();
    const name = element.getAttribute("name")?.toLowerCase();
    const content = element.getAttribute("content")?.trim();

    if (!content) {
      return;
    }

    if (property === "og:title") {
      this.setTitle(content, 3);
    } else if (name === "twitter:title") {
      this.setTitle(content, 2);
    }

    if (property === "og:description") {
      this.setDescription(content, 3);
    } else if (name === "twitter:description") {
      this.setDescription(content, 2);
    } else if (name === "description") {
      this.setDescription(content, 1);
    }

    if (property === "og:image") {
      this.setImage(content, 3);
    } else if (name === "twitter:image") {
      this.setImage(content, 2);
    }
  }

  private setTitle(value: string, priority: number) {
    if (priority >= this.titlePriority) {
      this.title = value;
      this.titlePriority = priority;
    }
  }

  private setDescription(value: string, priority: number) {
    if (priority >= this.descriptionPriority) {
      this.description = value;
      this.descriptionPriority = priority;
    }
  }

  private setImage(value: string, priority: number) {
    if (priority >= this.imagePriority) {
      this.ogImage = value;
      this.imagePriority = priority;
    }
  }
}

class FaviconHandler {
  favicon = "";
  private priority = 0;

  element(element: RewriterElement) {
    const rel = element.getAttribute("rel")?.toLowerCase();
    const href = element.getAttribute("href")?.trim();
    if (!rel || !href) {
      return;
    }

    const relTokens = rel.split(/\s+/);
    if (relTokens.includes("icon")) {
      this.setFavicon(href, 3);
    } else if (relTokens.includes("apple-touch-icon")) {
      this.setFavicon(href, 2);
    } else if (relTokens.includes("mask-icon")) {
      this.setFavicon(href, 1);
    }
  }

  private setFavicon(value: string, priority: number) {
    if (priority >= this.priority) {
      this.favicon = value;
      this.priority = priority;
    }
  }
}

const json = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      ...init?.headers,
    },
  });

const toAbsoluteUrl = (baseUrl: string, value: string): string => {
  if (!value) {
    return "";
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return "";
  }
};

const isPrivateIPv4 = (hostname: string): boolean => {
  const parts = hostname.split(".");
  if (parts.length !== 4) {
    return false;
  }

  const numbers = parts.map((part) => Number(part));
  if (
    numbers.some(
      (part, index) =>
        !Number.isInteger(part) ||
        part < 0 ||
        part > 255 ||
        parts[index] !== String(part),
    )
  ) {
    return false;
  }

  const [a, b] = numbers;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
};

const isPrivateIPv6 = (hostname: string): boolean => {
  const normalized = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (!normalized.includes(":")) {
    return false;
  }

  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:")
  );
};

const isBlockedHostname = (hostname: string): boolean => {
  const normalized = hostname.toLowerCase().replace(/\.$/, "");

  return (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local") ||
    isPrivateIPv4(normalized) ||
    isPrivateIPv6(normalized)
  );
};

const parseTargetUrl = (rawUrl: string | null): URL => {
  if (!rawUrl) {
    throw new HttpError("URL parameter is required", 400);
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl);
  } catch {
    throw new HttpError("URL parameter must be a valid URL", 400);
  }

  assertAllowedTargetUrl(targetUrl);

  return targetUrl;
};

const assertAllowedTargetUrl = (targetUrl: URL) => {
  if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
    throw new HttpError("URL protocol must be http or https", 400);
  }

  if (targetUrl.username || targetUrl.password) {
    throw new HttpError("URL credentials are not allowed", 400);
  }

  if (isBlockedHostname(targetUrl.hostname)) {
    throw new HttpError("URL hostname is not allowed", 403);
  }
};

const getDefaultCache = (): Cache | undefined => {
  const cacheStorage = (
    globalThis as typeof globalThis & {
      caches?: CacheStorage & { default?: Cache };
    }
  ).caches;

  return cacheStorage?.default;
};

const getHtmlRewriter = () => {
  const HtmlRewriter = (
    globalThis as typeof globalThis & {
      HTMLRewriter?: new () => Rewriter;
    }
  ).HTMLRewriter;

  if (!HtmlRewriter) {
    throw new Error("HTMLRewriter is not available");
  }

  return HtmlRewriter;
};

const createCacheKey = (request: Request, targetUrl: URL) => {
  const cacheUrl = new URL(PREVIEW_PATH, request.url);
  cacheUrl.searchParams.set("url", targetUrl.toString());
  return new Request(cacheUrl.toString(), { method: "GET" });
};

const fetchTarget = async (
  targetUrl: URL,
  redirects = 0,
): Promise<Response> => {
  const response = await fetch(targetUrl.toString(), {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "yashikota.com link preview bot",
    },
    redirect: "manual",
  });

  if (response.status >= 300 && response.status < 400) {
    if (redirects >= MAX_REDIRECTS) {
      throw new HttpError("Too many redirects", 508);
    }

    const location = response.headers.get("location");
    if (!location) {
      throw new HttpError("Redirect location is missing", 502);
    }

    const redirectUrl = new URL(location, response.url || targetUrl.toString());
    assertAllowedTargetUrl(redirectUrl);
    return fetchTarget(redirectUrl, redirects + 1);
  }

  return response;
};

const fetchPreview = async (targetUrl: URL): Promise<LinkPreview> => {
  const response = await fetchTarget(targetUrl);

  if (!response.ok) {
    throw new HttpError("Failed to fetch URL", response.status);
  }

  const contentType = response.headers.get("content-type")?.toLowerCase();
  if (
    contentType &&
    !contentType.includes("text/html") &&
    !contentType.includes("application/xhtml+xml")
  ) {
    throw new HttpError("URL did not return HTML", 415);
  }

  const titleHandler = new TitleHandler();
  const metaHandler = new MetaHandler();
  const faviconHandler = new FaviconHandler();
  const HtmlRewriter = getHtmlRewriter();

  await new HtmlRewriter()
    .on("title", titleHandler)
    .on("meta", metaHandler)
    .on("link", faviconHandler)
    .transform(response)
    .text();

  const finalUrl = response.url || targetUrl.toString();

  return {
    title: metaHandler.title || titleHandler.title,
    description: metaHandler.description,
    favicon: toAbsoluteUrl(finalUrl, faviconHandler.favicon),
    ogImage: toAbsoluteUrl(finalUrl, metaHandler.ogImage),
  };
};

const handlePreview = async (
  request: Request,
  ctx: ExecutionContextLike,
): Promise<Response> => {
  if (request.method !== "GET") {
    return json(
      { error: "Method not allowed" },
      {
        status: 405,
        headers: {
          Allow: "GET",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  let targetUrl: URL;
  try {
    targetUrl = parseTargetUrl(new URL(request.url).searchParams.get("url"));
  } catch (error) {
    if (error instanceof HttpError) {
      return json(
        { error: error.message },
        { status: error.status, headers: { "Cache-Control": "no-store" } },
      );
    }

    throw error;
  }

  const cache = getDefaultCache();
  const cacheKey = createCacheKey(request, targetUrl);
  const cachedResponse = await cache?.match(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const preview = await fetchPreview(targetUrl);
    const response = json(preview, {
      headers: {
        "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
      },
    });

    ctx.waitUntil(cache?.put(cacheKey, response.clone()) ?? Promise.resolve());
    return response;
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message =
      error instanceof HttpError ? error.message : "Failed to process URL";
    return json(
      { error: message },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContextLike,
  ): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === PREVIEW_PATH) {
      return handlePreview(request, ctx);
    }

    return env.ASSETS.fetch(request);
  },
};
