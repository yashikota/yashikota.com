import type { APIRoute } from "astro";
import { getBlogPosts } from "@/lib/posts";

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const posts = await getBlogPosts();
  const siteUrl = context.site?.origin ?? "https://yashikota.com";
  const disallowRules = posts
    .filter((post) => post.isUnlisted)
    .flatMap((post) => [
      `Disallow: /blog/${post.slug}`,
      `Disallow: /blog/${post.slug}/`,
    ]);

  return new Response(
    [
      "User-agent: *",
      ...disallowRules,
      "",
      `Sitemap: ${siteUrl}/sitemap-index.xml`,
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
};
