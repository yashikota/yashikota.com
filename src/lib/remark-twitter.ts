import type { Html, PhrasingContent, Root, Text } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

type Options = {
  lang?: string;
};

type MediaType = 0 | 1 | 2;

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

type TweetTarget = {
  id: string;
  screenName: string;
  hideConversation: boolean;
};

type Indices = [number, number];

type HashtagEntity = {
  indices: Indices;
  text: string;
};

type UserMentionEntity = {
  id_str: string;
  indices: Indices;
  name: string;
  screen_name: string;
};

type UrlEntity = {
  display_url: string;
  expanded_url: string;
  indices: Indices;
  url: string;
};

type MediaEntity = {
  display_url: string;
  expanded_url: string;
  indices: Indices;
  url: string;
};

type SymbolEntity = {
  indices: Indices;
  text: string;
};

type TweetEntities = {
  hashtags: HashtagEntity[];
  urls: UrlEntity[];
  user_mentions: UserMentionEntity[];
  symbols: SymbolEntity[];
  media?: MediaEntity[];
};

type TweetUser = {
  name: string;
  profile_image_shape?: "Circle" | "Square";
  profile_image_url_https: string;
  screen_name: string;
  verified?: boolean;
  verified_type?: "Business" | "Government";
  is_blue_verified?: boolean;
};

type VideoVariant = {
  bitrate?: number;
  content_type: "video/mp4" | "application/x-mpegURL" | string;
  url: string;
};

type MediaDetails = {
  display_url: string;
  expanded_url: string;
  ext_alt_text?: string;
  indices: Indices;
  media_url_https: string;
  original_info: {
    height: number;
    width: number;
  };
  type: "photo" | "video" | "animated_gif";
  url: string;
  video_info?: {
    variants: VideoVariant[];
  };
};

type TweetPhoto = {
  expandedUrl?: string;
  height: number;
  url: string;
  width: number;
};

type TweetVideoVariant = {
  bitrate?: number;
  src: string;
  type: string;
};

type TweetVideo = {
  contentType?: string;
  poster: string;
  variants: TweetVideoVariant[];
};

type TweetBase = {
  created_at: string;
  display_text_range: Indices;
  entities: TweetEntities;
  id_str: string;
  lang: string;
  mediaDetails?: MediaDetails[];
  photos?: TweetPhoto[];
  text: string;
  user: TweetUser;
  video?: TweetVideo;
};

type QuotedTweet = TweetBase & {
  favorite_count?: number;
  reply_count?: number;
  retweet_count?: number;
};

type TweetResult = TweetBase & {
  __typename?: string;
  conversation_count: number;
  favorite_count: number;
  in_reply_to_screen_name?: string;
  in_reply_to_status_id_str?: string;
  quoted_tweet?: QuotedTweet;
  retweet_count?: number;
  retweeted_tweet?: {
    conversation_count?: number;
    favorite_count?: number;
    in_reply_to_screen_name?: string;
    mediaDetails?: MediaDetails[];
    quoted_tweet?: QuotedTweet;
    retweet_count?: number;
  } & TweetBase;
};

type OEmbedResponse = {
  author_name: string;
  author_url: string;
  cache_age?: string;
  html: string;
  url: string;
};

type RenderEntity =
  | {
      text: string;
      type: "text";
    }
  | {
      href: string;
      text: string;
      type: "hashtag" | "mention" | "symbol" | "url";
    };

const DEFAULT_LANG = "ja";
const ONE_HOUR_MS = 60 * 60 * 1000;

const MEDIA_TYPE_NOT_HAVE: MediaType = 0;
const MEDIA_TYPE_IMAGE_OR_VIDEO: MediaType = 1;
const MEDIA_TYPE_TWEET_HAVE_IMAGE_OR_VIDEO: MediaType = 2;

const TWEET_STATUS_RE = /^\/([A-Za-z0-9_]{1,15})\/status(?:es)?\/(\d+)/;
const SUPPORTED_TWEET_HOSTS = new Set([
  "twitter.com",
  "www.twitter.com",
  "mobile.twitter.com",
  "x.com",
  "www.x.com",
  "mobile.x.com",
]);
const TWITTER_WEB_HOSTS = new Set([
  "twitter.com",
  "www.twitter.com",
  "x.com",
  "www.x.com",
]);
const TCO_HOSTS = new Set(["t.co"]);
const PIC_HOSTS = new Set(["pic.twitter.com", "pic.x.com"]);
const REDIRECT_STATUS = new Set([301, 302, 303, 307, 308]);
const SAFE_PROTOCOLS = new Set(["http:", "https:"]);

const TWEET_RESULT_FEATURES = [
  "tfw_timeline_list:",
  "tfw_follower_count_sunset:true",
  "tfw_tweet_edit_backend:on",
  "tfw_refsrc_session:on",
  "tfw_fosnr_soft_interventions_enabled:on",
  "tfw_show_birdwatch_pivots_enabled:on",
  "tfw_show_business_verified_badge:on",
  "tfw_duplicate_scribes_to_settings:on",
  "tfw_use_profile_image_shape_enabled:on",
  "tfw_show_blue_verified_badge:on",
  "tfw_legacy_timeline_sunset:true",
  "tfw_show_gov_verified_badge:on",
  "tfw_show_business_affiliate_badge:on",
  "tfw_tweet_edit_frontend:on",
].join(";");

