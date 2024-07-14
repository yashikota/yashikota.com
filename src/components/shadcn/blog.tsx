import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BlogCardComponent } from "./card";
import { useEffect, useState } from "react";

interface BlogProps {
    // techPosts: BlogCardComponentProps[];
    // lifePosts: BlogCardComponentProps[];
    techPosts: any[];
    lifePosts: any[];
}

interface BlogCardComponentProps {
    title: string;
    pubDate: string;
    updDate: string | null;
    isUnlisted: boolean;
    category: "tech" | "life";
    tags: string[];
    icon: string;
    slug: string;
    url: string;
}

export const BlogComponent = ({ techPosts, lifePosts }: BlogProps) => {
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
                {techPosts.map((post) => (
                    <div key={post.slug} className="xl:w-4/5 mx-auto">
                        <BlogCardComponent
                            title={post.title}
                            slug={post.slug}
                            url={post.url}
                            pubDate={post.pubDate}
                            updDate={post.updDate}
                            tags={post.tags}
                            icon={post.icon}
                        />
                    </div>
                ))}
            </TabsContent>
            <TabsContent value="life">
                {lifePosts.map((post) => (
                    <div key={post.slug} className="xl:w-4/5 mx-auto">
                        <BlogCardComponent
                            title={post.title}
                            slug={post.slug}
                            url={post.url}
                            pubDate={post.pubDate}
                            updDate={post.updDate}
                            tags={post.tags}
                            icon={post.icon}
                        />
                    </div>
                ))}
            </TabsContent>
        </Tabs>
    );
};
