import { getCollection } from "astro:content";
import WorksData from "@/data/works.json";

interface WorkItem {
  title: string;
  date: string;
  tags: string[];
  description: string;
  image: string;
  github: string[];
  url: string[];
  path: string;
}

export async function getAllWorks() {
  return [...WorksData] as WorkItem[];
}

export async function getWorkContent(slug: string) {
  const works = await getCollection("works");
  return works.find((work) => work.slug === slug);
}

export { WorksData };
export type { WorkItem };