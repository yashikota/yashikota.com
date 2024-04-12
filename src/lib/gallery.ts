import Gallery from "@/data/gallery.json";

interface Gallery {
    title: string;
    date: string;
    tags: string[];
    image: string;
    instagram: string;
    details: {
        f: string;
        focal_length: string;
        exposure: string;
        iso: string;
        camera: string;
        lens: string;
        location: string;
    };
}

export async function getGalleries() {
    return [...Gallery] as Gallery[];
}
