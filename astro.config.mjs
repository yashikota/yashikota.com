import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

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
