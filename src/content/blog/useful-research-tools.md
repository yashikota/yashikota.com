---
title: 便利かもしれない研究に役立つツールたち
pubDate: 2026-05-11
updDate: 
isUnlisted: false
category: life
tags: ["研究"]
showToc: false
---

なんやかんや1年ぐらい研究っぽいことをしていたのでその時に便利だったツールをご紹介～  
一応全部無料で使える想定です。  
ほかにも便利な奴があれば教えてくださいmm

## alphaxiv

正直これのためだけにこの記事を書いているぐらい便利でヘビーユーザーです。  
arXivという計算機科学とかの分野の査読前の論文が投稿されるプラットフォームがあって、ここに投稿された論文を日本語翻訳してくれたり、論文に対してAIチャットで質問できたり、論文に対していいねを押していくと自分好みに最適化されたオススメの論文を教えてくれるフィードがあったりしてめちゃくちゃ便利で、いたせりつくせりです。  

使い方も `https://arxiv.org` を `https://alphaxiv.org` とURL変更するだけでおkです。  

https://www.alphaxiv.org

ちなみにURL変更して～てのがめんどくさい場合は、以下のコードをブックマークレットとして保存しておけばクリック一つで遷移できるようになるのでオススメです。  
ブックマークレットとは何ぞやっていうのはググってください。  

```js
javascript:(function() {  var oldUrl = window.location.href;  var newUrl = oldUrl.replace(/arxiv/g, 'alphaxiv');  window.location.href = newUrl;})();
```

## Semantic Scholar

便利サイトその2  
論文を読んでいるとその論文が引用したやつは論文自身に書いているけど、その論文が引用された(被引用)ってのはわからんのです。  
そこで使えるのがコレ。被引用論文一覧が載ってます。  
しかも引用数やどれだけ似かよった論文かみたいな指標も出してくれるので近しい最新研究を辿ることができます。  

https://www.semanticscholar.org

## Notebook LM

これまた便利で、ユーザーがアップロードした資料に基づいてAIに質問できたりします。  
特にポッドキャスト生成が個人的に超使ってて、毎日車で来るときに流し聞きしてます。  
論文だったり、ニュースだったり、記事だったり...時間かけて読むほどではないけど耳に入れておいたほうがいいな～みたいなやつは全部ポッドキャスト化しておいてスキマ時間に聞き流しておくと良き  

https://notebooklm.google.com

## DeepWiki

こっちは論文の実装がGitHubにあるならそのコードベースに対して質問できるツールです。  
git clone して cd して claude なり codex で聞いてもいいんですがめんどいんで、こっちもURL変更するだけで使えてあと無料で結構使えるので基本こっちでいいかなーと。  

http://deepwiki.com

ブックマークレットはこちら  

```js
javascript:(function() {  var oldUrl = window.location.href;  var newUrl = oldUrl.replace(/github/g, 'deepwiki');  window.location.href = newUrl;})();
```

## Notion

まあ有名なので知ってる人も多いと思いますが、ヴィジュアル系なノートアプリです。  
学校のメールアドレスで認証する学割プランなら無料で有料機能使えるのでわりかし便利です。  

特に便利なのがAIミーティングノートで、自分の番にこれをONにして録音しておくだけで終了後、いい感じの議事録を生成してくれます。  

あとは普通に論文のまとめとか進捗管理とか多用途に使えます。  

https://www.notion.com

## チャットAI系

ChatGPTやらClaudeやらGeminiやら系  
研究ネタの壁打ちにも、DeepResearchで先行研究の調査とかまあ幅広く使えます。  
たぶん使ってない人なんていないと思うので割愛  

## 研究発表でのよくある質問集

ツールとかではないけど、調査するときにも意識しておくと良  

https://kanamori.cs.tsukuba.ac.jp/docs/presentation_faqs.html

---

それでは良き研究ライフを！  
