import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Keyboard, Mousewheel } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"

export default function SwiperComponent({ path, pages }: { path: string; pages: number }) {
    return (
        <Swiper navigation={true} keyboard={true} mousewheel={true} modules={[Navigation, Keyboard, Mousewheel]}>
            {[...Array(pages)].map((_, i) => {
                const pageNumber = (i + 1).toString().padStart(3, "0")
                const imagePath = `${path}/${pageNumber}.png`

                return (
                    <SwiperSlide key={i}>
                        <img src={imagePath} alt={`${pageNumber}.png`} />
                    </SwiperSlide>
                )
            })}
        </Swiper>
    )
}
