# マークダウンレンダラーの変更計画

現在の状況と参考リポジトリの情報を元に、詳細な移行計画を立てていきます。

## 現状分析

現在のブログシステムは以下のような構成になっています：

1. マークダウンファイルは `src/content/blog/` ディレクトリに保存
2. Astroのコンテンツコレクション機能を使用してマークダウンファイルを管理
3. マークダウンのレンダリングには `zenn-markdown-html` を使用
4. `zenn-embed-elements` と `zenn-content-css` を使用してZennスタイルのエンベッドとスタイリングを適用

## 新システムの要件

1. マークダウンファイルの保存場所は変更しない
2. リンクカードとコールアウトの実装を重視
3. コードハイライト、YouTube埋め込み、Twitter埋め込みなどの拡張機能も実装
4. OGP情報を取得してリンクプレビューを表示
5. Zennのスタイルを完全に置き換える
6. コールアウトはGitHubの記法と同じようにする
7. パッケージマネージャーとしてbunを使用する

## 移行計画

### 1. 必要なパッケージのインストール

```bash
# パッケージマネージャーとしてbunを使用
# remark/rehypeプラグイン
bun add remark-directive remark-gfm rehype-slug rehype-autolink-headings

# コールアウト（GitHubスタイル）
bun add remark-github

# コードハイライト
bun add @expressive-code/plugin-collapsible-sections @expressive-code/plugin-line-numbers @expressive-code/plugin-shiki @expressive-code/plugin-text-markers astro-expressive-code

# リンクカード
bun add remark-link-card

# 埋め込み
bun add remark-webembed astro-lazy-youtube-embed

# OGP
bun add isomorphic-unfetch html-parser-lite
```

### 2. Astroの設定ファイル修正

`astro.config.mjs` を修正して、マークダウン処理のカスタマイズを行います。

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import remarkDirective from 'remark-directive';
import remarkGithub from 'remark-github';
import remarkLinkCard from 'remark-link-card';
import remarkGfm from 'remark-gfm';
import remarkWebembed from 'remark-webembed';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  site: "https://yashikota.com",
  integrations: [
    react(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    sitemap(),
    expressiveCode({
      themes: ['github-dark', 'github-light'],
      styleOverrides: {
        borderRadius: '0.5rem',
        frames: {
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        },
      },
    }),
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  markdown: {
    remarkPlugins: [
      remarkDirective,
      remarkGithub,
      remarkLinkCard,
      remarkGfm,
      [remarkWebembed, {
        services: {
          youtube: true,
          twitter: true,
        }
      }],
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
    syntaxHighlight: false, // ExpressiveCodeを使用するため無効化
  },
  redirects: {
    // 既存のリダイレクト設定
  },
});
```

### 3. コンテンツコレクションの設定修正

`src/content/config.ts` は変更不要です。現在の設定を維持します。

### 4. ブログ記事表示コンポーネントの修正

`src/pages/blog/[slug].astro` を修正して、新しいレンダリングシステムを使用するようにします。

```astro
---
import Base from "@/layouts/base.astro";
import { UpdateIcon } from "@radix-ui/react-icons";
import { getBlogPosts } from "@/lib/blogPosts";

// LazyYouTubeの読み込み
import { LazyYouTube } from "astro-lazy-youtube-embed";

// カスタムスタイルの読み込み
import "@/styles/markdown.css";

export async function getStaticPaths() {
  const blogs = await getBlogPosts();
  return blogs.map((blog) => {
    return {
      params: {
        slug: blog.slug,
      },
      props: {
        title: blog.title,
        tags: blog.tags,
        pubDate: blog.pubDate,
        updDate: blog.updDate,
        body: blog.body,
      },
    };
  });
}

const { title, tags, pubDate, updDate, body } = Astro.props;
// マークダウンの処理はAstroが自動的に行うため、ここでの変換は不要になります
---

<Base pageTitle={title}>
    <div class="mx-auto text-center">
        <div class="flex items-center justify-center text-lg text-muted-foreground">
            {pubDate}
            {updDate && <UpdateIcon className="ml-2 mr-0.5 h-3" />}
            {updDate}
        </div>
        <h1 class="scroll-m-20 text-2xl font-extrabold lg:text-4xl">
            {title}
        </h1>
        {
            tags.map((tag, index) => (
                <a href={`https://yashikota.com/blog/tags/${tag.toLocaleLowerCase()}/`}>
                <span
                    data-key={index}
                    class="mr-2 text-sky-400 hover:text-sky-700 text-lg"
                >
                    #{tag}
                </span>
                </a>
            ))
        }
    </div>

    <div class="flex-1 border-b border-gray-500 mb-5"></div>

    <div class="markdown-content">
        <!-- コンテンツはAstroによって自動的にレンダリングされます -->
        <slot />
    </div>
</Base>
```

### 5. カスタムマークダウンスタイルの作成

`src/styles/markdown.css` を作成して、Zennのスタイルを置き換えるカスタムスタイルを実装します。

```css
/* マークダウンコンテンツのベーススタイル */
.markdown-content {
  color: var(--color-text);
  line-height: 1.8;
  font-size: 1rem;
  word-break: break-word;
  overflow-wrap: break-word;
}

/* 見出し */
.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  font-weight: 700;
  line-height: 1.5;
  margin-top: 2.5em;
  margin-bottom: 1em;
}

