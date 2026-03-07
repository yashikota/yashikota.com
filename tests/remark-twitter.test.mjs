import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import remarkParse from "remark-parse";
import { unified } from "unified";
import remarkTwitter from "../src/lib/remark-twitter.ts";

const originalFetch = globalThis.fetch;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
    status,
  });
}

function createUser(screenName, name = screenName) {
  return {
    is_blue_verified: false,
    name,
    profile_image_shape: "Circle",
    profile_image_url_https: `https://pbs.twimg.com/profile_images/${screenName}_normal.jpg`,
    screen_name: screenName,
    verified: false,
  };
}

function createPhotoMedia(url, expandedUrl = url) {
  return {
    display_url: url,
    expanded_url: expandedUrl,
    ext_alt_text: "sample image",
    indices: [0, 1],
    media_url_https: url,
    original_info: {
      height: 720,
      width: 1280,
    },
    type: "photo",
    url,
  };
}

function createTweetBase({
  id,
  createdAt = "2025-01-02T03:04:05.000Z",
  lang = "ja",
  mediaDetails,
  photos,
  screenName,
  text,
  userName,
  video,
}) {
  const normalizedText = text ?? "Hello from tweet";
  return {
    created_at: createdAt,
    display_text_range: [0, Array.from(normalizedText).length],
    edit_control: {},
    entities: {
      hashtags: [],
      symbols: [],
      urls: [],
      user_mentions: [],
    },
    id_str: id,
    isEdited: false,
    isStaleEdit: false,
    lang,
    mediaDetails,
    photos,
    text: normalizedText,
    user: createUser(screenName, userName),
    video,
  };
}

function createTweet({
  id,
  screenName = "tester",
  userName = "Tester",
  text,
  createdAt,
  mediaDetails,
  photos,
  video,
  quotedTweet,
  retweetedTweet,
  favoriteCount = 5,
  conversationCount = 2,
}) {
  return {
    __typename: "Tweet",
    ...createTweetBase({
      createdAt,
      id,
      lang: "ja",
      mediaDetails,
      photos,
      screenName,
      text,
      userName,
      video,
    }),
    conversation_count: conversationCount,
    favorite_count: favoriteCount,
    quoted_tweet: quotedTweet,
    retweeted_tweet: retweetedTweet,
  };
}

function createQuotedTweet({
  id,
  screenName = "quoted_user",
  userName = "Quoted User",
  text = "quoted tweet",
  mediaDetails,
  photos,
  video,
}) {
  return {
    ...createTweetBase({
      id,
      mediaDetails,
      photos,
      screenName,
      text,
      userName,
      video,
    }),
    favorite_count: 1,
  };
}

function installFetchMock(tweetsById) {
  globalThis.fetch = async (input) => {
    const rawUrl =
      input instanceof URL
        ? input.href
        : typeof input === "string"
          ? input
          : input.url;
    const url = new URL(rawUrl);

    if (
      url.hostname === "cdn.syndication.twimg.com" &&
      url.pathname === "/tweet-result"
    ) {
      const tweetId = url.searchParams.get("id") ?? "";
      const payload = tweetsById.get(tweetId) ?? {};
      return jsonResponse(payload);
    }

    if (url.hostname === "publish.twitter.com" && url.pathname === "/oembed") {
      const tweetUrl = url.searchParams.get("url") ?? "https://x.com";
      return jsonResponse({
        author_name: "Tester",
        author_url: "https://x.com/tester",
        cache_age: "3600",
        html: `<blockquote class="twitter-tweet"><p>oEmbed body</p>&mdash; Tester <a href="${tweetUrl}">2025-01-02</a></blockquote>`,
        url: tweetUrl,
      });
    }

    if (url.hostname === "t.co") {
      return new Response("", {
        headers: {
          location: "https://x.com/quoted/status/999",
        },
        status: 301,
      });
    }

    throw new Error(`Unexpected fetch URL: ${url.toString()}`);
  };
}

async function renderEmbedHtml(markdown) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkTwitter, { lang: "ja" });
  const parsed = processor.parse(markdown);
  const tree = await processor.run(parsed);
  return tree.children
    .filter((node) => node.type === "html")
    .map((node) => node.value);
}

