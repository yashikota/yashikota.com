import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const DEFAULT_SITE_URL = "https://yashikota.com";
const BLOG_CONTENT_DIR = fileURLToPath(
  new URL("./src/content/blog/", import.meta.url),
);

const getMarkdownFiles = (dir) => {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      return getMarkdownFiles(path);
    }

    return [".md", ".mdx"].includes(extname(entry.name)) ? [path] : [];
  });
};

const getUnlistedBlogPaths = () => {
  return getMarkdownFiles(BLOG_CONTENT_DIR).flatMap((path) => {
    const content = readFileSync(path, "utf-8");
    if (!/^isUnlisted:\s*true\s*$/m.test(content)) {
      return [];
    }

    const slug = relative(BLOG_CONTENT_DIR, path)
      .split(sep)
      .join("/")
      .replace(/\.(md|mdx)$/, "");

    return [`/blog/${slug}/`];
  });
};

const unlistedBlogPaths = new Set(getUnlistedBlogPaths());

const createUnlistedHeadersIntegration = () => ({
  name: "unlisted-headers",
  hooks: {
    "astro:build:done": ({ dir }) => {
      const headers = [...unlistedBlogPaths]
        .flatMap((path) => {
          const pathWithoutTrailingSlash = path.replace(/\/$/, "");
          return [
            pathWithoutTrailingSlash,
            "  X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex",
            path,
            "  X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex",
          ];
        })
        .join("\n");

      writeFileSync(fileURLToPath(new URL("_headers", dir)), `${headers}\n`);
    },
  },
});

const resolveSiteUrl = () => {
  const envSiteUrl = process.env.SITE_URL ?? process.env.PUBLIC_SITE_URL;
  if (!envSiteUrl) {
    return DEFAULT_SITE_URL;
  }

  try {
    const url = new URL(envSiteUrl);
    return url.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
};

// https://astro.build/config
export default defineConfig({
  site: resolveSiteUrl(),
  integrations: [
    react(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        return !unlistedBlogPaths.has(pathname);
      },
    }),
    createUnlistedHeadersIntegration(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    "/": {
      status: 301,
      destination: "/blog",
    },
    "/blogs": {
      status: 301,
      destination: "/blog",
    },
    "/work": {
      status: 301,
      destination: "/works",
    },
  },
});
