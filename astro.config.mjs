import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import playformCompress from "@playform/compress";
import playformInline from "@playform/inline";

// https://astro.build/config
export default defineConfig({
    site: "https://yashikota.com",
    integrations: [
        react(),
        tailwind({
            applyBaseStyles: false,
        }),
        partytown({
            config: {
                forward: ["dataLayer.push"],
            },
        }),
        sitemap(),
        playformCompress(),
        playformInline(),
    ],
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
