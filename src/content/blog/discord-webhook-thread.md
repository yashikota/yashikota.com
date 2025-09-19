---
title: DiscordのWebhookでスレッドに投稿したい場合の方法と注意点
pubDate: 2024-12-03
updDate:
isUnlisted: false
category: tech
tags: ["Discord"]
showToc: false
---

DiscordにはWebhookでメッセージを送信できる機能がありますが、現時点でのUIではスレッドが選択できません。  
ですがAPI的にはできるので、URLをちょこっと変えればスレッドにメッセージを飛ばせるようになります。  

https://scrapbox.io/discordwiki/%E3%82%A6%E3%82%A7%E3%83%96%E3%83%95%E3%83%83%E3%82%AF%E3%81%AE%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%82%92%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89%E3%81%AB%E9%80%81%E4%BF%A1%E3%81%99%E3%82%8B

ただし、1つ注意点があります。  

```txt
/server
├─ channel-1
│  └─ thread-1
└─ channel-2
   └─ thread-2
```

このような構成でWebhookで指定しているチャンネルが `channel-1` だとすると `thread-2` にはURLで指定しようとも投稿できません。  
指定するチャンネルを `channel-2` に変更する必要があります。  