const oEmbedCache = new Map<string, CacheEntry<OEmbedResponse | null>>();
const tweetResultCache = new Map<string, CacheEntry<TweetResult | null>>();
const redirectCache = new Map<string, CacheEntry<string | null>>();
const mediaTypeCache = new Map<string, CacheEntry<MediaType>>();

const formatter = new Intl.DateTimeFormat("ja-JP", {
  day: "2-digit",
  hour: "2-digit",
  hour12: false,
  hourCycle: "h23",
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Tokyo",
  year: "numeric",
});

type DisplayTweet = TweetBase & {
  conversation_count: number;
  favorite_count: number;
  in_reply_to_screen_name?: string;
  quoted_tweet?: QuotedTweet;
  retweet_count?: number;
};

type WorkItem = {
  index: number;
  target: TweetTarget;
};

const remarkTwitter: Plugin<[Options?], Root> =
  (userOptions = {}) =>
  async (tree) => {
    const options = {
      lang: userOptions.lang ?? DEFAULT_LANG,
    };
    const targets: WorkItem[] = [];

    visit(tree, "paragraph", (paragraph, index, parent) => {
      if (
        parent?.type !== "root" ||
        index === undefined ||
        paragraph.children.length !== 1
      ) {
        return;
      }

      const url = getTweetUrlFromParagraphChild(paragraph.children[0]);
      if (!url) {
        return;
      }

      const target = parseTweetUrl(url);
      if (!target) {
        return;
      }

      targets.push({
        index,
        target,
      });
    });

    const renderedCards = await Promise.all(
      targets.map(async ({ index, target }) => {
        const html = await renderTweet(target, options.lang);
        return {
          html,
          index,
        };
      }),
    );

    for (const { html, index } of renderedCards) {
      if (!html) {
        continue;
      }

      const node: Html = {
        type: "html",
        value: html,
      };
      tree.children.splice(index, 1, node);
    }

    return tree;
  };

function getTweetUrlFromParagraphChild(child: PhrasingContent): string | null {
  if (child.type === "text") {
    const value = child.value.trim();
    if (!URL.canParse(value)) {
      return null;
    }
    return value;
  }

  if (child.type === "link") {
    const hasOneChildText =
      child.children.length === 1 && child.children[0].type === "text";
    if (!hasOneChildText) {
      return null;
    }

    const childText = child.children[0] as Text;
    if (!isSameUrlValue(child.url, childText.value)) {
      return null;
    }
    return child.url;
  }

  return null;
}

function parseTweetUrl(rawUrl: string): TweetTarget | null {
  if (!URL.canParse(rawUrl)) {
    return null;
  }

  const url = new URL(rawUrl);
  const host = url.hostname.toLowerCase();
  if (!SUPPORTED_TWEET_HOSTS.has(host)) {
    return null;
  }

  const match = url.pathname.match(TWEET_STATUS_RE);
  if (!match) {
    return null;
  }

  const [, screenName, id] = match;
  return {
    hideConversation: url.searchParams.get("conversation") === "none",
    id,
    screenName,
  };
}

function buildCanonicalTweetUrl(screenName: string, id: string): string {
  return `https://x.com/${screenName}/status/${id}`;
}

function buildTweetPermalink(tweet: TweetBase): string {
  return buildCanonicalTweetUrl(tweet.user.screen_name, tweet.id_str);
}

function toLikeUrl(tweetId: string): string {
  return `https://x.com/intent/like?tweet_id=${tweetId}`;
}

function toRetweetUrl(tweetId: string): string {
  return `https://x.com/intent/retweet?tweet_id=${tweetId}`;
}

function toReplyUrl(tweetId: string): string {
  return `https://x.com/intent/tweet?in_reply_to=${tweetId}`;
}

async function renderTweet(
  target: TweetTarget,
  lang: string,
): Promise<string | null> {
  const canonicalUrl = buildCanonicalTweetUrl(target.screenName, target.id);
  const [tweetResult, oEmbed] = await Promise.all([
    fetchTweetResult(target.id, lang),
    fetchOEmbed(canonicalUrl, lang, target.hideConversation),
  ]);

  const displayTweet = tweetResult
    ? await resolveDisplayTweet(tweetResult, lang, oEmbed?.html ?? "")
    : null;

  const mediaType = await detectHasMediaByTweet(target, displayTweet, oEmbed);

  if (!displayTweet) {
    return renderFallbackEmbed(target, canonicalUrl, oEmbed, mediaType);
  }

  return renderTweetCard(displayTweet, mediaType);
}

async function fetchTweetResult(
  id: string,
  lang: string,
): Promise<TweetResult | null> {
  const cacheKey = `${id}:${lang}`;
  const cached = readCache(tweetResultCache, cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const url = new URL("https://cdn.syndication.twimg.com/tweet-result");
  url.searchParams.set("id", id);
  url.searchParams.set("lang", lang);
  url.searchParams.set("token", getSyndicationToken(id));
  url.searchParams.set("features", TWEET_RESULT_FEATURES);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!res.ok) {
      writeCache(tweetResultCache, cacheKey, null);
      return null;
    }

    const data = (await res.json()) as TweetResult;
    if (
      !data ||
      Object.keys(data).length === 0 ||
      data.__typename === "TweetTombstone"
    ) {
      writeCache(tweetResultCache, cacheKey, null);
      return null;
    }

    writeCache(tweetResultCache, cacheKey, data);
    return data;
  } catch (error) {
    console.error(
      `[remark-twitter] Failed to fetch tweet-result (${id}): ${error}`,
    );
    writeCache(tweetResultCache, cacheKey, null);
    return null;
  }
}

