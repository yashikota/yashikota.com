---
title: AWSのマルチセッションサポートをONにしていると変なサブドメインがついちゃうのでそれを取り除いてコピーするブックマークレット
pubDate: 2026-01-27
updDate:
isUnlisted: false
category: tech
tags: ["aws"]
showToc: false
---

```js
javascript:(()=>{try{const u=new URL(location.href);const p=u.hostname.split('.');if(p.length>=4&&/^\d{12}-[a-z0-9]+$/i.test(p[0])&&p.slice(2).join('.')==="console.aws.amazon.com"){p.shift();u.hostname=p.join('.');}navigator.clipboard&&navigator.clipboard.writeText(u.toString());}catch(e){}})();
```
