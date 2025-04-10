import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Maximize2, Minimize2 } from "lucide-react";

export function CarouseComponent({
  path,
  pages,
}: { path: string; pages: number }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // キーボードイベントハンドラを追加
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!api) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        api.scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        api.scrollNext();
      } else if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        toggleFullscreen();
      } else if (event.key === "Escape" && isFullscreen) {
        event.preventDefault();
        exitFullscreen();
      }
    };

    // グローバルイベントリスナーを追加
    window.addEventListener("keydown", handleKeyDown);

    // クリーンアップ関数
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [api, isFullscreen]);

  // 全画面表示の切り替え
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      carouselRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 全画面表示の終了
  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 全画面表示の変更を監視
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={carouselRef}
      className={`focus:outline-none ${isFullscreen ? "fullscreen-slide" : ""}`}
    >
      <Carousel
        setApi={setApi}
        className={`${isFullscreen ? "w-full" : "w-[90%] mx-auto"}`}
      >
        <CarouselContent>
          {Array.from({ length: pages }).map((_, index) => (
            <CarouselItem key={`page-${index + 1}`}>
              <Card
                className={
                  isFullscreen ? "border-0 shadow-none bg-transparent" : ""
                }
              >
                <CardContent
                  className={`items-center justify-center p-1 ${isFullscreen ? "p-0" : ""}`}
                >
                  <img
                    src={`/slides/${path}/${(index + 1)
                      .toString()
                      .padStart(3, "0")}.png`}
                    alt="slide"
                    className={`${isFullscreen ? "max-h-[100vh]" : "max-h-[80vh]"} w-auto mx-auto object-contain`}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={isFullscreen ? "text-white" : ""} />
        <CarouselNext className={isFullscreen ? "text-white" : ""} />
      </Carousel>
      <div
        className={`flex justify-center items-center gap-2 py-2 ${isFullscreen ? "absolute bottom-4 left-0 right-0 text-white" : ""}`}
      >
        <div className="text-md text-muted-foreground">
          {current} / {count}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className={`ml-2 ${isFullscreen ? "bg-black/30 text-white border-white/50 hover:bg-black/50" : ""}`}
          title={isFullscreen ? "全画面を終了" : "全画面表示"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
