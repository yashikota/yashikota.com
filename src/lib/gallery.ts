import Gallery from "@/data/gallery.json";

interface Gallery {
  postId: string;
}

export async function getGalleries() {
  return Gallery.map((item) => ({ postId: item })) as Gallery[];
}
