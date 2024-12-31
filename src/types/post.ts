export interface Post {
  title: string;
  pubDate: string;
  updDate?: string | null;
  isUnlisted?: boolean;
  category?: "tech" | "life";
  tags?: string[];
  icon?: string;
  slug: string;
  url: string;
}
