---
title: .env.example のようなテンプレファイルから .env を生成するCLIツールを作った
pubDate: 2025-11-15
updDate:
isUnlisted: false
category: tech
tags: ["go", "cli"]
showToc: false
---

タイトル通りなのですが、`.env.example` みたいなテンプレートファイルの `{DB_PASSWORD}` みたいなプレースホルダーを自動で乱数で置換してくれるCLIツールを作りました。探したけど意外となかったので自作しました。  
特にPublicで公開しているリポジトリで、DBのパスワードや暗号化のための乱数などアプリケーションには必要だが、ハードコーディングして置いておきたくないものってあると思うんですよね。で、それを `.env` とかに書いておくわけなんですが、共有できなのでREADMEとかに `.env` を作ってくれと書くわけなんですがまあ読まない人は多いし(自戒)、新たに値が追加された場合に手動で更新しなくちゃならなくてちょっと面倒だなと。てなわけで解決するCLIツールを作りました💪  

https://github.com/yashikota/genenv

インストールは`go install github.com/yashikota/genenv@latest`か[Releasesからバイナリ落として](https://github.com/yashikota/genenv/releases)きてもらうか、aquaにも登録してみたのでaquaやmiseからでも `mise use aqua:yashikota/genenv` とかしてもらえればOKです。  

使い方としてはめっちゃシンプルで、`genenv .env.example` みたいな感じにやると下のようにプレースホルダーの部分が適当な乱数で置換されます。  

```txt title=".env.example"
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=${db_user}
DB_PASSWORD=${db_password}

# API configuration
API_KEY=${api_key}
API_URL=https://api.example.com
```

```txt title=".env"
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
DB_PASSWORD=dGhpcyBpcyBhIHNlY3VyZSByYW5kb20gdmFsdWU

# API configuration
API_KEY=q7w8e9r0t1y2u3i4o5p6a7s8d9f0g1h2
API_URL=https://api.example.com
```

ちなみに一度 `.env` に入った値は `--force` しない限り上書きされないので新たに値が入っても新規差分のみ実行されるので安全です。  
オプションとしては `-o` で出力先の切り替え、`-l` や `-c` で文字種や文字長が指定できるぐらいです。シンプル is ベスト。  
