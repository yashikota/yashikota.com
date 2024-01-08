import Slides from "../data/slides.json"

interface Slide {
    title: string
    pubDate: string
    tags: string[]
    path: string
    pages: number
}

export async function getAllSlides() {
    const slides = [...Slides] as Slide[]
    slides.sort((a, b) => {
        const dateA = new Date(a.pubDate)
        const dateB = new Date(b.pubDate)
        return dateB.getTime() - dateA.getTime()
    })

    return slides
}
