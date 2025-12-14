---
title: ghコマンドで署名に使うSSHキーをアップロードする
pubDate: 2025-12-14
updDate: 
isUnlisted: false
category: tech
tags: ["git"]
showToc: false
---

今まで[Gitコミットへの署名](https://docs.github.com/ja/authentication/managing-commit-signature-verification/signing-commits)はGPGキーでやってたんですが、SSHキーでもできるようになってたので乗り換えてみました。  
基本的に今使っているSSHキーをそのまま使えるのですが、GitHubに **署名用として** 別途登録しないといけないです。  
手作業でやってもいいんですが、せっかくghコマンドがあるのでこれで登録してみました。  

`gh auth login` でSSHキーも発行しているなら以下のコマンドを叩けばOKです。  
もしかすると権限のエラーが出るかもですが、その時は出力されたコマンドを叩いて再認証すればOKです。  

```sh
gh ssh-key add ~/.ssh/id_ed25519.pub --type signing
```

ではでは良き署名ライフを👋  
