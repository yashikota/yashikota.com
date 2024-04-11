---
title: GoとDockerとAirの開発環境で生じる『error obtaining VCS status exit status 128』エラーの対処法
pubDate: 2024-03-29
updDate:
isUnlisted: false
category: tech
tags: ["Go"]
---

## 症状

Gitを有効にした状態でDockerを用いてGoとAirで開発しているとdocker compose up時に以下のエラーが発生しました。  

```txt
web-1  | error obtaining VCS status: exit status 128
web-1  |        Use -buildvcs=false to disable VCS stamping.
web-1  | failed to build, error: exit status 1
```

## 直し方

ビルドオプションに `-buildvcs=false` をつけるだけです。  

```toml title=".air.toml" del={1} ins={2}
cmd = "go build -o ./tmp/main ."
cmd = "go build -buildvcs=false -o ./tmp/main ./src"
```
