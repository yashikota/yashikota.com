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
        <Blog html={aboutContent} />
      </div>
    </div>
  );
};
