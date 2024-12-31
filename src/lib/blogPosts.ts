import { getCollection } from "astro:content";
import { getFaviconUrl } from "./utils";

export async function getBlogPosts() {
  const blogs = await getCollection("blog");
  return blogs.map((blog) => ({
    title: blog.data.title,
    pubDate: blog.data.pubDate.toISOString().slice(0, 10),
    updDate: blog.data.updDate
      ? blog.data.updDate.toISOString().slice(0, 10)
      : null,
    isUnlisted: blog.data.isUnlisted,
    category: blog.data.category,
    tags: blog.data.tags,
    slug: blog.slug,
    body: blog.body,
    icon: getFaviconUrl("yashikota.com"),
  }));
}
