import { getCollection } from "astro:content";
import ExternalPostsData from "@/data/posts.json";
import type { Post } from "@/types/post";
import { getFaviconUrl } from "./utils";

interface ExtendedPost extends Post {
  icon: string;
  body?: string;
  showToc?: boolean;
}

interface ExternalPost {
  title: string;
  pubDate: string;
  updDate: string | null;
  tags: string[];
  url: string;
}

interface ZennArticle {
  title: string;
  published_at: string;
  body_updated_at: string;
  path: string;
}

export async function getBlogPosts(): Promise<ExtendedPost[]> {
  const blogs = await getCollection("blog");
  return blogs.map((blog) => ({
    title: blog.data.title,
    pubDate: blog.data.pubDate.toISOString().slice(0, 10),
    updDate: blog.data.updDate
      ? blog.data.updDate.toISOString().slice(0, 10)
      : null,
    isUnlisted: blog.data.isUnlisted,
    category: blog.data.category,
    tags: blog.data.tags || [],
    slug: blog.slug,
    body: blog.body,
    url: `/blog/${blog.slug}`,
    icon: getFaviconUrl("yashikota.com"),
    showToc: blog.data.showToc,
  }));
}

export async function getExternalPosts(): Promise<ExtendedPost[]> {
  const posts = ExternalPostsData as ExternalPost[];
  return posts.map((post) => ({
    ...post,
    slug: "",
    icon: getFaviconUrl(new URL(post.url).origin),
  }));
}

async function fetchZennPosts() {
  const url = "https://zenn.dev/api/articles?username=yashikota&order=latest";
  const res = await fetch(url);
  const json = await res.json();

  return json.articles as ZennArticle[];
}

async function fetchZennTopics(url: string) {
  const res = await fetch(url);
  const html = await res.text();

  const regex = /<div class="TopicList_name__[^"]*">(.*?)<\/div>/g;
  const tags = [];
  let match: RegExpExecArray | null = regex.exec(html);
  while (match !== null) {
    tags.push(match[1]);
    match = regex.exec(html);
  }
  return tags;
}

export async function getZennPosts(): Promise<ExtendedPost[]> {
  const ZennPosts = await fetchZennPosts();
  const posts = await Promise.all(
    ZennPosts.map(async (article) => {
      const { title, published_at, body_updated_at, path } = article;
      const url = `https://zenn.dev${path}`;
      const topics = await fetchZennTopics(url);

      return {
        title,
        pubDate: published_at.slice(0, 10), // YYYY-MM-DD
        updDate:
          published_at.slice(0, 10) === body_updated_at.slice(0, 10)
            ? null
            : body_updated_at.slice(0, 10), // YYYY-MM-DD
        category: "tech" as const,
        tags: topics,
        slug: "",
        url: url,
        icon: getFaviconUrl(new URL(url).origin),
      };
    }),
  );

  return posts;
}

export async function getAllPosts(): Promise<Post[]> {
  const blog = await getBlogPosts();
  const zenn = await getZennPosts();
  const external = await getExternalPosts();

  const posts = [...blog, ...zenn, ...external].map(
    (post): Post => ({
      title: post.title,
      pubDate: post.pubDate,
      updDate: post.updDate,
      isUnlisted: post.isUnlisted,
      category: post.category,
      tags: post.tags || [],
      slug: post.slug || "",
      url: post.url,
      icon: post.icon,
    }),
  );

  posts.sort((a, b) => {
    const dateA = new Date(a.pubDate);
    const dateB = new Date(b.pubDate);
    return dateB.getTime() - dateA.getTime();
  });

  return posts;
}
