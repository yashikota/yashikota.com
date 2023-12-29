import { getCollection } from "astro:content"

interface BlogData {
    title: string
    pubDate: Date
    updDate?: Date
    tags: string[]
}

export async function getBlogPosts() {
    const blogs = await getCollection("blog")
    return blogs.map((blog: { data: BlogData; slug: string; body: string }) => ({
        title: blog.data.title,
        pubDate: blog.data.pubDate.toISOString().slice(0, 10),
        updDate: blog.data.updDate ? blog.data.updDate.toISOString().slice(0, 10) : null,
        tags: blog.data.tags,
        slug: blog.slug,
        body: blog.body,
        icon: "/icons/blog.svg",
    }))
}
