---
title: "ブックマーク済みのポストをハイライト表示するTampermonkeyのスクリプト"
pubDate: 2025-12-15
updDate: 
isUnlisted: false
category: tech
tags: ["x"]
showToc: false
---

Xのポストから情報収集できることも多くて適当にTLを眺めているんですが、どこまで見たかわからなくなるので適当にブックマークで目印つけていました。  
ですが、ぱっと見で気づきにくいのでブックマーク済みのポストをハイライト表示するTampermonkeyのスクリプトを作成してみました。  

```javascript
// ==UserScript==
// @name         X Bookmark Highlight
// @namespace    https://yashikota.com/
// @version      1.0.0
// @description  X Bookmark Highlight
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    .tm-bookmark-highlight {
      border: 2px solid red !important;
      padding: 4px !important;
      margin-bottom: 4px !important;
    }
  `;
  document.head.appendChild(style);

  const highlightExisting = () => {
    document.querySelectorAll('article').forEach(article => {
      if (article.classList.contains('tm-bookmark-highlight')) return;

      const btn = article.querySelector('button[data-testid="removeBookmark"]');
      if (btn) {
        article.classList.add('tm-bookmark-highlight');
      }
    });
  };

  highlightExisting();

  const observer = new MutationObserver(highlightExisting);
  observer.observe(document.body, { childList: true, subtree: true });
})();
```
