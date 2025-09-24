import rss from "@astrojs/rss";
import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const posts = await getAllPosts();
  const techPosts = posts.filter(
    (post) => post.category === "tech" && !post.isUnlisted,
  );

  return rss({
    title: "Tech Blog - yashikota.com",
    description: "Tech blog posts from yashikota.com",
    site: "https://yashikota.com",
    items: techPosts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.pubDate),
      link: post.url || `/blog/${post.slug}`,
    })),
  });
}
