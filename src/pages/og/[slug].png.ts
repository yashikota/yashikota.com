import type { APIRoute } from "astro";
import { renderOgPng } from "@/lib/og-image";
import { getBlogPosts } from "@/lib/posts";
import { splitJapaneseText, truncateText } from "@/lib/seo";

export const prerender = true;

type OgPageProps = {
  title: string;
  tags: string[];
};

export async function getStaticPaths() {
  const posts = await getBlogPosts();

  return posts
    .filter((post) => !post.isUnlisted)
    .map((post) => ({
      params: { slug: post.slug },
      props: {
        title: post.title,
        tags: post.tags,
      } satisfies OgPageProps,
    }));
}

export const GET: APIRoute<OgPageProps> = async ({ props }) => {
  const titleLines = splitJapaneseText(truncateText(props.title, 88), 4, 18);

  const png = await renderOgPng({
    titleLines,
    tags: props.tags,
  });

  const body = Uint8Array.from(png);

  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