async function fetchOEmbed(
  tweetUrl: string,
  lang: string,
  hideConversation: boolean,
): Promise<OEmbedResponse | null> {
  const cacheKey = `${tweetUrl}:${lang}:${hideConversation}`;
  const cached = readCache(oEmbedCache, cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const endpoint = new URL("https://publish.twitter.com/oembed");
  endpoint.searchParams.set("url", tweetUrl);
  endpoint.searchParams.set("omit_script", "1");
  endpoint.searchParams.set("dnt", "true");
  endpoint.searchParams.set("lang", lang);
  endpoint.searchParams.set("maxwidth", "550");
  if (hideConversation) {
    endpoint.searchParams.set("hide_thread", "true");
  }

  try {
    const res = await fetch(endpoint, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });
    if (!res.ok) {
      writeCache(oEmbedCache, cacheKey, null);
      return null;
    }

    const data = (await res.json()) as OEmbedResponse;
    if (!data?.html) {
      writeCache(oEmbedCache, cacheKey, null);
      return null;
    }

    const cacheAgeSec = Number.parseInt(data.cache_age ?? "0", 10);
    writeCache(
      oEmbedCache,
      cacheKey,
      data,
      Number.isFinite(cacheAgeSec) ? cacheAgeSec * 1000 : ONE_HOUR_MS,
    );
    return data;
  } catch (error) {
    console.error(
      `[remark-twitter] Failed to fetch oEmbed (${tweetUrl}): ${error}`,
    );
    writeCache(oEmbedCache, cacheKey, null);
    return null;
  }
}

async function detectHasMediaByTweet(
  target: TweetTarget,
  displayTweet: DisplayTweet | null,
  oEmbed: OEmbedResponse | null,
): Promise<MediaType> {
  const key = `${target.screenName}:${target.id}:${target.hideConversation}`;
  const cached = readCache(mediaTypeCache, key);
  if (cached !== undefined) {
    return cached;
  }

  const mediaTypeFromData = detectHasMediaFromDisplayTweet(displayTweet);
  if (
    mediaTypeFromData === MEDIA_TYPE_IMAGE_OR_VIDEO ||
    mediaTypeFromData === MEDIA_TYPE_TWEET_HAVE_IMAGE_OR_VIDEO
  ) {
    writeCache(mediaTypeCache, key, mediaTypeFromData);
    return mediaTypeFromData;
  }

  const result = await detectHasMediaWithDepth(target, oEmbed?.html ?? "", 0);
  writeCache(mediaTypeCache, key, result);
  return result;
}

function detectHasMediaFromDisplayTweet(
  displayTweet: DisplayTweet | null,
): MediaType {
  if (!displayTweet) {
    return MEDIA_TYPE_NOT_HAVE;
  }

  if (getRenderableMediaList(displayTweet).length > 0) {
    return MEDIA_TYPE_IMAGE_OR_VIDEO;
  }

  if (
    displayTweet.quoted_tweet &&
    getRenderableMediaList(displayTweet.quoted_tweet).length > 0
  ) {
    return MEDIA_TYPE_TWEET_HAVE_IMAGE_OR_VIDEO;
  }

  return MEDIA_TYPE_NOT_HAVE;
}

async function detectHasMediaWithDepth(
  target: TweetTarget,
  html: string,
  depth: number,
): Promise<MediaType> {
  if (!html || depth > 2) {
    return MEDIA_TYPE_NOT_HAVE;
  }

  const mediaLinks = getMediaLinks(html);

  if (hasTwitterPictureLink(mediaLinks)) {
    return MEDIA_TYPE_IMAGE_OR_VIDEO;
  }

  for (const url of mediaLinks) {
    if (!URL.canParse(url)) {
      continue;
    }

    const parsed = new URL(url);
    if (!TCO_HOSTS.has(parsed.hostname.toLowerCase())) {
      continue;
    }

    const location = await resolveRedirectLocation(url);
    if (!location || !URL.canParse(location)) {
      continue;
    }

    const locationUrl = new URL(location);
    const host = locationUrl.hostname.toLowerCase();
    if (!TWITTER_WEB_HOSTS.has(host)) {
      continue;
    }

    if (
      locationUrl.pathname.includes("/photo/") ||
      locationUrl.pathname.includes("/video/")
    ) {
      return MEDIA_TYPE_IMAGE_OR_VIDEO;
    }

    const nested = parseTweetUrl(location);
    if (!nested || nested.id === target.id) {
      continue;
    }

    const nestedOEmbed = await fetchOEmbed(
      buildCanonicalTweetUrl(nested.screenName, nested.id),
      DEFAULT_LANG,
      nested.hideConversation,
    );
    const nestedType = await detectHasMediaWithDepth(
      nested,
      nestedOEmbed?.html ?? "",
      depth + 1,
    );
    if (
      nestedType === MEDIA_TYPE_IMAGE_OR_VIDEO ||
      nestedType === MEDIA_TYPE_TWEET_HAVE_IMAGE_OR_VIDEO
    ) {
      return MEDIA_TYPE_TWEET_HAVE_IMAGE_OR_VIDEO;
    }
  }

  return MEDIA_TYPE_NOT_HAVE;
}