.markdown-content h1 {
  font-size: 2em;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5em;
}

.markdown-content h2 {
  font-size: 1.5em;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5em;
}

.markdown-content h3 {
  font-size: 1.25em;
}

.markdown-content h4 {
  font-size: 1em;
}

/* リンク */
.markdown-content a {
  color: var(--color-primary);
  text-decoration: none;
}

.markdown-content a:hover {
  text-decoration: underline;
}

/* リスト */
.markdown-content ul,
.markdown-content ol {
  margin: 1.5em 0;
  padding-left: 2em;
}

.markdown-content ul {
  list-style-type: disc;
}

.markdown-content ol {
  list-style-type: decimal;
}

.markdown-content li {
  margin: 0.5em 0;
}

/* 引用 */
.markdown-content blockquote {
  border-left: 4px solid var(--color-border);
  padding: 0.5em 0 0.5em 1em;
  margin: 1.5em 0;
  color: var(--color-text-muted);
}

/* コード */
.markdown-content code {
  font-family: var(--font-mono);
  background-color: var(--color-code-bg);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

.markdown-content pre {
  margin: 1.5em 0;
  border-radius: 6px;
  overflow-x: auto;
}

.markdown-content pre code {
  padding: 0;
  background-color: transparent;
}

/* テーブル */
.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
}

.markdown-content th,
.markdown-content td {
  border: 1px solid var(--color-border);
  padding: 0.5em;
}

.markdown-content th {
  background-color: var(--color-bg-secondary);
  font-weight: 700;
}

/* 水平線 */
.markdown-content hr {
  border: 0;
  border-top: 1px solid var(--color-border);
  margin: 2em 0;
}

/* 画像 */
.markdown-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1.5em auto;
  border-radius: 6px;
}

/* コールアウト（GitHub風） */
.markdown-content .note,
.markdown-content .tip,
.markdown-content .warning,
.markdown-content .danger {
  border-left: 4px solid;
  padding: 1em;
  margin: 1.5em 0;
  border-radius: 4px;
}

.markdown-content .note {
  background-color: rgba(0, 120, 215, 0.1);
  border-left-color: #0078d7;
}

.markdown-content .tip {
  background-color: rgba(46, 204, 113, 0.1);
  border-left-color: #2ecc71;
}

.markdown-content .warning {
  background-color: rgba(241, 196, 15, 0.1);
  border-left-color: #f1c40f;
}

.markdown-content .danger {
  background-color: rgba(231, 76, 60, 0.1);
  border-left-color: #e74c3c;
}

