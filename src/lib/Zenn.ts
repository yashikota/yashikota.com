interface zennArticle {
    title: string
    published_at: string
    body_updated_at: string
    path: string
}

async function fetchZennPosts() {
    const url = "https://zenn.dev/api/articles?username=yashikota&order=latest"
    const res = await fetch(url)
    const json = await res.json()
    return json.articles as zennArticle[]
}

async function fetchZennTopics(url: string) {
    const res = await fetch(url)
    const html = await res.text()

    const regex = /<a class=".*?View_topicName.*?">(.*?)<\/div>/g
    const tags = []
    let match
    while ((match = regex.exec(html)) !== null) {
        tags.push(match[1])
    }
    return tags.slice(0, -1)
}

export async function getZennPosts() {
    const articles = await fetchZennPosts()
    const posts = await Promise.all(
        articles.map(async (article) => {
            const { title, published_at, body_updated_at, path } = article
            const url = `https://zenn.dev${path}`
            const topics = await fetchZennTopics(url)

            return {
                title,
                pubDate: published_at.slice(0, 10), // YYYY-MM-DD
                updDate:
                    published_at.slice(0, 10) === body_updated_at.slice(0, 10)
                        ? null
                        : body_updated_at.slice(0, 10), // YYYY-MM-DD
                tags: topics,
                url: url,
                icon: "/icons/zenn.svg",
            }
        }),
    )
    return posts
}
