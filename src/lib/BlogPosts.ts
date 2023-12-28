import { getCollection } from "astro:content"

export async function getBlogPosts() {
    const blogs = await getCollection("blog")
    return blogs.map((blog) => ({
        title: blog.data.title,
        pubDate: blog.data.pubDate.toISOString().slice(0, 10),
        tags: blog.data.tags,
        slug: blog.slug,
        body: blog.body,
    }))
}
