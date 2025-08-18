## Skills

```xml
<Skills> ::= <Programming> <Astrophotography> <Cooking>
<Programming> ::= <Python> <Typescript> <Go> <Backend> <Other>
<Backend> ::= <Cloud> <DevOps> <CICD> <DataBase> <SoftwareArchitecture>
<Other> ::= <WebFrontend> <Security> <LLM>
```

バックエンドでは主にGoを使っていて、OpenAPIでのスキーマ開発駆動やCloud Runでサーバーレスしたり、GitHub Actionsを用いたCI/CD、Terraformでのインフラ管理などをやています。  
最近はソフトウェアアーキテクチャの重要性やDB設計の必要性を痛感していて、絶賛勉強中です。  
Webフロントエンドからプログラミングの世界入った人間なので、最近はAIに任せっきりですが、一通りはできます。このサイトもAstroで自作しました。  
LLMはある程度力を入れて追いかけていて、研究や開発などに活用しています。  
その他にも低レイヤーではOSやコンパイラの輪読会開催したり、セキュリティでは学会やイベントに参加したり資格取ったり、マルチメディアのコーデックに興味持ったり、ゲームの3Dグラフィックスやレンダリングに興味を持ったり、XRやったり、Cloudflareとか使い倒したり、本当に興味駆動で幅広く手を動かして楽しんでいます。  

余談なのですが、laprasというサイトでスコア算出できるのですが、上位7%とかみてびっくりしました🤭  

https://lapras.com/public/kota

### Languages

#### Python

3年ほど主に個人開発で使用。これまでに

- 論文翻訳アプリ

https://github.com/yashikota/leadable

- シラバス検索・閲覧アプリ

https://github.com/yashikota/syllabus

- バーコード生成ライブラリ

https://github.com/yashikota/jancode

- 4bitCPUのアーキテクチャTD4のエミュレーター

https://github.com/yashikota/td4-py

などを開発。  

最初は何でもかんでもPythonで書いていたんですが、型とか環境構築とかうーんとなって若干離れ気味になったんですけど、最近もLLMを使ったアプリケーションとかを開発するとなるとPythonが必須なので逃れられないです😁  
でもuvとかruffみたいなツールが出てきてだいぶ不満は無くなってきたので開発元には大感謝です🙏  

#### JavaScript/Typscript

3年ほど主に個人開発/インターンで使用。これまでに

- シラバス検索・閲覧アプリ

https://syllabus.naist.yashikota.com

- このサイト

https://github.com/yashikota/yashikota.com

- 論文翻訳アプリのフロントエンド

https://github.com/yashikota/leadable

などなど色々なアプリケーションで使用。  
React/Next.js/Astro/Tailwind/shadcn/uiあたりがさわれます。  
最近はちょっとしたWebAPIの開発にはhono + Cloudflare Workersで作るのにハマっています。  
書きやすく、動かしやすく、維持費もかからないので開発者体験が良いです🔥

#### Go

1年ほど主に個人開発/インターンで使用。これまでに

- バックエンド

https://github.com/yashikota/chronotes

https://github.com/yashikota/scene-hunter-backend

- 細々としたCLIツール

https://github.com/yashikota/genenv

https://github.com/yashikota/solo-cleaner

などを開発。  

クロスプラットフォームにシングルバイナリで実行ファイルをコンパイルできるところが好きです。  
それといい塩梅な標準ライブラリで簡単にWebサーバーが作れるのが好きです。  

#### Git/GitHub

4年ほど使用しており、最近は人に教えてることも多いです。  
ですが、まだまだ知らない機能とかがあるので勉強中です。  

#### CI/CD

3年ほど使用。  
主に個人開発/インターンで使用。GitHub Actionsをメインで使用しており、さまざまなActionsを使用しています。  
Lint/Format/Test/Deploy/Releaseを回すのはもちろん、スクレイピングとかにも使ってます。ボタンポチでどこからでも実行できるので楽で好きです。  

#### Cloud

1年ほど使用。  
主にインターンで使用。これまでに

- AWS
- Google Cloud
- Terraform
- SAM

を使用。  
個人的にはGoogle Cloud推しです。なんとなくAWSより操作がわかりやすいのとCloud Runが有能すぎるので😂  

## Talks

発表したスライド一覧はここにアップロードしています。  

https://docswell.com/user/kota

## Activities

