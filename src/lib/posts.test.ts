import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { getFaviconUrl } from "./utils";

type BlogCollectionEntry = {
  id: string;
  body: string;
  data: {
    title: string;
    pubDate: Date;
    updDate: Date | null;
    isUnlisted: boolean;
    category: "tech" | "life";
    tags: string[];
    showToc: boolean;
  };
};

let blogCollectionEntries: BlogCollectionEntry[] = [];

const externalPostsFixture = [
  {
    title: "External entry",
    pubDate: "2025-04-01",
    updDate: null,
    tags: ["External"],
    url: "https://external.example.com/posts/1",
  },
];

mock.module("astro:content", () => ({
  getCollection: async (name: string) => {
    if (name !== "blog") {
      return [];
    }

    return blogCollectionEntries;
  },
}));

mock.module("@/data/posts.json", () => ({
  default: externalPostsFixture,
}));

let capturedRssInput: Record<string, unknown> | null = null;

mock.module("@astrojs/rss", () => ({
  default: (input: Record<string, unknown>) => {
    capturedRssInput = input;
    return input;
  },
}));

const originalFetch = globalThis.fetch;

type PostsModule = typeof import("./posts");
type TechRssModule = typeof import("../pages/rss/tech.xml");
type LifeRssModule = typeof import("../pages/rss/life.xml");

async function importPostsModule(): Promise<PostsModule> {
  const cacheBuster = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const moduleUrl = new URL(`./posts.ts?test=${cacheBuster}`, import.meta.url);
  return (await import(moduleUrl.href)) as PostsModule;
}

async function importTechRssModule(): Promise<TechRssModule> {
  const cacheBuster = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const moduleUrl = new URL(
    `../pages/rss/tech.xml?test=${cacheBuster}`,
    import.meta.url,
  );
  return (await import(moduleUrl.href)) as TechRssModule;
}

async function importLifeRssModule(): Promise<LifeRssModule> {
  const cacheBuster = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const moduleUrl = new URL(
    `../pages/rss/life.xml?test=${cacheBuster}`,
    import.meta.url,
  );
  return (await import(moduleUrl.href)) as LifeRssModule;
}

function toUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}

function jsonResponse(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}

function textResponse(data: string): Response {
  return new Response(data, {
    headers: {
      "Content-Type": "text/html",
    },
    status: 200,
  });
}

