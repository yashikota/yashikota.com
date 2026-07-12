#!/usr/bin/env bun

import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import {
  buildStandardSiteDocumentRecord,
  buildStandardSitePublicationRecord,
  getStandardSiteDocumentRkey,
  getSyncableStandardSitePosts,
  STANDARD_SITE_DOCUMENT_COLLECTION,
  STANDARD_SITE_PUBLICATION_COLLECTION,
  STANDARD_SITE_PUBLICATION_RKEY,
} from "../src/lib/standard-site.ts";

const DEFAULT_SERVICE_URL = "https://bsky.social";
const DEFAULT_SITE_URL = "https://yashikota.com";
const DEFAULT_SITE_NAME = "こたのお考え";
const DEFAULT_SITE_DESCRIPTION = "こたのお考え";
const PREVIEW_PUBLICATION_URI =
  "at://did:example:preview/site.standard.publication/self";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const blogDirectory = join(projectRoot, "src/content/blog");
const standardSiteDataPath = join(projectRoot, "src/data/standard-site.json");

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");

function normalizeServiceUrl(value) {
  return new URL(value).toString().replace(/\/+$/, "");
}

function readBooleanEnv(value, defaultValue) {
  if (!value) {
    return defaultValue;
  }

  return !["0", "false", "no"].includes(value.toLowerCase());
}

function parseFrontmatter(markdown, filePath) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(markdown);
  if (!match) {
    throw new Error(`Missing frontmatter: ${filePath}`);
  }

  const [, frontmatter, body] = match;
  const data = parseYaml(frontmatter) ?? {};
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`Expected frontmatter to be a mapping in ${filePath}`);
  }

  return { body, data };
}

function requireString(value, fieldName, filePath) {
  if (typeof value !== "string" || !value) {
    throw new Error(`Expected ${fieldName} to be a string in ${filePath}`);
  }

  return value;
}

function optionalDateString(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return String(value);
}

async function listMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

async function readLocalBlogPosts() {
  const files = await listMarkdownFiles(blogDirectory);
  const posts = [];

  for (const filePath of files) {
    const markdown = await readFile(filePath, "utf8");
    const { body, data } = parseFrontmatter(markdown, filePath);
    const slug = relative(blogDirectory, filePath)
      .slice(0, -extname(filePath).length)
      .split(sep)
      .join("/");

    posts.push({
      body,
      category: data.category,
      icon: undefined,
      isUnlisted: data.isUnlisted === true,
      pubDate: requireString(data.pubDate, "pubDate", filePath),
      slug,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      title: requireString(data.title, "title", filePath),
      updDate: optionalDateString(data.updDate),
      url: `/blog/${slug}`,
    });
  }

  return posts;
}

async function readStandardSiteData() {
  try {
    const rawData = JSON.parse(await readFile(standardSiteDataPath, "utf8"));
    return {
      documents:
        rawData.documents && typeof rawData.documents === "object"
          ? rawData.documents
          : {},
      publicationUri:
        typeof rawData.publicationUri === "string"
          ? rawData.publicationUri
          : null,
    };
  } catch (error) {
    if (error?.code === "ENOENT") {
      return {
        documents: {},
        publicationUri: null,
      };
    }

    throw error;
  }
}

async function writeStandardSiteData(data) {
  const sortedDocuments = Object.fromEntries(
    Object.entries(data.documents).sort(([left], [right]) =>
      left.localeCompare(right),
    ),
  );

  await writeFile(
    standardSiteDataPath,
    `${JSON.stringify(
      {
        documents: sortedDocuments,
        publicationUri: data.publicationUri,
      },
      null,
      2,
    )}\n`,
  );
}

async function postJson(serviceUrl, endpoint, payload, accessJwt) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (accessJwt) {
    headers.Authorization = `Bearer ${accessJwt}`;
  }

  const response = await fetch(`${serviceUrl}/xrpc/${endpoint}`, {
    body: JSON.stringify(payload),
    headers,
    method: "POST",
  });
  const responseText = await response.text();
  let responseJson = {};
  if (responseText) {
    try {
      responseJson = JSON.parse(responseText);
    } catch {
      responseJson = {};
    }
  }

  if (!response.ok) {
    throw new Error(
      `${endpoint} failed with ${response.status}: ${
        responseJson.message ?? responseText
      }`,
    );
  }

  return responseJson;
}

