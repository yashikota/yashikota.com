import { describe, expect, test } from "bun:test";
import {
  buildStandardSiteDocumentRecord,
  buildStandardSitePublicationRecord,
  createPublicationWellKnownResponse,
  getDocumentUriForSlug,
  getStandardSiteDocumentPath,
  getStandardSiteDocumentRkey,
  getSyncableStandardSitePosts,
  isAtUri,
  type StandardSiteDataFile,
  type StandardSitePost,
  toStandardSiteDateTime,
  trimTrailingSlash,
} from "./standard-site";

const standardSiteData: StandardSiteDataFile = {
  documents: {
    draft: null,
    visible: "at://did:plc:example/site.standard.document/visible",
  },
  publicationUri: "at://did:plc:example/site.standard.publication/self",
};

describe("Standard.site data helpers", () => {
  test("detects AT-URIs", () => {
    expect(isAtUri("at://did:plc:example/site.standard.document/post")).toBe(
      true,
    );
    expect(isAtUri("https://example.com/post")).toBe(false);
    expect(isAtUri(null)).toBe(false);
  });

  test("returns a document AT-URI for configured slugs only", () => {
    expect(getDocumentUriForSlug("visible", standardSiteData)).toBe(
      "at://did:plc:example/site.standard.document/visible",
    );
    expect(getDocumentUriForSlug("draft", standardSiteData)).toBeNull();
    expect(getDocumentUriForSlug("missing", standardSiteData)).toBeNull();
  });

  test("creates publication well-known responses", async () => {
    const configuredResponse =
      createPublicationWellKnownResponse(standardSiteData);
    expect(configuredResponse.status).toBe(200);
    expect(await configuredResponse.text()).toBe(
      "at://did:plc:example/site.standard.publication/self\n",
    );

    const missingResponse = createPublicationWellKnownResponse({
      documents: {},
      publicationUri: null,
    });
    expect(missingResponse.status).toBe(404);
  });
});

describe("Standard.site record builders", () => {
  test("builds publication records without a trailing URL slash", () => {
    const record = buildStandardSitePublicationRecord({
      description: "Description",
      name: "Example Blog",
      showInDiscover: false,
      siteUrl: "https://example.com/",
    });

    expect(record).toEqual({
      $type: "site.standard.publication",
      description: "Description",
      name: "Example Blog",
      preferences: {
        showInDiscover: false,
      },
      url: "https://example.com",
    });
  });

  test("builds document records from local post metadata", () => {
    const post: StandardSitePost = {
      body: "# Heading\n\nHello **world**.",
      category: "tech",
      isUnlisted: false,
      pubDate: "2025-01-02",
      slug: "hello-world",
      tags: ["Astro", "ATProto"],
      title: "Hello World",
      updDate: "2025-01-03",
      url: "/blog/hello-world",
    };

    const record = buildStandardSiteDocumentRecord({
      post,
      publicationUri: standardSiteData.publicationUri ?? "",
    });

    expect(record).toEqual({
      $type: "site.standard.document",
      description: "Heading Hello world.",
      path: "/blog/hello-world/",
      publishedAt: "2025-01-02T00:00:00.000Z",
      site: "at://did:plc:example/site.standard.publication/self",
      tags: ["Astro", "ATProto"],
      textContent: "Heading Hello world.",
      title: "Hello World",
      updatedAt: "2025-01-03T00:00:00.000Z",
    });
  });

  test("filters syncable posts to listed local blog posts", () => {
    const posts = [
      {
        pubDate: "2025-01-01",
        slug: "listed",
        tags: [],
        title: "Listed",
        url: "/blog/listed",
      },
      {
        isUnlisted: true,
        pubDate: "2025-01-01",
        slug: "hidden",
        tags: [],
        title: "Hidden",
        url: "/blog/hidden",
      },
      {
        pubDate: "2025-01-01",
        slug: "",
        tags: [],
        title: "External",
        url: "https://example.com",
      },
    ] satisfies StandardSitePost[];

    expect(
      getSyncableStandardSitePosts(posts).map((post) => post.slug),
    ).toEqual(["listed"]);
  });
});

describe("Standard.site formatting helpers", () => {
  test("formats paths, dates, record keys, and URLs", () => {
    expect(getStandardSiteDocumentPath("example")).toBe("/blog/example/");
    expect(getStandardSiteDocumentRkey("example-post_1")).toBe(
      "example-post_1",
    );
    expect(toStandardSiteDateTime("2025-01-02")).toBe(
      "2025-01-02T00:00:00.000Z",
    );
    expect(trimTrailingSlash("https://example.com///")).toBe(
      "https://example.com",
    );
  });

  test("rejects invalid record keys and dates", () => {
    expect(() => getStandardSiteDocumentRkey("bad/key")).toThrow();
    expect(() => toStandardSiteDateTime("not a date")).toThrow();
  });
});
