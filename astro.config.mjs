import { defineConfig } from "astro/config"
import pandacss from "@pandacss/astro"

import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
    integrations: [pandacss(), react()],
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
    },
})
