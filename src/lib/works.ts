import Works from "@/data/works.json";

interface Works {
  title: string;
  date: string;
  tags: string[];
  description: string;
  image: string;
  github: string[];
  url: string[];
}

export async function getAllWorks() {
  return [...Works] as Works[];
}
