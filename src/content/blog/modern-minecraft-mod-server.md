---
title: モダン(NeoForge, Docker, packwiz)な技術スタックでMinecraftサーバーを建てる
pubDate: 2025-09-12
updDate: 
isUnlisted: false
category: tech
tags: ["ゲーム"]
showToc: false
---

昔は[こんな感じ](https://yashikota.com/blog/minecraft-server)に手打ちでコマンド叩いてサーバーを建てていたわけなんですが、久しぶりにサーバー立てたくなってちゃんと調べたらいろいろ便利になっていたので共有します。  

1. `docker-minecraft-server`

名前の通りなんですが、Dockerでマイクラサーバー動かせるやつです。  
ほんとに `compose.yaml` 書いておくだけで一瞬でデプロイできます。  
しかもNeoForgeも後述するpackwizでのMod自動DLも、RCONの制御も全部できます！最強かよ  
もちろんNeoForge以外のFabricとかプラグインサーバーにもできるのでこれ1個で済みます。いい時代  
詳しい話は [公式ドキュメント](https://docker-minecraft-server.readthedocs.io/en/latest/) に書いてるのでそっちを見てください。  
ちなみに姉妹ツールで `docker-mc-backup` ってやつもあってバックアップも勝手にやってくれます。いたせりつくせり  

2. `packwiz`

どっちかというとこっちを紹介したい気持ちが強いんですが、これやばいです、マイクラMod界隈に革命起きてました。  
なにかというとマイクラのModを管理してくれるCLIツールです。  
いままでModってCurseForgeなりModrinthなりから手動でjarをDLしてきてModsフォルダに移して... みたいな作業を無限回繰り返して環境構築していたと思うんですけど、これあればかなり楽になります。  
いろいろ言うより使ってみたほうがわかりやすいと思うので使い方を解説します。  

まず、CLIをインストールします。
[直接バイナリをDLする](https://nightly.link/packwiz/packwiz/workflows/go/main)か、Goが入っているなら`go install github.com/packwiz/packwiz@latest` で入ります。  
バイナリを落としてきた場合はPathに登録してください。  

あとは任意のフォルダーにいってターミナルを開いて

`packwiz init` すると対話でマイクラのバージョンだったり、Modローダーの名前やバージョンだったりを効いてくるので望むものを書きます
あとは `packwiz modrinth install sodium-extra` こんな感じでModrinthかCurseForgeに公開されているMod名をしていしてインストールします。  
ここですごいポイント1つ目！ sodium-extra は前提Modとして sodium が必要なんですが、packwizはそれも検知してくれてsodiumいる？って聞いてくれます！基本は必要なことが多いので y で自動追加してもらうとOKです。
ここまでだったらModrinthの配布パックでいいじゃんってなると思うんですが、packwizのいいところはCurseForgeのやつも同じように扱えるということです！すごいポイント2！  
`packwiz curseforge install the-twilight-forest` 同じようにインストールできます！
黄昏の森は人気Modなんですが、残念ながらModrinthで配布されていないので必然的に2つの配布サイトを使うことになります。これ以外にもちょこちょこ対応していないModがあるのでその制約を気にせず使えるようになるのはModrinth専用のものじゃないメリットですね。

これで、フォルダーの中に `pack.toml` `index.toml` `mods/` の3つができたと思います。  
ただしこれらはMod本体ではなくあくまでModの情報を持ったテキストファイルの集まりです。  
つまり軽いし、全世界に公開しても問題なし！すごいポイント3！  

つまり packwiz はModをいちいち手動でDLする必要なく、依存関係も自動で検知してくれて、ModrinthもCurseForgeも透過的に扱えて、配布も簡単で、さらにModの一括バージョンアップだったりもできちゃうすぐれものです！  
ちなみにここまでで `.jar` がDLされてないやんって思った方もいると思うんですが、それはあとでやるのでお楽しみに。  

てなわけで今まで紹介してきた `docker-minecraft-server` + `docker-mc-backup` + `packwiz` と自作Discord Bot用ソフトを組み合わせてGitHubに公開してみました。  

https://github.com/yashikota/minecareft

これも昔はMods一覧をZipで固めてGoogle DriveなりにうpしてDLしてもらって... てな感じだったんですが、これだけで配布もできるって最強 & 楽 & 安全 でいいですねほんと。  

あとはテキストオンリーで恐縮なんですけど、配布までの道のりを書いておきます。  
めんどくさそうに思えるけど、以前の手順より圧倒的に楽なので1度覚えてしまえればらくしょーです。  

1. GitHubとかにpackwizで生成したファイル一式をコミットしてプッシュする(tomlファイルだけpushする感じ)
2. (ここは任意ですが、以下の理由によりやることを推奨) GitHub Pagesの設定をする
    静的なファイル情報とるだけなんで、 `raw.githubusercontent.com` にアクセスすれば直接取得もできるんですが、[レートリミットが厳しくなった](https://github.blog/changelog/2025-05-08-updated-rate-limits-for-unauthenticated-requests/)ということもあり、念のためPagesを使ったほうがいいと思います。  
    Pagesのデプロイ方法は

    1. Settings -> Pages -> Build and deploymentのSourceをGitHub Actionsにする
    2. Actions -> New Workflow -> テンプレート一覧の下のほうのStatic HTMLのConfigureを選択
    3. 特に変更せずにCommit changesを押してCommitすればOK

    これでmainブランチに変更があれば自動でGitHub Pagesにもデプロイされます。  
    rootディレクトリにpackwizファイルおいてるならデプロイURLは `https://{ACCOUNT_NAME}.github.io/{REPO_NAME}/packwiz.toml` になります

3. `Prism Launcher` をインストールする

    https://prismlauncher.org/

    Modrinth Appとかのほうがモダンなんで好きなんですが、頑張っても動作できなかったんでこれでやります。  

4. `packwiz-installer-bootstrap.jar` をダウンロードする
    https://github.com/packwiz/packwiz-installer-bootstrap/releases/latest

    これの `packwiz-installer-bootstrap.jar` てやつをDLすればOKです。  

5. Prism Launcherでプロファイルを作成
    1. マイクラのバージョンやModローダーのバージョンは適当に選択してください。  
    2. OKを押したら一覧に追加されるので、右クリックで編集を押してください。  
    3. Mod -> フォルダーを開く からフォルダを開くと `minecraft/mods` の階層のやつが開くので、1つ上の階層にいってそこにさっきDLした `packwiz-installer-bootstrap.jar` を配置します。
    4. 設定 -> カスタムコマンド で、起動前コマンドに

        ```txt
        $INST_JAVA -jar $INST_MC_DIR\packwiz-installer-bootstrap.jar https://{ACCOUNT_NAME}.github.io/{REPO_NAME}/packwiz.toml
        ```

        みたいなかんじで指定してください。URLはさっきのPagesのやつか任意のファイルが公開できるサーバーにアップロードしたやつのURLをしていすればOKです。なのでマイクラサーバーに直においてそれを指定してもnginxとかの設定がいるとは思いますが、いいっちゃいいです。
    5. サーバー -> 追加 からあらかじめサーバー情報も登録できるので登録しておくと配布が楽です。あと 設定 -> Javaでメモリ割り当ての変更もできるので、`4096MiB` とか `8096Mib`にしたほうがいいです。標準状態だとModもりもりでやるとガックガクになるので
    6. この状態でいったん 閉じる を押してもう一回プロファイルを右クリック -> エクスポート -> Prism Launcher(zip) をすることで軽量なzipファイルができるのでこれを配布すればOKです。Modはpackwizが勝手にDLしてくれます。これが最高！軽量なのでDiscordの容量制限にも引っかからずに共有できます！！！  

あとは起動すればModのDLが自動で始まって問題がなければ遊べるようになります！よきクラフターライフを！  