beforeEach(() => {
  capturedRssInput = null;
  blogCollectionEntries = [
    {
      id: "blog-alpha",
      body: "alpha body",
      data: {
        title: "Alpha",
        pubDate: new Date("2025-01-02T00:00:00.000Z"),
        updDate: new Date("2025-01-05T00:00:00.000Z"),
        isUnlisted: false,
        category: "tech",
        tags: ["Astro"],
        showToc: true,
      },
    },
    {
      id: "blog-beta",
      body: "beta body",
      data: {
        title: "Beta",
        pubDate: new Date("2024-12-31T00:00:00.000Z"),
        updDate: null,
        isUnlisted: true,
        category: "life",
        tags: [],
        showToc: false,
      },
    },
  ];
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("posts", () => {
  test("getBlogPosts maps Astro collection entries", async () => {
    const postsModule = await importPostsModule();
    const posts = await postsModule.getBlogPosts();

    expect(posts).toHaveLength(2);
    expect(posts[0]).toEqual({
      title: "Alpha",
      pubDate: "2025-01-02",
      updDate: "2025-01-05",
      isUnlisted: false,
      category: "tech",
      tags: ["Astro"],
      slug: "blog-alpha",
      body: "alpha body",
      url: "/blog/blog-alpha",
      icon: getFaviconUrl("yashikota.com"),
      showToc: true,
    });
    expect(posts[1].updDate).toBeNull();
  });

  test("getExternalPosts maps static JSON entries", async () => {
    const postsModule = await importPostsModule();
    const posts = await postsModule.getExternalPosts();

    expect(posts).toEqual([
      {
        title: "External entry",
        pubDate: "2025-04-01",
        updDate: null,
        tags: ["External"],
        url: "https://external.example.com/posts/1",
        slug: "",
        icon: getFaviconUrl("https://external.example.com"),
      },
    ]);
  });

  test("getZennPosts fetches articles and extracts topic tags", async () => {
    const postsModule = await importPostsModule();
    const fetchCalls: string[] = [];

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = toUrl(input);
      fetchCalls.push(url);

      if (url.startsWith("https://zenn.dev/api/articles")) {
        return jsonResponse({
          articles: [
            {
              title: "Zenn article",
              published_at: "2025-03-02T10:00:00.000Z",
              body_updated_at: "2025-03-02T11:00:00.000Z",
              path: "/articles/bun-test",
            },
          ],
        });
      }

      if (url === "https://zenn.dev/articles/bun-test") {
        return textResponse(
          '<div class="TopicList_name__abc">TypeScript</div><div class="TopicList_name__xyz">Astro</div>',
        );
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    }) as typeof fetch;

    const posts = await postsModule.getZennPosts();

    expect(fetchCalls[0]).toContain("https://zenn.dev/api/articles");
    expect(fetchCalls[1]).toBe("https://zenn.dev/articles/bun-test");
    expect(posts).toEqual([
      {
        title: "Zenn article",
        pubDate: "2025-03-02",
        updDate: null,
        category: "tech",
        tags: ["TypeScript", "Astro"],
        slug: "",
        url: "https://zenn.dev/articles/bun-test",
        icon: getFaviconUrl("https://zenn.dev"),
      },
    ]);
  });

  test("getAllPosts merges sources and sorts by newest pubDate", async () => {
    const postsModule = await importPostsModule();
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = toUrl(input);

      if (url.startsWith("https://zenn.dev/api/articles")) {
        return jsonResponse({
          articles: [
            {
              title: "Zenn article",
              published_at: "2025-03-02T10:00:00.000Z",
              body_updated_at: "2025-03-03T10:00:00.000Z",
              path: "/articles/bun-test",
            },
          ],
        });
      }

      if (url === "https://zenn.dev/articles/bun-test") {
        return textResponse(
          '<div class="TopicList_name__abc">TypeScript</div>',
        );
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    }) as typeof fetch;

    const posts = await postsModule.getAllPosts();

    expect(posts.map((post) => post.title)).toEqual([
      "External entry",
      "Zenn article",
      "Alpha",
      "Beta",
    ]);
    expect(posts[0].pubDate).toBe("2025-04-01");
    expect(posts[1].updDate).toBe("2025-03-03");
    expect("body" in posts[0]).toBe(false);
  });

  test("tech RSS includes only listed tech posts", async () => {
    const techRssModule = await importTechRssModule();

    blogCollectionEntries = [
      {
        id: "tech-visible",
        body: "",
        data: {
          title: "Tech visible",
          pubDate: new Date("2025-05-01T00:00:00.000Z"),
          updDate: null,
          isUnlisted: false,
          category: "tech",
          tags: [],
          showToc: false,
        },
      },
      {
        id: "tech-hidden",
        body: "",
        data: {
          title: "Tech hidden",
          pubDate: new Date("2025-05-02T00:00:00.000Z"),
          updDate: null,
          isUnlisted: true,
          category: "tech",
          tags: [],
          showToc: false,
        },
      },
      {
        id: "life-visible",
        body: "",
        data: {
          title: "Life visible",
          pubDate: new Date("2025-05-03T00:00:00.000Z"),
          updDate: null,
          isUnlisted: false,
          category: "life",
          tags: [],
          showToc: false,
        },
      },
    ];

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = toUrl(input);
      if (url.startsWith("https://zenn.dev/api/articles")) {
        return jsonResponse({ articles: [] });
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    }) as typeof fetch;

    await techRssModule.GET();

    expect(capturedRssInput).not.toBeNull();
    if (!capturedRssInput) {
      return;
    }

    expect(capturedRssInput.title).toBe("Tech Blog - yashikota.com");
    expect(capturedRssInput.description).toBe(
      "Tech blog posts from yashikota.com",
    );
    expect(capturedRssInput.site).toBe("https://yashikota.com");

    const items = capturedRssInput.items as Array<{
      title: string;
      pubDate: Date;
      link: string;
    }>;
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("Tech visible");
    expect(items[0].pubDate).toBeInstanceOf(Date);
    expect(items[0].link).toBe("/blog/tech-visible");
  });

  test("life RSS includes only listed life posts", async () => {
    const lifeRssModule = await importLifeRssModule();

    blogCollectionEntries = [
      {
        id: "tech-visible",
        body: "",
        data: {
          title: "Tech visible",
          pubDate: new Date("2025-05-01T00:00:00.000Z"),
          updDate: null,
          isUnlisted: false,
          category: "tech",
          tags: [],
          showToc: false,
        },
      },
      {
        id: "life-hidden",
        body: "",
        data: {
          title: "Life hidden",
          pubDate: new Date("2025-05-02T00:00:00.000Z"),
          updDate: null,
          isUnlisted: true,
          category: "life",
          tags: [],
          showToc: false,
        },
      },
      {
        id: "life-visible",
        body: "",
        data: {
          title: "Life visible",
          pubDate: new Date("2025-05-03T00:00:00.000Z"),
          updDate: null,
          isUnlisted: false,
          category: "life",
          tags: [],
          showToc: false,
        },
      },
    ];

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = toUrl(input);
      if (url.startsWith("https://zenn.dev/api/articles")) {
        return jsonResponse({ articles: [] });
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    }) as typeof fetch;

    await lifeRssModule.GET();

    expect(capturedRssInput).not.toBeNull();
    if (!capturedRssInput) {
      return;
    }

    expect(capturedRssInput.title).toBe("Life Blog - yashikota.com");
    expect(capturedRssInput.description).toBe(
      "Life blog posts from yashikota.com",
    );
    expect(capturedRssInput.site).toBe("https://yashikota.com");

    const items = capturedRssInput.items as Array<{
      title: string;
      pubDate: Date;
      link: string;
    }>;
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("Life visible");
    expect(items[0].pubDate).toBeInstanceOf(Date);
    expect(items[0].link).toBe("/blog/life-visible");
  });
});