function getMediaLinks(html: string): string[] {
  const links = new Set<string>();

  const hrefRegex = /href="([^"]+)"/g;
  for (const match of html.matchAll(hrefRegex)) {
    const value = normalizeUrlCandidate(match[1]);
    if (value) {
      links.add(value);
    }
  }

  const textOnly = html.replace(/<[^>]+>/g, " ");
  const textUrlRegex = /https?:\/\/[^\s<>"]+/g;
  for (const match of textOnly.matchAll(textUrlRegex)) {
    const value = normalizeUrlCandidate(match[0]);
    if (value) {
      links.add(value);
    }
  }

  return [...links];
}

function hasTwitterPictureLink(urls: string[]): boolean {
  for (const raw of urls) {
    if (!URL.canParse(raw)) {
      continue;
    }
    const hostname = new URL(raw).hostname.toLowerCase();
    if (PIC_HOSTS.has(hostname)) {
      return true;
    }
  }
  return false;
}

function normalizeUrlCandidate(value: string): string | null {
  const decoded = decodeHtmlEntities(value).trim();
  const trimmed = decoded.replace(/[),.;!?]+$/, "");
  return URL.canParse(trimmed) ? trimmed : null;
}

async function resolveRedirectLocation(url: string): Promise<string | null> {
  const cached = readCache(redirectCache, url);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      method: "GET",
      redirect: "manual",
    });

    if (!REDIRECT_STATUS.has(res.status)) {
      writeCache(redirectCache, url, null);
      return null;
    }

    const location = res.headers.get("location");
    if (!location) {
      writeCache(redirectCache, url, null);
      return null;
    }

    const normalized = URL.canParse(location)
      ? location
      : new URL(location, url).toString();
    writeCache(redirectCache, url, normalized);
    return normalized;
  } catch (error) {
    console.error(
      `[remark-twitter] Failed to resolve redirect (${url}): ${error}`,
    );
    writeCache(redirectCache, url, null);
    return null;
  }
}

function renderTweetCard(
  displayTweet: DisplayTweet,
  mediaType: MediaType,
): string {
  const tweetUrl = buildTweetPermalink(displayTweet);
  const bodyEntities = buildRenderEntities(displayTweet);
  const createdAtDate = new Date(displayTweet.created_at);
  const createdAtText = formatDate(createdAtDate);
  const quoted = displayTweet.quoted_tweet
    ? renderQuotedTweet(displayTweet.quoted_tweet)
    : "";
  const media = renderMedia(getRenderableMediaList(displayTweet), tweetUrl);
  const inReplyTo = displayTweet.in_reply_to_screen_name
    ? `<div class="remark-x-embed__in-reply-to">Replying to <a href="https://x.com/${escapeAttribute(displayTweet.in_reply_to_screen_name)}" target="_blank" rel="noopener noreferrer nofollow">@${escapeHtml(displayTweet.in_reply_to_screen_name)}</a></div>`
    : "";
  const actions = renderActions(displayTweet);
  const avatarUrl = toSafeHttpUrl(displayTweet.user.profile_image_url_https);

  const mediaTypeClass =
    mediaType === MEDIA_TYPE_IMAGE_OR_VIDEO
      ? "remark-x-embed--has-media"
      : mediaType === MEDIA_TYPE_TWEET_HAVE_IMAGE_OR_VIDEO
        ? "remark-x-embed--has-quoted-media"
        : "remark-x-embed--no-media";

  return `
<div class="remark-x-embed not-prose ${mediaTypeClass}" data-media-type="${mediaType}">
  <article class="remark-x-embed__card" ${getCardClickAttributes(tweetUrl)}>
    <header class="remark-x-embed__header">
      <a href="${escapeAttribute(tweetUrl)}" class="remark-x-embed__avatar-link${avatarUrl ? "" : " remark-x-embed__avatar-link--placeholder"}" target="_blank" rel="noopener noreferrer">
        ${avatarUrl ? `<img src="${escapeAttribute(avatarUrl)}" alt="${escapeAttribute(displayTweet.user.name)}" class="remark-x-embed__avatar${displayTweet.user.profile_image_shape === "Square" ? " remark-x-embed__avatar--square" : ""}" loading="lazy" />` : ""}
      </a>
      <div class="remark-x-embed__author">
        <a href="${escapeAttribute(tweetUrl)}" class="remark-x-embed__author-name" target="_blank" rel="noopener noreferrer">
          <span>${escapeHtml(displayTweet.user.name)}</span>
          ${renderVerifiedBadge(displayTweet.user)}
        </a>
        <a href="https://x.com/${escapeAttribute(displayTweet.user.screen_name)}" class="remark-x-embed__author-handle" target="_blank" rel="noopener noreferrer nofollow">@${escapeHtml(displayTweet.user.screen_name)}</a>
      </div>
      <a href="${escapeAttribute(tweetUrl)}" class="remark-x-embed__brand" target="_blank" rel="noopener noreferrer" aria-label="View on X">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <g>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </g>
        </svg>
      </a>
    </header>
    ${inReplyTo}
    <p class="remark-x-embed__body" lang="${escapeAttribute(displayTweet.lang)}" dir="auto">${renderBodyEntities(bodyEntities)}</p>
    ${media}
    ${quoted}
    <div class="remark-x-embed__meta">
      <a href="${escapeAttribute(tweetUrl)}" class="remark-x-embed__time-link" target="_blank" rel="noopener noreferrer"><time datetime="${escapeAttribute(createdAtDate.toISOString())}">${escapeHtml(createdAtText)}</time></a>
    </div>
    ${actions}
  </article>
</div>`.trim();
}