describe("remark-twitter", () => {
  beforeEach(() => {
    globalThis.fetch = originalFetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("supports twitter.com and x.com links and keeps card interactions", async () => {
    const tweets = new Map([
      [
        "100",
        createTweet({
          createdAt: "2025-01-02T03:04:05.000Z",
          id: "100",
          screenName: "alice",
          text: "x.com embed",
          userName: "Alice",
        }),
      ],
      [
        "101",
        createTweet({
          createdAt: "2025-01-02T03:04:05.000Z",
          id: "101",
          screenName: "bob",
          text: "twitter.com embed",
          userName: "Bob",
        }),
      ],
    ]);

    installFetchMock(tweets);
    const embeds = await renderEmbedHtml(
      "https://x.com/alice/status/100\n\nhttps://twitter.com/bob/status/101",
    );

    expect(embeds).toHaveLength(2);
    expect(embeds[0]).toContain('role="link" tabindex="0"');
    expect(embeds[0]).toContain("remark-x-embed__action--reply");
    expect(embeds[0]).toContain("remark-x-embed__action--like");
    expect(embeds[0]).toContain("2025/01/02 12:04:05");
    expect(embeds[1]).toContain("https://x.com/bob/status/101");
  });

  it("renders video media correctly for animated GIF tweets", async () => {
    const tweets = new Map([
      [
        "1637027079517765633",
        createTweet({
          id: "1637027079517765633",
          mediaDetails: [
            {
              display_url: "pic.x.com/8dnvgsFMuA",
              expanded_url:
                "https://x.com/yashikota/status/1637027079517765633/photo/1",
              ext_alt_text: "4bit CPU Emulator",
              indices: [0, 1],
              media_url_https:
                "https://pbs.twimg.com/tweet_video_thumb/FrfjO-WagAAt0hp.jpg",
              original_info: {
                height: 682,
                width: 866,
              },
              type: "animated_gif",
              url: "https://t.co/8dnvgsFMuA",
              video_info: {
                variants: [
                  {
                    bitrate: 0,
                    content_type: "video/mp4",
                    url: "https://video.twimg.com/tweet_video/FrfjO-WagAAt0hp.mp4",
                  },
                ],
              },
            },
          ],
          screenName: "yashikota",
          text: "4bit CPU Emulator",
          userName: "こた",
        }),
      ],
    ]);

    installFetchMock(tweets);
    const [embed] = await renderEmbedHtml(
      "https://x.com/yashikota/status/1637027079517765633",
    );

    expect(embed).toContain('data-media-type="1"');
    expect(embed).toContain("<video controls");
    expect(embed).toContain(
      "https://video.twimg.com/tweet_video/FrfjO-WagAAt0hp.mp4",
    );
  });

  it("falls back to photos/video fields when mediaDetails is missing", async () => {
    const tweets = new Map([
      [
        "500",
        createTweet({
          id: "500",
          photos: [
            {
              expandedUrl: "https://x.com/photo_user/status/500/photo/1",
              height: 720,
              url: "https://pbs.twimg.com/media/from-photos.jpg",
              width: 1280,
            },
          ],
          screenName: "photo_user",
          text: "photo fallback",
          userName: "Photo User",
        }),
      ],
    ]);

    installFetchMock(tweets);
    const [embed] = await renderEmbedHtml(
      "https://x.com/photo_user/status/500",
    );

    expect(embed).toContain('data-media-type="1"');
    expect(embed).toContain("https://pbs.twimg.com/media/from-photos");
  });

  it("renders quoted tweet media and sets quoted media type", async () => {
    const tweets = new Map([
      [
        "300",
        createTweet({
          id: "300",
          quotedTweet: createQuotedTweet({
            id: "301",
            mediaDetails: [
              createPhotoMedia(
                "https://pbs.twimg.com/media/quoted.jpg",
                "https://x.com/quoted/status/301/photo/1",
              ),
            ],
            screenName: "quoted",
            text: "quoted content",
            userName: "Quoted",
          }),
          screenName: "owner",
          text: "tweet with quote",
          userName: "Owner",
        }),
      ],
    ]);

    installFetchMock(tweets);
    const [embed] = await renderEmbedHtml("https://x.com/owner/status/300");

    expect(embed).toContain('data-media-type="2"');
    expect(embed).toContain("remark-x-embed__quote");
    expect(embed).toContain("https://pbs.twimg.com/media/quoted");
  });

  it("renders quote-retweet payloads from retweeted_tweet", async () => {
    const retweeted = {
      ...createTweetBase({
        id: "401",
        screenName: "original",
        text: "retweet body",
        userName: "Original",
      }),
      conversation_count: 7,
      favorite_count: 9,
      quoted_tweet: createQuotedTweet({
        id: "402",
        mediaDetails: [
          createPhotoMedia(
            "https://pbs.twimg.com/media/quote-retweet.jpg",
            "https://x.com/quoted/status/402/photo/1",
          ),
        ],
        screenName: "quoted",
        text: "quoted in retweet",
        userName: "Quoted",
      }),
    };

    const tweets = new Map([
      [
        "400",
        createTweet({
          id: "400",
          retweetedTweet: retweeted,
          screenName: "retweeter",
          text: "RT @original",
          userName: "Retweeter",
        }),
      ],
    ]);

    installFetchMock(tweets);
    const [embed] = await renderEmbedHtml("https://x.com/retweeter/status/400");

    expect(embed).toContain("https://x.com/original/status/401");
    expect(embed).toContain("retweet body");
    expect(embed).toContain("https://x.com/quoted/status/402");
    expect(embed).toContain('data-media-type="2"');
  });
});
