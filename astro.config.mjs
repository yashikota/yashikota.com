import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import remarkDirective from "remark-directive";
import remarkGithub from "remark-github";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { remarkLinkCardPlugin } from "./src/lib/remarkLinkCardPlugin";

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
      remarkLinkCardPlugin,
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
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
