import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
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

const worksCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
  }),
});

export const collections = {
  blog: blogCollection,
  works: worksCollection,
};
