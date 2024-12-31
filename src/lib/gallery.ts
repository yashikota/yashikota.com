import GalleryData from "@/data/gallery.json";

interface GalleryItem {
  postId: string;
}

// Use GalleryData instead of Gallery
export { GalleryData };
export type { GalleryItem };

export async function getGalleries() {
  return GalleryData.map((item) => ({ postId: item })) as GalleryItem[];
}
