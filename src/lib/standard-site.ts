import StandardSiteData from "../data/standard-site.json";
import type { Post } from "../types/post";
import {
  createDescriptionFromMarkdown,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  stripMarkdown,
} from "./seo";

export const STANDARD_SITE_PUBLICATION_COLLECTION = "site.standard.publication";
export const STANDARD_SITE_DOCUMENT_COLLECTION = "site.standard.document";
export const STANDARD_SITE_PUBLICATION_RKEY = "self";

export interface StandardSiteDataFile {
  publicationUri: string | null;
  documents: Record<string, string | null | undefined>;
}

export interface StandardSitePublicationRecord {
  $type: typeof STANDARD_SITE_PUBLICATION_COLLECTION;
  url: string;
  name: string;
  description?: string;
  preferences: {
    showInDiscover: boolean;
  };
}

export interface StandardSiteDocumentRecord {
  $type: typeof STANDARD_SITE_DOCUMENT_COLLECTION;
  site: string;
  path: string;
  title: string;
  publishedAt: string;
  description?: string;
  tags?: string[];
  textContent?: string;
  updatedAt?: string;
}

export interface StandardSitePost extends Post {
  body?: string | null;
}

const AT_URI_PATTERN = /^at:\/\/[^/\s]+\/[^/\s]+\/[^/\s]+$/;

export function getStandardSiteData(): StandardSiteDataFile {
  return StandardSiteData as StandardSiteDataFile;
}

export function isAtUri(value: unknown): value is string {
  return typeof value === "string" && AT_URI_PATTERN.test(value);
}

export function getPublicationUri(
  data: StandardSiteDataFile = getStandardSiteData(),
): string | null {
  return isAtUri(data.publicationUri) ? data.publicationUri : null;
}

export function getDocumentUriForSlug(
  slug: string,
  data: StandardSiteDataFile = getStandardSiteData(),
): string | null {
  const uri = data.documents[slug];
  return isAtUri(uri) ? uri : null;
}

export function createPublicationWellKnownResponse(
  data: StandardSiteDataFile = getStandardSiteData(),
): Response {
  const publicationUri = getPublicationUri(data);
  if (!publicationUri) {
    return new Response(
      "Standard.site publication AT-URI is not configured.\n",
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
        status: 404,
      },
    );
  }

  return new Response(`${publicationUri}\n`, {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getStandardSiteDocumentPath(slug: string): string {
  return `/blog/${slug}/`;
}

export function getStandardSiteDocumentRkey(slug: string): string {
  if (!/^[A-Za-z0-9._~:-]{1,512}$/.test(slug)) {
    throw new Error(`Invalid AT Protocol record key for blog slug: ${slug}`);
  }

  return slug;
}

export function toStandardSiteDateTime(value: string): string {
  const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T00:00:00.000Z`
    : value;
  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid Standard.site datetime: ${value}`);
  }

  return date.toISOString();
}

export function buildStandardSitePublicationRecord({
  description = DEFAULT_DESCRIPTION,
  name = SITE_NAME,
  showInDiscover = true,
  siteUrl = SITE_URL,
}: {
  description?: string;
  name?: string;
  showInDiscover?: boolean;
  siteUrl?: string;
} = {}): StandardSitePublicationRecord {
  return {
    $type: STANDARD_SITE_PUBLICATION_COLLECTION,
    description,
    name,
    preferences: {
      showInDiscover,
    },
    url: trimTrailingSlash(siteUrl),
  };
}

export function buildStandardSiteDocumentRecord({
  post,
  publicationUri,
}: {
  post: StandardSitePost;
  publicationUri: string;
}): StandardSiteDocumentRecord {
  const body = post.body ?? "";
  const description = createDescriptionFromMarkdown(body);
  const textContent = stripMarkdown(body);
  const record: StandardSiteDocumentRecord = {
    $type: STANDARD_SITE_DOCUMENT_COLLECTION,
    description,
    path: getStandardSiteDocumentPath(post.slug),
    publishedAt: toStandardSiteDateTime(post.pubDate),
    site: publicationUri,
    tags: post.tags,
    textContent,
    title: post.title,
  };

  if (post.updDate) {
    record.updatedAt = toStandardSiteDateTime(post.updDate);
  }

  return record;
}

export function getSyncableStandardSitePosts(
  posts: StandardSitePost[],
): StandardSitePost[] {
  return posts.filter((post) => Boolean(post.slug) && !post.isUnlisted);
}
