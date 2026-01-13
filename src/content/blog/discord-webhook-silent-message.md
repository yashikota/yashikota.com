---
title: DiscordのWebhookでSilentMessageを送信する方法
pubDate: 2024-12-09
updDate:
isUnlisted: false
category: tech
tags: ["discord"]
showToc: false
---

flagsというフィールドがあるのでそこに `SUPPRESS_NOTIFICATIONS` のbitである4096を与えます。  

https://discord.com/developers/docs/resources/message#message-object-message-flags

curlで実行する場合はこんな感じになります。  

```sh
curl -X POST -H "Content-Type: application/json" -d '{
    "content": "Silent!",
    "flags": 4096
  }' "https://discord.com/api/webhooks/..."
```
