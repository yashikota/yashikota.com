import { defineConfig } from "astro/config";
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind({
    applyBaseStyles: false
  })],
  redirects: {
    "/blogs": {
      status: 301,
      destination: "/blog"
    },
    "/slide": {
      status: 301,
      destination: "/slides"
    },
    "/work": {
      status: 301,
      destination: "/works"
    },
    "/game": {
      status: 301,
      destination: "/games"
    }
  }
});
