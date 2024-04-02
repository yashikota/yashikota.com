import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        updDate: z.date().nullable(),
        isUnlisted: z.boolean(),
        tags: z.array(z.string()),
    }),
});

export const collections = {
    blog: blogCollection,
};
