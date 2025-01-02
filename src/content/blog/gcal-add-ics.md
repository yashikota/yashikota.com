---
title: "Googleカレンダーにics形式のカレンダーをURL経由で追加する方法"
pubDate: 2025-01-02
updDate: 
isUnlisted: true
category: life
tags: ["googleカレンダー"]
---

前提として、icsをサーバーに置いて一般公開していることが必要です。  
icsファイルを `example.com/calendar.ics` に置いている場合は以下のURLになります。  

```txt
https://calendar.google.com/calendar/r?cid=webcal://example.com/calendar.ics
```

これを開くだけで 追加しますか? のダイアログが出て追加できるようになります。  

レアな注意点ですが、webcalプロトコルではクエリパラメーターに対応していない? (Googleカレンダーの使用の可能性もアリ)っぽいので、パラメーターを指定したいときはパスパラメーターとして渡すようにしましょう。  
