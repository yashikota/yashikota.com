import { getBlogPosts } from "./blogPosts";
import { getZennPosts } from "./zennPosts";
import { getExternalPosts } from "./externalPosts";

interface Post {
    slug: string;
    title: string;
    pubDate: string;
    updDate: string | null;
    isUnlisted: boolean;
    category: string;
    tags: string[];
    url: string;
    icon: string;
}

export async function getAllPosts() {
    const blog = await getBlogPosts();
    const zenn = await getZennPosts();
    const ExternalPosts = await getExternalPosts();

    const posts = [...blog, ...zenn, ...ExternalPosts] as Post[];
    posts.sort((a, b) => {
        const dateA = new Date(a.pubDate);
        const dateB = new Date(b.pubDate);
        return dateB.getTime() - dateA.getTime();
    });

    return posts;
}
