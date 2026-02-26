<!-- inject:skills -->

技術力スコア👇  

https://lapras.com/public/kota  

https://findy-code.io/skills-share/SZ80HMrAQQPyo  

https://gitty-code.com/user/yashikota  

### Backend

主にGoやTypeScriptを使っていて、GoだったらCloudRun、TSはCloudflare Workersにデプロイしています。  
CloudRunもCloudflare Workersも良い製品で好きです😍  
ソフトウェアアーキテクチャの重要性やDB設計の必要性を痛感していて、絶賛勉強中です。  
アプリケーションに留まらず幅広くバックエンドを見たいので、インフラやSREの方向にも関わりながら広く経験したいなぁ〜とは思っています。  
それと特にエンターテイメントが好きなので、ゲーム系のバックエンド開発に携わりたいなとも思っています。

最近はCloudflare Workers推しで、無料でグローバルエッジ環境に即時デプロイ、フロントとバックを一緒くたに扱え(Hono最強🔥)、Durable Objects(強整合性のもつ永続化ストレージ)、D1(グローバルにスケールするSQLiteベースのDB)、R2(S3互換のオブジェクトストレージ)などなどエコシステムも良い感じで、アプリをぱぱっと作れるので好きです😍  

他にも長期インターン先で開発している管理アプリケーションではCloudflare Workersにデプロイしていて開発・運用をしています。  
このアプリを作るときに使ったもので、Cloudflare HyperdriveというDBのコネクションプーリングサービスがあるのですが、これとGoogle CloudのDBを繋ぐ時にInternal Errorが出て、中の人に連絡したら[Incident Report](https://www.cloudflarestatus.com/incidents/kk3pq7ny81t0)が出て😂直してもらってみたいなマイナーが故の体験をしたりもしました。  

あとは自宅サーバーでk8s盆栽を始めたり、Observabilityに手を出してみたり、protobufやconnectを試してみたりして色々遊んでいます。  
CI/CDとかも3年ほど、主に個人開発/インターンで使用していて、GitHub Actionsをメインで使用しており、Lint/Format/Test/Deploy/Releaseを回すのはもちろん、スクレイピングとかにも使ってます。ボタンポチでどこからでも実行できるので楽で好きです。  

クラウドは初めて触ったのがGoogle Cloudで、個人で簡単なWebサーバーをGoで書いてCloudRunにデプロイしていました。今は長期インターン先でAWSをメインにクラウドに触れています。  
IaCもGoogle Cloudの場合はTerraform、AWSはSAMとCDKを使っています。  
業務でGoogle CloudからAWSに乗り換えるということをやっていたのですが、CloudRunに匹敵する立ち上がりの速さと、スケーリングと、機能と、事例の多さを持ったプロダクトがAWSにないので、個人的にはGoogle Cloud推しです。  

DBも設計もまだまだ初心者ですが、ソフトウェア開発において核となる部分なのでじっくり学んでます。  
最近はLLMが進歩してきて仕様書からコードに落とし込むところはかなりできていると思うんですが、やっぱり人間社会で営まれる活動とコンピュータの住むデジタルな信号処理の世界を結びつけるのは人じゃないとまだまだ無理だなと感じているので、それも含めてソフトウェアアーキテクト的なPM的な立場になるのが良さげで面白そうかなと思っています。  

### Python

- シラバス検索・閲覧アプリ

https://github.com/yashikota/syllabus/tree/main/scraping

- バーコード生成ライブラリ

https://github.com/yashikota/jancode

- 4bitCPUのアーキテクチャTD4のエミュレーター

https://github.com/yashikota/td4-py

3年ほど主に個人開発で使用。最初は何でもかんでもPythonで書いていたんですが、型とか環境構築とかうーんとなって若干離れ気味になったんですけど、最近もLLMを使ったアプリケーションとかを開発するとなるとPythonが必須なので逃れられないです。でもuvとかruffみたいなツールが出てきてだいぶ不満は無くなってきたので開発元には大感謝🙏  

### TypeScript

- シラバス検索・閲覧アプリ

https://github.com/yashikota/syllabus/tree/main/frontend

- このサイト

https://github.com/yashikota/yashikota.com

- 細々としたWeb API

https://github.com/yashikota/hiragana-word-api

3年ほど主に個人開発/インターンで使用。React/Next.js/Astro/Tailwind/shadcn/uiあたりがさわれます。  
あと最近はちょっとしたWebAPIの開発にはhono + Cloudflare Workersで作るのにハマっています。書きやすく、動かしやすく、維持費もかからないので開発者体験が良いです🔥  

### Go

- バックエンド

https://github.com/yashikota/scene-hunter

https://github.com/yashikota/chronotes

- CLIアプリ

https://github.com/yashikota/genenv

https://github.com/yashikota/noast

1年ほど主に個人開発/インターンで使用。  
クロスプラットフォームにシングルバイナリで実行ファイルをビルドできるところが好きで、ちょっとしたCLIアプリとかは基本Goで書いています。  
それといい塩梅な標準ライブラリで簡単にWebサーバーが作れるのも好きです。  

### Other

WebフロントエンドはReactメインにNext触ったり、Astroでブログ作ったりして遊んでいます。長期インターン先でも管理系アプリを作ったりしていますが、個人的な興味度としてはバックエンドより低いです。  
LLMはある程度力を入れて追いかけていて、最新のモデル、事例をウォッチしていたり、開発、業務にも積極的に取り入れたりしています。また研究でも使っていたりするので最新の手法から実用的な事例まで幅広く捉えています。  
セキュリティも学会やセキュキャン等のイベントに参加したり、資格取ったりはしていて一定の知識を持っています。  
その他にも興味駆動な性格なので雑多に、低レイヤーではOSやコンパイラの輪読会開催したり、マルチメディアのコーデックを調べたり、ゲームの3Dグラフィックスやレンダリングに興味を持ったり、XRで遊んでみたり...幅広く手を動かして楽しんでいます。  

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
  - [ゼロからのOS自作入門](https://book.mynavi.jp/ec/products/detail/id=121220)を輪読する勉強会を主催しました。勉強会で発表した資料を[公開](https://www.docswell.com/user/kota)しています。

- [低レイヤーLT交流会](https://gdscut.connpass.com/event/323841)
  - 登壇しました。発表資料は[PythonでCPUエミュレータを作ってみよう！](https://www.docswell.com/s/kota/5N11JL-td4-py)です。  

- [58ハッカソン 24/09](https://58hackathon.connpass.com/event/324993)
  - ハッカソンにて[Chronotes](https://yashikota.com/works/chronotes)を開発し、優秀賞を獲得しました。  

- [Tech Award in Hack Osaka 2024](https://x.com/techaward_osaka/status/1858163266327036290)
  - ピッチコンテストにて[Chronotes](https://yashikota.com/works/chronotes)を紹介し、ファイナリストに選出されました。  

- [技育展2024](https://talent.supporterz.jp/geekten/2024)
  - ピッチコンテストにて[Chronotes](https://yashikota.com/works/chronotes)を紹介し、第2ステージに進出しました。  

- 勉強会
  - [低レイヤを知りたい人のためのCコンパイラ作成入門](https://www.sigbus.info/compilerbook)と、[Crafting Interpreters](https://craftinginterpreters.com/index.html)を輪読する勉強会を主催しました。勉強会で発表した資料を[公開](https://www.docswell.com/s/kota/ZREWR9-interpreters)しています。

- [58ハッカソン 25/02](https://58hackathon.connpass.com/event/340146/)
  - ハッカソンにて[HappyShot](https://yashikota.com/works/happyshot)を開発し、優秀賞を獲得しました。  

## Internship

- [Flatt Security](https://flatt.tech)
  - 2023/08 (5日間)
  - Webアプリケーションセキュリティ診断

- [ちゅらデータ](https://churadata.okinawa)
  - 2023/09 (2週間)
  - データ分析基盤構築、データモデリング

- [日本経済新聞社](https://www.nikkei.co.jp/nikkeiinfo)
  - 2024/08 (5日間)
  - 記事の読解支援を行うWebアプリケーション開発

- [ピクシブ](https://www.pixiv.co.jp)
  - 2024/09 (10日間)
  - 画像処理サービスの新機能開発

- [Univearth](https://www.univearth.co.jp)
  - 2024/10 ~ (継続中)
  - フルスタックにSaaSの開発や社内アプリケーション、クラウドインフラの管理など幅広く担当

- [コロプラ](https://colopl.co.jp)
  - 2025/08 (2週間)
  - ゲームのサーバーサイド開発

- [サイバーエージェント](https://www.cyberagent.co.jp)
  - 2025/11 (一ヵ月)
  - [ゲームのサーバーサイド開発](https://developers.cyberagent.co.jp/blog/archives/60181)

- [GREE](https://gree.jp)
  - 2025/12 (3週間)
  - ゲームの離脱予測を行う機械学習モデル開発

- [MIXI](https://mixi.co.jp)
  - 2025/1 ~ 2025/2 (二か月)
  - [SREとしてサービスの改善](https://zenn.dev/mitene/articles/56c1669bc75890)

## OSS Contributions

### [louislam/uptime-kuma](https://github.com/louislam/uptime-kuma)

- feat(notification): discord suppress notifications ([#6717](https://github.com/louislam/uptime-kuma/pull/6717))  
Discordへの通知で、Suppress Notificationを選べるように機能追加

### [jdx/mise](https://github.com/jdx/mise)

- feat(registry): update aws-sam backends to include aqua source ([#5461](https://github.com/jdx/mise/pull/5461))  
`aqua:aws-sam-cli` のインストールに対応

### [okaryo/remark-link-card-plus](https://github.com/okaryo/remark-link-card-plus)

- Add `ignoreExtensions` options to exclude link cards ([#48](https://github.com/okaryo/remark-link-card-plus/pull/48))  
特定の拡張子のリンクをリンクカードに変換しないオプションを追加

### [aquaproj/aqua-registry](https://github.com/aquaproj/aqua-registry)

- feat(aws/aws-sam-cli): scaffold aws/aws-sam-cli ([#33349](https://github.com/aquaproj/aqua-registry/pull/33349))  
`aws-sam-cli` の追加

- Add theseus-rs/postgresql-binaries ([#33390](https://github.com/aquaproj/aqua-registry/pull/33390))  
`postgresql-binaries` の追加

- feat: Tyrrrz/FFmpegBin ([#49161](https://github.com/aquaproj/aqua-registry/pull/49161))  
`ffmpeg`の追加

## Certification

- 応用情報技術者
- 情報処理安全確保支援士試験 合格
- 技術士第一次試験 情報工学部門 合格
- TOEIC 510
- 第二種電気工事士
- 乙種第4類危険物取扱者