async function createSession({ identifier, password, serviceUrl }) {
  const session = await postJson(
    serviceUrl,
    "com.atproto.server.createSession",
    {
      identifier,
      password,
    },
  );

  if (!session.accessJwt || !session.did) {
    throw new Error("PDS returned an incomplete AT Protocol session.");
  }

  return session;
}

async function putRecord({
  accessJwt,
  collection,
  record,
  repo,
  rkey,
  serviceUrl,
}) {
  const result = await postJson(
    serviceUrl,
    "com.atproto.repo.putRecord",
    {
      collection,
      record,
      repo,
      rkey,
    },
    accessJwt,
  );

  if (!result.uri) {
    throw new Error(`PDS did not return an AT-URI for ${collection}/${rkey}.`);
  }

  return result;
}

function resolvePublicationOptions() {
  return {
    description:
      process.env.STANDARD_SITE_DESCRIPTION ?? DEFAULT_SITE_DESCRIPTION,
    name: process.env.STANDARD_SITE_NAME ?? DEFAULT_SITE_NAME,
    showInDiscover: readBooleanEnv(
      process.env.STANDARD_SITE_SHOW_IN_DISCOVER,
      true,
    ),
    siteUrl:
      process.env.STANDARD_SITE_URL ??
      process.env.SITE_URL ??
      process.env.PUBLIC_SITE_URL ??
      DEFAULT_SITE_URL,
  };
}

function getPreviewRecord(record) {
  const textContent = record.textContent ?? "";

  return {
    ...record,
    textContent:
      textContent.length > 200
        ? `${textContent.slice(0, 200).trimEnd()}...`
        : textContent,
    textContentLength: textContent.length,
  };
}

async function main() {
  const serviceUrl = normalizeServiceUrl(
    process.env.ATPROTO_SERVICE ?? DEFAULT_SERVICE_URL,
  );
  const existingData = await readStandardSiteData();
  const posts = getSyncableStandardSitePosts(await readLocalBlogPosts());
  const publicationRecord = buildStandardSitePublicationRecord(
    resolvePublicationOptions(),
  );

  if (dryRun) {
    const previewPublicationUri =
      existingData.publicationUri ?? PREVIEW_PUBLICATION_URI;
    const documentRecords = posts.map((post) => ({
      collection: STANDARD_SITE_DOCUMENT_COLLECTION,
      record: getPreviewRecord(
        buildStandardSiteDocumentRecord({
          post,
          publicationUri: previewPublicationUri,
        }),
      ),
      rkey: getStandardSiteDocumentRkey(post.slug),
    }));

    console.log(
      JSON.stringify(
        {
          documents: documentRecords,
          dryRun: true,
          publication: {
            collection: STANDARD_SITE_PUBLICATION_COLLECTION,
            record: publicationRecord,
            rkey: STANDARD_SITE_PUBLICATION_RKEY,
          },
        },
        null,
        2,
      ),
    );
    return;
  }

  const identifier = process.env.ATPROTO_IDENTIFIER;
  const password = process.env.ATPROTO_APP_PASSWORD;

  if (!identifier || !password) {
    throw new Error(
      "Set ATPROTO_IDENTIFIER and ATPROTO_APP_PASSWORD before syncing Standard.site records.",
    );
  }

  const session = await createSession({ identifier, password, serviceUrl });
  console.log(`Authenticated as ${session.handle ?? session.did}`);

  const publication = await putRecord({
    accessJwt: session.accessJwt,
    collection: STANDARD_SITE_PUBLICATION_COLLECTION,
    record: publicationRecord,
    repo: session.did,
    rkey: STANDARD_SITE_PUBLICATION_RKEY,
    serviceUrl,
  });

  const nextData = {
    documents: {},
    publicationUri: publication.uri,
  };

  for (const post of posts) {
    const rkey = getStandardSiteDocumentRkey(post.slug);
    const record = buildStandardSiteDocumentRecord({
      post,
      publicationUri: publication.uri,
    });
    const document = await putRecord({
      accessJwt: session.accessJwt,
      collection: STANDARD_SITE_DOCUMENT_COLLECTION,
      record,
      repo: session.did,
      rkey,
      serviceUrl,
    });

    nextData.documents[post.slug] = document.uri;
    console.log(`Synced ${basename(post.slug)} -> ${document.uri}`);
  }

  await writeStandardSiteData(nextData);
  console.log(
    `Updated ${relative(projectRoot, standardSiteDataPath)} with ${posts.length} document AT-URIs.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
