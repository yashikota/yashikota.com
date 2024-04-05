import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

export function CarouseComponent({
    path,
    pages,
}: { path: string; pages: number }) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            console.log("current");
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <div>
            <Carousel setApi={setApi} className="w-[90%] mx-auto">
                <CarouselContent>
                    {Array.from({ length: pages }).map((_, index) => (
                        <CarouselItem key={index}>
                            <Card>
                                <CardContent className="items-center justify-center p-1">
                                    <img
                                        src={`/slides/${path}/${(index + 1)
                                            .toString()
                                            .padStart(3, "0")}.png`}
                                        alt="slide"
                                    />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <div className="py-2 text-center text-md text-muted-foreground">
                Slide {current} of {count}
            </div>
        </div>
    );
}
