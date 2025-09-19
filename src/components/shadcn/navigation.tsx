import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

interface NavigationProps {
  currentTab: string;
}

export const Navigation = ({ currentTab }: NavigationProps) => {
  const [activeTab, setActiveTab] = useState<string>(currentTab);

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  return (
    <div className="w-full mb-6">
      <Tabs value={activeTab} className="w-full">
        <TabsList className="grid xl:w-4/5 mx-auto grid-cols-3">
          <TabsTrigger value="blog" asChild>
            <a href="/blog">Blog</a>
          </TabsTrigger>
          <TabsTrigger value="works" asChild>
            <a href="/works">Works</a>
          </TabsTrigger>
          <TabsTrigger value="about" asChild>
            <a href="/about">About</a>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
