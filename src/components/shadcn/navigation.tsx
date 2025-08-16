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

  const handleTabChange = (value: string) => {
    const newPath = `/${value}`;
    window.location.href = newPath;
  };

  return (
    <div className="w-full mb-6">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid xl:w-4/5 mx-auto grid-cols-3">
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="works">Works</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