/* リンクカード */
.markdown-content .link-card {
  display: block;
  text-decoration: none;
  color: inherit;
  margin: 1.5em 0;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.markdown-content .link-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
```

### 6. OGP情報取得のためのAPIエンドポイント作成

`src/pages/api/ogp.js` を作成して、OGP情報を取得するAPIエンドポイントを実装します。Cloudflare Pagesでも動作するように、`isomorphic-unfetch`と`html-parser-lite`を使用します。

```javascript
import fetch from 'isomorphic-unfetch';
import { parse } from 'html-parser-lite';

export async function get({ request }) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  
  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const response = await fetch(targetUrl);
    const html = await response.text();
    const root = parse(html);
    
    // OGP情報の取得
    const ogpData = {
      title: getMetaContent(root, 'og:title') || 
             getTagContent(root, 'title') || '',
      description: getMetaContent(root, 'og:description') || 
                  getMetaContent(root, 'description', 'name') || '',
      image: getMetaContent(root, 'og:image') || '',
      siteName: getMetaContent(root, 'og:site_name') || '',
      url: targetUrl
    };
    
    return new Response(JSON.stringify(ogpData), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400' // 24時間キャッシュ
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// メタタグからコンテンツを取得するヘルパー関数
function getMetaContent(root, property, propName = 'property') {
  const metas = root.querySelectorAll('meta');
  for (const meta of metas) {
    if (meta.getAttribute(propName) === property) {
      return meta.getAttribute('content');
    }
  }
  return null;
}

// タグのコンテンツを取得するヘルパー関数
function getTagContent(root, tagName) {
  const tag = root.querySelector(tagName);
  return tag ? tag.textContent : null;
}
```

### 7. カスタムリンクカードコンポーネントの作成

`src/components/LinkCard.astro` を作成して、リンクカードのカスタムコンポーネントを実装します。

```astro
---
interface Props {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

const { url, title, description, image, siteName } = Astro.props;

// OGP情報がない場合はAPIから取得
let ogpData = { title, description, image, siteName, url };
if (!title || !description || !image) {
  try {
    const apiUrl = new URL('/api/ogp', Astro.url);
    apiUrl.searchParams.set('url', url);
    const response = await fetch(apiUrl);
    const data = await response.json();
    ogpData = { ...ogpData, ...data };
  } catch (error) {
    console.error('Failed to fetch OGP data:', error);
  }
}
---

<a href={url} target="_blank" rel="noopener noreferrer" class="link-card">
  <div class="link-card-container">
    <div class="link-card-content">
      <div class="link-card-title">{ogpData.title || url}</div>
      {ogpData.description && <div class="link-card-description">{ogpData.description}</div>}
      <div class="link-card-site">{ogpData.siteName || new URL(url).hostname}</div>
    </div>
    {ogpData.image && (
      <div class="link-card-image">
        <img src={ogpData.image} alt={ogpData.title || url} loading="lazy" />
      </div>
    )}
  </div>
</a>
```

### 8. マークダウンの使用方法ドキュメントの作成

`docs/markdown-guide.md` を作成して、新しいマークダウン機能の使用方法を説明します。

```markdown
# マークダウンガイド

このブログでは、以下のマークダウン拡張機能が使用できます。

## コールアウト（GitHub風）

```markdown
> [!NOTE]
> これはノートです

> [!TIP]
> これはヒントです

> [!WARNING]
> これは警告です

> [!IMPORTANT]
> これは重要な情報です
```

## リンクカード

通常のリンクは自動的にリンクカードとして表示されます。

```markdown
https://example.com
```

## コードブロック

````markdown
```js
// コードブロックはシンタックスハイライトされます
function hello() {
  console.log("Hello, world!");
}
```
````

## YouTube埋め込み

YouTubeのURLを貼り付けるだけで埋め込みプレーヤーが表示されます。

```markdown
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

## Twitter埋め込み

TwitterのURLを貼り付けるだけで埋め込みツイートが表示されます。

```markdown
https://twitter.com/user/status/123456789
```
```

## 移行手順

1. 必要なパッケージをbunを使用してインストールする
2. astro.config.mjsを修正する
3. カスタムマークダウンスタイルを作成する
4. ブログ記事表示コンポーネントを修正する
5. OGP情報取得のためのAPIエンドポイントを作成する
6. カスタムリンクカードコンポーネントを作成する
7. マークダウンの使用方法ドキュメントを作成する
8. 既存の記事が新しいレンダリングシステムで正しく表示されるかテストする
9. 問題があれば修正する

## マイグレーション図

```mermaid
flowchart TD
    A[現在のシステム] --> B[パッケージインストール]
    B --> C[astro.config.mjs修正]
    C --> D[カスタムマークダウンスタイル作成]
    D --> E[ブログ記事表示コンポーネント修正]
    E --> F[OGP APIエンドポイント作成]
    F --> G[リンクカードコンポーネント作成]
    G --> H[ドキュメント作成]
    H --> I[テスト]
    I --> J{問題あり?}
    J -- Yes --> K[修正]
    K --> I
    J -- No --> L[完了]