- [Security MiniCamp Online 2022](https://www.security-camp.or.jp/minicamp/online2022.html)
  - AIのセキュリティからハードウェア、コンテナやウェブセキュリティまで幅広く学びました。  
  - 最後の修了試験では全受講者数36名のうち、5位にランクインし表彰されました。  

- [MWS Cup 2022](https://www.iwsec.org/mws/2022)
  - ハッカソンでは有害アフィリエイトサイトを機械学習で検知し検索結果から排除するシステムを作成しました。  
  - また当日のCTFではDFIR部門で優勝することができ、学部長表彰も受賞することができました。  

- [Bug Shooting Challenge #9](https://mixil.mixi.co.jp/report/3329)
  - ゲームを題材にしたバックエンドのプログラムを元に不具合を生じさせている箇所を特定、修正するコンテストに参加しました。  

- [Git Challenge #13](https://github.com/mixi-git-challenge/publications)
  - Gitのコンフリクトや履歴の復旧などGitの知識と技能を競うコンテストに参加しました。  

- 勉強会
  - [ゼロからのOS自作入門](https://book.mynavi.jp/ec/products/detail/id=121220)を輪読する勉強会を主催しました。  

- [低レイヤーLT交流会](https://gdscut.connpass.com/event/323841)
  - 登壇しました。発表資料は[PythonでCPUエミュレータを作ってみよう！](https://www.docswell.com/s/kota/5N11JL-td4-py)です。  

- [58ハッカソン](https://58hackathon.connpass.com/event/324993)
  - ハッカソンにて[Chronotes](https://yashikota.com/works#chronotes)を開発し、優秀賞を獲得しました。  

- [技育展2024](https://talent.supporterz.jp/geekten/2024)
  - ピッチコンテストにて[Chronotes](https://yashikota.com/works#chronotes)を紹介し、第2ステージまで進出しました。  

- 勉強会
  - [低レイヤを知りたい人のためのCコンパイラ作成入門](https://www.sigbus.info/compilerbook)と、[Crafting Interpreters](https://craftinginterpreters.com/index.html)を輪読する勉強会を主催しました。  

## Internship

- Flatt Security サマーインターンシップ
  - 2023/08 (5日間)
  - セキュリティ診断（Webアプリケーション診断）にチャレンジ
    プログラムの前半では、トレーニング環境を利用して、実際に手を動かして演習を解きながら、脆弱性に関する基礎知識や発見方法などセキュリティ診断に必要な知識を身につけ、後半では前半のトレーニングで学んだことを活かして、Webアプリケーションに対するセキュリティ診断を行った。その後、診断結果を報告書にまとめることで、Webアプリケーションの脆弱性を探し、発見した脆弱性のリスク・再現手順・修正方法を開発者にわかりやすいように説明するフローを行った

- ちゅらデータ サマーインターンシップ
  - 2023/09 (2週間)
  - データ分析基盤構築やデータモデリングを体験。Snowflakeでのデータウェアハウス構築やdbt(Data Build Tool)でのデータパイプラインの構築など

- 日本経済新聞社 短期インターンシップ
  - 2024/08 (5日間)
  - 経済記事の読解支援を行うWebアプリケーションの開発

- ピクシブ エンジニア職インターン
  - 2024/09 (10日間)
  - [ImageFlux](https://imageflux.sakura.ad.jp)のモザイク機能の開発

- Univearth 長期インターンシップ
  - 2024/10 ~
  - フルスタックにSaaSの開発や社内アプリケーション、クラウドインフラの管理など幅広く担当

- コロプラ 就業型インターンシップ
  - 2025/08 (2週間)
  - 白猫プロジェクトのサーバーサイド開発

## OSS Contributions

### [aquaproj/aqua-registry](https://github.com/aquaproj/aqua-registry)

- feat(aws/aws-sam-cli): scaffold aws/aws-sam-cli ([#33349](https://github.com/aquaproj/aqua-registry/pull/33349))
`aws-sam-cli`の`aqua`でのインストールに対応

- Add theseus-rs/postgresql-binaries ([#33390](https://github.com/aquaproj/aqua-registry/pull/33390))
`postgresql-binaries`の`aqua`でのインストールに対応

### [okaryo/remark-link-card-plus](https://github.com/okaryo/remark-link-card-plus)

- Add `ignoreExtensions` options to exclude link cards ([#48](https://github.com/okaryo/remark-link-card-plus/pull/48))
特定の拡張子のリンクをリンクカードに変換しないオプションを追加

### [jdx/mise](https://github.com/jdx/mise)

- feat(registry): update aws-sam backends to include aqua source ([#5461](https://github.com/jdx/mise/pull/5461))
`aqua:aws-sam-cli` のインストールに対応

## Certification

- ITパスポート
- 情報セキュリティマネジメント
- 応用情報技術者
- 情報処理安全確保支援士試験 合格
- 技術士第一次試験 情報工学部門 合格
- TOEIC 510
- 第二種電気工事士
- 乙種第4類危険物取扱者

## PGP Public Key

```txt
-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEZNGsjhYJKwYBBAHaRw8BAQdAJZaBFcvtQYMzMRwUmLwWXJZBvLqwPgF4P5q0
haD+2qq0MmtvdGEgPDUyNDAzNjg4K3lhc2hpa290YUB1c2Vycy5ub3JlcGx5Lmdp
dGh1Yi5jb20+iJAEExYIADgWIQTULScBToPRsTfnRC5/HZb2+DPwLwUCZNGsjgIb
AwULCQgHAgYVCgkICwIEFgIDAQIeAQIXgAAKCRB/HZb2+DPwL2TmAQDadsJv4tub
wPbV8cAQwhokpmBscRUj4dfafzoqudhLsgD/a3B+0CH5ag5CIRT6p6+J9CRtI9D4
jVRxL3LyVNuzrw0=
=b/8T
-----END PGP PUBLIC KEY BLOCK-----
```
