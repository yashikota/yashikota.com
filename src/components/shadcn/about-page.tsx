import { Blog } from "@/components/blog";
import { ProfileComponent } from "./profile";

interface AboutPageProps {
  aboutContent: string;
}

export const AboutPage = ({ aboutContent }: AboutPageProps) => {
  return (
    <div className="xl:w-4/5 mx-auto">
      <ProfileComponent />
      <div className="w-full max-w-3xl mx-auto">
        <div
          className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: aboutContent }}
        />
        <Blog />
      </div>
    </div>
  );
};