function getDisplayTweet(tweet: TweetResult): DisplayTweet {
  if (!tweet.retweeted_tweet) {
    return {
      ...tweet,
      conversation_count: tweet.conversation_count,
      favorite_count: tweet.favorite_count,
      in_reply_to_screen_name: tweet.in_reply_to_screen_name,
      quoted_tweet: tweet.quoted_tweet,
      retweet_count: tweet.retweet_count,
    };
  }

  const retweeted = tweet.retweeted_tweet;
  return {
    ...retweeted,
    conversation_count:
      retweeted.conversation_count ?? tweet.conversation_count,
    favorite_count: retweeted.favorite_count ?? tweet.favorite_count,
    in_reply_to_screen_name:
      retweeted.in_reply_to_screen_name ?? tweet.in_reply_to_screen_name,
    quoted_tweet: retweeted.quoted_tweet ?? tweet.quoted_tweet,
    retweet_count: retweeted.retweet_count ?? tweet.retweet_count,
  };
}

async function resolveDisplayTweet(
  tweet: TweetResult,
  lang: string,
  oEmbedHtml: string,
): Promise<DisplayTweet> {
  if (tweet.retweeted_tweet) {
    return getDisplayTweet(tweet);
  }

  const displayTweet = getDisplayTweet(tweet);
  if (!looksLikeRetweet(displayTweet.text)) {
    return displayTweet;
  }

  const target = await findRetweetTarget(displayTweet, oEmbedHtml);
  if (!target) {
    return displayTweet;
  }

  const sourceTweet = await fetchTweetResult(target.id, lang);
  if (!sourceTweet) {
    return displayTweet;
  }

  return getDisplayTweet(sourceTweet);
}

function looksLikeRetweet(text: string): boolean {
  return /^RT\s+@/u.test(text.trimStart());
}

async function findRetweetTarget(
  tweet: Pick<TweetBase, "entities" | "text" | "id_str">,
  oEmbedHtml: string,
): Promise<TweetTarget | null> {
  const candidates = new Set<string>();

  for (const entity of tweet.entities.urls) {
    candidates.add(entity.expanded_url);
    candidates.add(entity.url);
  }

  for (const entity of tweet.entities.media ?? []) {
    candidates.add(entity.expanded_url);
    candidates.add(entity.url);
  }

  for (const textUrl of getLinksFromText(tweet.text)) {
    candidates.add(textUrl);
  }

  if (oEmbedHtml) {
    for (const htmlUrl of getMediaLinks(oEmbedHtml)) {
      candidates.add(htmlUrl);
    }
  }

  for (const candidate of candidates) {
    const parsed = parseTweetUrl(candidate);
    if (parsed && parsed.id !== tweet.id_str) {
      return parsed;
    }

    if (!URL.canParse(candidate)) {
      continue;
    }

    const url = new URL(candidate);
    if (!TCO_HOSTS.has(url.hostname.toLowerCase())) {
      continue;
    }

    const resolved = await resolveRedirectLocation(candidate);
    if (!resolved) {
      continue;
    }

    const parsedResolved = parseTweetUrl(resolved);
    if (parsedResolved && parsedResolved.id !== tweet.id_str) {
      return parsedResolved;
    }
  }

  return null;
}

