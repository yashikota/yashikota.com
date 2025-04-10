import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Post } from "@/types/post";
import { Rss } from "lucide-react";

import { useEffect, useState } from "react";
import { BlogCardComponent } from "./card";

interface BlogProps {
  techPosts?: Post[];
  lifePosts?: Post[];
}

export const BlogComponent = ({
  techPosts = [],
  lifePosts = [],
}: BlogProps) => {
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    setActiveTab(hash === "life" ? "life" : "tech");
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  return (
    <div className="w-full">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid xl:w-4/5 mx-auto grid-cols-2">
          <TabsTrigger value="tech">Tech</TabsTrigger>
          <TabsTrigger value="life">Life</TabsTrigger>
        </TabsList>
        <TabsContent value="tech">
          {techPosts.map((post, index) => (
            <div
              key={`tech-${post.slug || index}`}
              className="xl:w-4/5 mx-auto"
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
        </TabsContent>
        <TabsContent value="life">
          {lifePosts.map((post, index) => (
            <div
              key={`life-${post.slug || index}`}
              className="xl:w-4/5 mx-auto"
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
        </TabsContent>
      </Tabs>

      <div className="xl:w-4/5 mx-auto mt-4 flex justify-end">
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
