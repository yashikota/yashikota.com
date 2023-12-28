import { getBlogPosts } from "./BlogPosts"
import { getZennPosts } from "./Zenn"
import ExternalPosts from "../links/posts.json"

export interface Post {
    slug: string
    title: string
    pubDate: string
    tags: string[]
    url: string
}

export async function getAllPosts() {
    const blog = await getBlogPosts()
    const zenn = await getZennPosts()

    const posts = [...blog, ...zenn, ...ExternalPosts] as Post[]
    posts.sort((a, b) => {
        const dateA = new Date(a.pubDate)
        const dateB = new Date(b.pubDate)
        return dateB.getTime() - dateA.getTime()
    })

    return posts
}
