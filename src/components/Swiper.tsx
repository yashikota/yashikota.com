import { Swiper, SwiperSlide } from "swiper/react"
import { Keyboard, Mousewheel, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

export default function SwiperComponent({ path, pages }: { path: string; pages: number }) {
    return (
        <Swiper
            keyboard={true}
            mousewheel={true}
            pagination={{
                type: "progressbar",
            }}
            modules={[Keyboard, Mousewheel, Pagination]}
            className="border-2 black"
        >
            {[...Array(pages)].map((_, i) => {
                const pageNumber = (i + 1).toString().padStart(3, "0")
                const imagePath = `/slides/${path}/${pageNumber}.png`

                return (
                    <SwiperSlide key={i}>
                        <img src={imagePath} alt={`${pageNumber}.png`} />
                    </SwiperSlide>
                )
            })}
        </Swiper>
    )
}