function getLinksFromText(text: string): string[] {
  const links = new Set<string>();
  const regex = /https?:\/\/[^\s<>"]+/g;

  for (const match of text.matchAll(regex)) {
    const normalized = normalizeUrlCandidate(match[0]);
    if (normalized) {
      links.add(normalized);
    }
  }

  return [...links];
}

function getRenderableMediaList(tweet: {
  id_str: string;
  mediaDetails?: MediaDetails[];
  photos?: TweetPhoto[];
  video?: TweetVideo;
}): MediaDetails[] {
  if ((tweet.mediaDetails?.length ?? 0) > 0) {
    return tweet.mediaDetails ?? [];
  }

  const fromPhotos = (tweet.photos ?? []).map((photo, index) =>
    photoToMediaDetails(photo, index),
  );
  const fromVideo = tweet.video ? [videoToMediaDetails(tweet.video)] : [];
  return [...fromPhotos, ...fromVideo].slice(0, 4);
}

function photoToMediaDetails(photo: TweetPhoto, index: number): MediaDetails {
  return {
    display_url: photo.url,
    expanded_url: photo.expandedUrl ?? photo.url,
    indices: [index, index + 1],
    media_url_https: photo.url,
    original_info: {
      height: photo.height,
      width: photo.width,
    },
    type: "photo",
    url: photo.url,
  };
}

function videoToMediaDetails(video: TweetVideo): MediaDetails {
  const mediaType = video.contentType === "gif" ? "animated_gif" : "video";
  return {
    display_url: video.poster,
    expanded_url: video.poster,
    indices: [0, 1],
    media_url_https: video.poster,
    original_info: {
      height: 720,
      width: 1280,
    },
    type: mediaType,
    url: video.poster,
    video_info: {
      variants: video.variants.map((variant) => ({
        bitrate: variant.bitrate,
        content_type: variant.type,
        url: variant.src,
      })),
    },
  };
}

function getCardClickAttributes(tweetUrl: string): string {
  const safeTweetUrl = toSafeHttpUrl(tweetUrl) ?? "https://x.com";
  const escapedUrl = escapeJsSingleQuotedString(safeTweetUrl);
  return `role="link" tabindex="0" onclick="if (!event.target.closest('a,button,video')) { window.open('${escapedUrl}', '_blank', 'noopener,noreferrer'); }" onkeydown="if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('a,button,video')) { event.preventDefault(); window.open('${escapedUrl}', '_blank', 'noopener,noreferrer'); }"`;
}

function renderFallbackEmbed(
  target: TweetTarget,
  tweetUrl: string,
  oEmbed: OEmbedResponse | null,
  mediaType: MediaType,
): string {
  const text = oEmbed ? extractTextFromOEmbedHtml(oEmbed.html) : "";
  const authorName = oEmbed?.author_name ?? target.screenName;
  const screenName = oEmbed?.author_url
    ? extractScreenNameFromAuthorUrl(oEmbed.author_url)
    : target.screenName;
  const fallbackDate = oEmbed ? extractDateFromOEmbedHtml(oEmbed.html) : null;
  const dateText = fallbackDate ? formatDate(fallbackDate) : "Open post";

  return `
<div class="remark-x-embed not-prose remark-x-embed--fallback" data-media-type="${mediaType}">
  <article class="remark-x-embed__card" ${getCardClickAttributes(tweetUrl)}>
    <header class="remark-x-embed__header">
      <div class="remark-x-embed__avatar-link remark-x-embed__avatar-link--placeholder" aria-hidden="true"></div>
      <div class="remark-x-embed__author">
        <a href="${escapeAttribute(tweetUrl)}" class="remark-x-embed__author-name" target="_blank" rel="noopener noreferrer">
          <span>${escapeHtml(authorName)}</span>
        </a>
        <a href="https://x.com/${escapeAttribute(screenName)}" class="remark-x-embed__author-handle" target="_blank" rel="noopener noreferrer nofollow">@${escapeHtml(screenName)}</a>
      </div>
      <a href="${escapeAttribute(tweetUrl)}" class="remark-x-embed__brand" target="_blank" rel="noopener noreferrer" aria-label="View on X">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <g>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </g>
        </svg>
      </a>
    </header>
    <p class="remark-x-embed__body" dir="auto">${escapeHtml(text || "This post is unavailable.")}</p>
    <div class="remark-x-embed__meta">
      <a href="${escapeAttribute(tweetUrl)}" class="remark-x-embed__time-link" target="_blank" rel="noopener noreferrer">${escapeHtml(dateText)}</a>
    </div>
  </article>
</div>`.trim();
}

function renderQuotedTweet(tweet: QuotedTweet): string {
  const tweetUrl = buildTweetPermalink(tweet);
  const bodyEntities = buildRenderEntities(tweet);
  const media = renderMedia(getRenderableMediaList(tweet), tweetUrl, true);
  const avatarUrl = toSafeHttpUrl(tweet.user.profile_image_url_https);

  return `
<a href="${escapeAttribute(tweetUrl)}" class="remark-x-embed__quote" target="_blank" rel="noopener noreferrer">
  <div class="remark-x-embed__quote-header">
    ${avatarUrl ? `<img src="${escapeAttribute(avatarUrl)}" alt="${escapeAttribute(tweet.user.name)}" class="remark-x-embed__quote-avatar${tweet.user.profile_image_shape === "Square" ? " remark-x-embed__quote-avatar--square" : ""}" loading="lazy" />` : `<span class="remark-x-embed__quote-avatar remark-x-embed__avatar-link--placeholder${tweet.user.profile_image_shape === "Square" ? " remark-x-embed__quote-avatar--square" : ""}" aria-hidden="true"></span>`}
    <div class="remark-x-embed__quote-author">
      <span class="remark-x-embed__quote-name">${escapeHtml(tweet.user.name)}</span>
      <span class="remark-x-embed__quote-handle">@${escapeHtml(tweet.user.screen_name)}</span>
    </div>
  </div>
  <p class="remark-x-embed__quote-body" lang="${escapeAttribute(tweet.lang)}" dir="auto">${renderBodyEntities(bodyEntities)}</p>
  ${media}
</a>`.trim();
}

function renderActions(tweet: DisplayTweet): string {
  const likeCount = formatNumber(tweet.favorite_count);
  const replyCount = formatNumber(tweet.conversation_count);
  const retweetCount =
    typeof tweet.retweet_count === "number"
      ? formatNumber(tweet.retweet_count)
      : null;
  const replyUrl = toReplyUrl(tweet.id_str);
  const likeUrl = toLikeUrl(tweet.id_str);
  const retweetUrl = toRetweetUrl(tweet.id_str);

  const retweetAction = retweetCount
    ? `<a href="${escapeAttribute(retweetUrl)}" class="remark-x-embed__action remark-x-embed__action--retweet" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.75 3.79 9.353 8.09l-1.366 1.46L5.88 7.583V16h9.5v-3h2v5H3.88V7.583L1.773 9.55.407 8.09l4.603-4.3zm14.37 10.626 2.107 1.96 1.367-1.459-4.603-4.297h.259V20.21l-4.603-4.3 1.366-1.46 2.107 1.967V8h-9.5v3h-2V6h13.5z"></path></svg><span>${escapeHtml(retweetCount)}</span></a>`
    : "";

  return `
<div class="remark-x-embed__actions">
  <a href="${escapeAttribute(replyUrl)}" class="remark-x-embed__action remark-x-embed__action--reply" target="_blank" rel="noopener noreferrer">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z"></path></svg>
    <span>${escapeHtml(replyCount)}</span>
  </a>
  ${retweetAction}
  <a href="${escapeAttribute(likeUrl)}" class="remark-x-embed__action remark-x-embed__action--like" target="_blank" rel="noopener noreferrer">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></svg>
    <span>${escapeHtml(likeCount)}</span>
  </a>
</div>`.trim();
}

function renderMedia(
  mediaList: MediaDetails[],
  tweetUrl: string,
  isQuoted = false,
): string {
  if (!mediaList.length) {
    return "";
  }

  const visibleMedia = mediaList.slice(0, 4);
  const count = visibleMedia.length;
  const gridClass = `remark-x-embed__media-grid remark-x-embed__media-grid--${count}`;
  const safeTweetUrl = toSafeHttpUrl(tweetUrl) ?? "https://x.com";

  const items = visibleMedia
    .map((media) => {
      if (media.type === "photo") {
        const src = getMediaUrl(media, "medium");
        if (!src) {
          return null;
        }
        const alt = media.ext_alt_text?.trim() || "Image";
        return `<a href="${escapeAttribute(safeTweetUrl)}" class="remark-x-embed__media-item" target="_blank" rel="noopener noreferrer"><img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}" loading="lazy" /></a>`;
      }

      const poster = getMediaUrl(media, "medium");
      const video = getBestMp4Video(media);
      const isAnimatedGif = media.type === "animated_gif";
      if (!video) {
        if (!poster) {
          return null;
        }

        const alt = media.ext_alt_text?.trim() || "Video";
        return `<a href="${escapeAttribute(safeTweetUrl)}" class="remark-x-embed__media-item" target="_blank" rel="noopener noreferrer"><img src="${escapeAttribute(poster)}" alt="${escapeAttribute(alt)}" loading="lazy" /></a>`;
      }

      const posterAttr = poster ? ` poster="${escapeAttribute(poster)}"` : "";
      if (isAnimatedGif) {
        return `<a href="${escapeAttribute(safeTweetUrl)}" class="remark-x-embed__media-item remark-x-embed__media-item--animated-gif" target="_blank" rel="noopener noreferrer"><video autoplay loop muted playsinline preload="metadata"${posterAttr}><source src="${escapeAttribute(video)}" type="video/mp4" />Your browser does not support the video tag.</video></a>`;
      }

      return `<div class="remark-x-embed__media-item remark-x-embed__media-item--video"><video controls playsinline preload="metadata"${posterAttr}><source src="${escapeAttribute(video)}" type="video/mp4" />Your browser does not support the video tag.</video></div>`;
    })
    .filter((item): item is string => item !== null)
    .join("");

  if (!items) {
    return "";
  }

  return `<div class="remark-x-embed__media ${isQuoted ? "remark-x-embed__media--quoted" : ""}"><div class="${gridClass}">${items}</div></div>`;
}

function buildRenderEntities(tweet: TweetBase): RenderEntity[] {
  const textMap = Array.from(tweet.text);
  const mediaStart = tweet.entities.media?.[0]?.indices?.[0];

  const start = tweet.display_text_range?.[0] ?? 0;
  let end = tweet.display_text_range?.[1] ?? textMap.length;
  if (typeof mediaStart === "number" && mediaStart < end) {
    end = mediaStart;
  }

  type WorkingEntity =
    | {
        indices: Indices;
        type: "text";
      }
    | ({ type: "hashtag" } & HashtagEntity)
    | ({ type: "mention" } & UserMentionEntity)
    | ({ type: "url" } & UrlEntity)
    | ({ type: "media" } & MediaEntity)
    | ({ type: "symbol" } & SymbolEntity);

  const result: WorkingEntity[] = [
    {
      indices: [start, end],
      type: "text",
    },
  ];

  addEntities(result, "hashtag", tweet.entities.hashtags);
  addEntities(result, "mention", tweet.entities.user_mentions);
  addEntities(result, "url", tweet.entities.urls);
  addEntities(result, "symbol", tweet.entities.symbols);
  if (tweet.entities.media) {
    addEntities(result, "media", tweet.entities.media);
  }

  const rendered: RenderEntity[] = [];

  for (const entity of result) {
    const text = textMap.slice(entity.indices[0], entity.indices[1]).join("");

    if (entity.type === "text") {
      rendered.push({
        text,
        type: "text",
      });
      continue;
    }

    if (entity.type === "hashtag") {
      rendered.push({
        href: `https://x.com/hashtag/${entity.text}`,
        text,
        type: "hashtag",
      });
      continue;
    }

    if (entity.type === "mention") {
      rendered.push({
        href: `https://x.com/${entity.screen_name}`,
        text,
        type: "mention",
      });
      continue;
    }

    if (entity.type === "url") {
      rendered.push({
        href: entity.expanded_url,
        text: entity.display_url,
        type: "url",
      });
      continue;
    }

    if (entity.type === "symbol") {
      rendered.push({
        href: `https://x.com/search?q=%24${entity.text}`,
        text,
        type: "symbol",
      });
    }
  }

  return rendered;
}

function addEntities(
  result: Array<{ indices: Indices; type: string }>,
  type: "hashtag" | "mention" | "url" | "media" | "symbol",
  entities: Array<{ indices: Indices }> | undefined,
): void {
  if (!entities?.length) {
    return;
  }

  for (const entity of entities) {
    for (let i = 0; i < result.length; i += 1) {
      const current = result[i];
      if (
        current.indices[0] > entity.indices[0] ||
        current.indices[1] < entity.indices[1]
      ) {
        continue;
      }

      const next: Array<{ indices: Indices; type: string }> = [
        { ...entity, type },
      ];

      if (current.indices[0] < entity.indices[0]) {
        next.unshift({
          indices: [current.indices[0], entity.indices[0]],
          type: "text",
        });
      }

      if (current.indices[1] > entity.indices[1]) {
        next.push({
          indices: [entity.indices[1], current.indices[1]],
          type: "text",
        });
      }

      result.splice(i, 1, ...next);
      break;
    }
  }
}

function renderBodyEntities(entities: RenderEntity[]): string {
  return entities
    .map((entity) => {
      if (entity.type === "text") {
        return escapeHtml(entity.text);
      }

      const href = toSafeHttpUrl(entity.href);
      if (!href) {
        return escapeHtml(entity.text);
      }

      return `<a href="${escapeAttribute(href)}" target="_blank" rel="noopener noreferrer nofollow">${escapeHtml(entity.text)}</a>`;
    })
    .join("");
}

function renderVerifiedBadge(user: TweetUser): string {
  const isVerified = Boolean(
    user.verified || user.is_blue_verified || user.verified_type,
  );
  if (!isVerified) {
    return "";
  }

  const className =
    user.verified_type === "Business"
      ? "remark-x-embed__verified remark-x-embed__verified--business"
      : user.verified_type === "Government"
        ? "remark-x-embed__verified remark-x-embed__verified--government"
        : "remark-x-embed__verified";

  return `<span class="${className}" aria-label="Verified account"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path></svg></span>`;
}

function getMediaUrl(
  media: MediaDetails,
  size: "small" | "medium" | "large",
): string | null {
  const safeMediaUrl = toSafeHttpUrl(media.media_url_https);
  if (!safeMediaUrl) {
    return null;
  }

  const parsed = new URL(safeMediaUrl);
  const extension = parsed.pathname.split(".").pop();

  if (!extension) {
    return safeMediaUrl;
  }

  parsed.pathname = parsed.pathname.replace(`.${extension}`, "");
  parsed.searchParams.set("format", extension);
  parsed.searchParams.set("name", size);
  return parsed.toString();
}

function getBestMp4Video(media: MediaDetails): string | null {
  const variants = media.video_info?.variants ?? [];
  const mp4 = variants
    .filter((item) => item.content_type === "video/mp4")
    .map((item) => ({
      bitrate: item.bitrate,
      url: toSafeHttpUrl(item.url),
    }))
    .filter((item) => item.url !== null)
    .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));

  return mp4[0]?.url ?? null;
}

