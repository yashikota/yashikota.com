---
title: GitHub CLIでリポジトリ名を取得する
pubDate: 2024-12-15
updDate:
isUnlisted: false
category: tech
tags: ["github cli"]
---

GitHubのリポジトリが `yashikota/test` だとすると  

## リポジトリ名のみの場合

```sh
gh repo view -q .name --json name
```

`test` が返ってくる。  

## オーナー名とリポジトリ名の場合

```sh
gh repo view -q ".owner.login + \"/\" + .name" --json name,owner
```

`yashikota/test` が返ってくる。  
