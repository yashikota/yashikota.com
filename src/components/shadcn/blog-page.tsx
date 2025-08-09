import type { Post } from "@/types/post";
import { BlogCardComponent } from "./card";
import { Rss } from "lucide-react";

interface BlogPageProps {
  techPosts: Post[];
  lifePosts: Post[];
}

export const BlogPage = ({ techPosts, lifePosts }: BlogPageProps) => {
  return (
    <div className="xl:w-4/5 mx-auto">
      {/* Tech Section */}
      {techPosts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Tech</h2>
          {techPosts.map((post, index) => (
            <div
              key={`tech-${post.slug || index}`}
              className="mb-3"
            >
              <BlogCardComponent
                title={post.title}
                slug={post.slug}
                url={post.url}
                pubDate={post.pubDate}
                updDate={post.updDate ?? null}
                tags={post.tags ?? []}
                icon={post.icon ?? ""}
              />
            </div>
          ))}
        </div>
      )}

      {/* Life Section */}
      {lifePosts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Life</h2>
          {lifePosts.map((post, index) => (
            <div
              key={`life-${post.slug || index}`}
              className="mb-3"
            >
              <BlogCardComponent
                title={post.title}
                slug={post.slug}
                url={post.url}
                pubDate={post.pubDate}
                updDate={post.updDate ?? null}
                tags={post.tags ?? []}
                icon={post.icon ?? ""}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <div className="flex space-x-4">
          <a
            href="/rss/tech.xml"
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Rss className="h-4 w-4 mr-1" />
            Tech RSS
          </a>
          <a
            href="/rss/life.xml"
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Rss className="h-4 w-4 mr-1" />
            Life RSS
          </a>
        </div>
      </div>
    </div>
  );
};
