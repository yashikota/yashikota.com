import ExternalPostsData from "../data/posts.json";
import { getFaviconUrl } from "./utils";

interface ExternalPost {
    title: string;
    pubDate: string;
    updDate: string | null;
    tags: string[];
    url: string;
}

export async function getExternalPosts() {
    const posts = ExternalPostsData as ExternalPost[];
    return posts.map((post) => ({
        ...post,
        icon: getFaviconUrl(new URL(post.url).origin),
    }));
}
