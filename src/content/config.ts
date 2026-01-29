import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    updDate: z.date().nullable(),
    isUnlisted: z.boolean(),
    category: z.enum(["life", "tech"]),
    tags: z.array(z.string()),
    showToc: z.boolean(),
  }),
});

export const collections = {
  blog: blogCollection,
};
