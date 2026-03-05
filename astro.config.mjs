import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const DEFAULT_SITE_URL = "https://yashikota.com";

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
