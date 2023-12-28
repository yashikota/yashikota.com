interface zennArticle {
    title: string
    published_at: string
    path: string
}

async function fetchZennArticles() {
    const url = "https://zenn.dev/api/articles?username=yashikota&order=latest"
    const res = await fetch(url)
    const json = await res.json()
    return json.articles as zennArticle[]
}

export async function getZennPosts() {
    const articles = await fetchZennArticles()
    const posts = articles.map((article) => {
        const { title, published_at, path } = article
        return {
            title,
            pubDate: published_at.slice(0, 10),
            tags: ["zenn"],
            url: `https://zenn.dev${path}`,
        }
    })
    return posts
}
