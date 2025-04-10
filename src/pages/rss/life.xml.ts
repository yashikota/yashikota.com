import rss from "@astrojs/rss";
import { getAllPosts } from "@/lib/allPosts";

export async function GET() {
  const posts = await getAllPosts();
  const lifePosts = posts.filter(
    (post) => post.category === "life" && !post.isUnlisted,
  );

  return rss({
    title: "Life Blog - yashikota.com",
    description: "Life blog posts from yashikota.com",
    site: "https://yashikota.com",
    items: lifePosts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.pubDate),
      description: post.description,
      link: `/blog/${post.slug}`,
    })),
  });
}
