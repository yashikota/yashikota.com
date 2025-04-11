import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import remarkDirective from "remark-directive";
import remarkGithub from "remark-github";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkLinkCard from "remark-link-card";
import rehypeMathML from "@daiji256/rehype-mathml";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeRaw from "rehype-raw";
import rehypeMermaid from "rehype-mermaid";

// https://astro.build/config
export default defineConfig({
  site: "https://yashikota.com",
  integrations: [
    react(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    sitemap(),
    expressiveCode({
      themes: ['github-dark', 'github-light'],
      styleOverrides: {
        borderRadius: '0.5rem',
        frames: {
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        },
      },
    }),
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  markdown: {
    remarkPlugins: [
      remarkDirective,
      [remarkGithub, {
        repository: "yashikota/yashikota.com"
      }],
      remarkGfm,
      remarkMath,
      [remarkLinkCard, {
        downloadLimit: 10 * 1024 * 1024, // 5MB
        timeout: 10000, // 10 seconds
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        cardClass: "rlc-container",
        infoClass: "rlc-info",
        titleClass: "rlc-title",
        descriptionClass: "rlc-description",
        urlClass: "rlc-url",
        faviconClass: "rlc-favicon",
        imageClass: "rlc-image",
        imageContainerClass: "rlc-image-container",
        urlContainerClass: "rlc-url-container",
        cache: true,
        shortenUrl: true,
        ignoreErrors: true, // エラーを無視して処理を続行
        linkAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }],
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeMathML,
      rehypeRaw,
      [rehypeExternalLinks, {
        target: "_blank",
        rel: ["noopener", "noreferrer"],
      }],
      rehypeMermaid,
    ],
    syntaxHighlight: false, // ExpressiveCodeを使用するため無効化
  },
  redirects: {
    "/blogs": {
      status: 301,
      destination: "/blog",
    },
    "/slide": {
      status: 301,
      destination: "/slides",
    },
    "/work": {
      status: 301,
      destination: "/works",
    },
    "/game": {
      status: 301,
      destination: "/games",
    },
    "/galleries": {
      status: 301,
      destination: "/gallery",
    },
  },
});