function formatDate(date: Date): string {
  const parts = formatter.formatToParts(date);
  const map = new Map(parts.map((part) => [part.type, part.value]));
  const year = map.get("year") ?? "0000";
  const month = map.get("month") ?? "00";
  const day = map.get("day") ?? "00";
  const hour = map.get("hour") ?? "00";
  const minute = map.get("minute") ?? "00";
  const second = map.get("second") ?? "00";
  return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}

function formatNumber(value: number): string {
  if (value > 999_999) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value > 999) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

function extractTextFromOEmbedHtml(html: string): string {
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!match?.[1]) {
    return "";
  }

  const text = match[1]
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/a>/gi, "")
    .replace(/<a[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();

  return decodeHtmlEntities(text);
}

function extractDateFromOEmbedHtml(html: string): Date | null {
  const anchors = [...html.matchAll(/<a [^>]*>([^<]+)<\/a>/gi)];
  if (!anchors.length) {
    return null;
  }

  const dateText = decodeHtmlEntities(anchors.at(-1)?.[1] ?? "").trim();
  const parsed = new Date(dateText);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function extractScreenNameFromAuthorUrl(raw: string): string {
  if (!URL.canParse(raw)) {
    return raw;
  }

  const url = new URL(raw);
  const segment = url.pathname.split("/").filter(Boolean)[0];
  return segment || raw;
}

function getSyndicationToken(id: string): string {
  if (!/^\d+$/.test(id)) {
    return "";
  }

  const divisor = 1_000_000_000_000_000n;
  const parsedId = BigInt(id);
  const integerPart = parsedId / divisor;
  const fractionalPart = parsedId % divisor;
  const asNumber = Number(integerPart) + Number(fractionalPart) / 1e15;

  return (asNumber * Math.PI).toString(36).replace(/(0+|\.)/g, "");
}

function toSafeHttpUrl(value: string): string | null {
  if (!URL.canParse(value)) {
    return null;
  }

  const parsed = new URL(value);
  if (!SAFE_PROTOCOLS.has(parsed.protocol)) {
    return null;
  }

  return parsed.toString();
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([\da-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) =>
      String.fromCodePoint(Number.parseInt(dec, 10)),
    );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

function escapeJsSingleQuotedString(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("'", "\\'");
}

function isSameUrlValue(a: string, b: string): boolean {
  try {
    return new URL(a).toString() === new URL(b).toString();
  } catch {
    return false;
  }
}

function readCache<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string,
): T | undefined {
  const cached = cache.get(key);
  if (!cached) {
    return undefined;
  }

  if (cached.expiresAt <= Date.now()) {
    cache.delete(key);
    return undefined;
  }

  return cached.data;
}

function writeCache<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string,
  data: T,
  ttl = ONE_HOUR_MS,
): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
  });
}

export default remarkTwitter;
