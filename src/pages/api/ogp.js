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
