import type { Slide } from "@/lib/slide";
import { SlideComponent } from "./slide";

interface SlidesPageProps {
  slides: Slide[];
}

export const SlidesPage = ({ slides }: SlidesPageProps) => {
  return (
    <div className="xl:w-4/5 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slides.map((slide, index) => (
          <SlideComponent
            key={`slide-${slide.path || index}`}
            thumbnail={`/slides/${slide.path}/001.png`}
            title={slide.title}
            pubDate={slide.pubDate}
            tags={slide.tags}
            url={`/slides/${slide.path}`}
          />
        ))}
      </div>
    </div>
  );
};
