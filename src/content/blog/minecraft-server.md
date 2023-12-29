---
title: Forge対応Java版Minecraftサーバーの建て方
pubDate: 2023-02-07
updDate: 
tags: ["ゲーム"]
---

Forge対応のJava版Minecraftサーバーを建てたので備忘録がてらまとめます。  

バージョンは以下の通りです。  
|||
|-|-|
|OS|Ubuntu20.04.5 LTS|
|Minecraft|1.16.5|
|Forge|1.16.5-36.2.34|
|Java|1.8.0_352|

## Javaのインストール

まずはJavaをダウンロードします。  

```sh
sudo apt install openjdk-8-jdk
```

でインストールできます。  
インストール後は

```sh
java -version
```

でインストールしたJavaのバージョンが確認できます。  

## Forgeのインストール

[Minecraft Forgeの公式サイト](https://files.minecraftforge.net/net/minecraftforge/forge/index_1.16.5.html)
からインストーラーをダウンロードします。  
執筆時点でRecommendedとなっている1.16.5-36.2.34をダウンロードします。  
以下のコマンドでインストールを行います。  
`--installServer`をつけ忘れないように。  

```sh
java -jar forge-1.16.5-36.2.34-installer.jar --installServer
```

## サーバーの起動

Forgeのインストール完了後forge-1.16.5-36.2.34.jarとminecraft_server.1.16.5.jarの2つのファイルが生成されていますが、forgeのほうがmod用、minecraftがバニラ用です。  
ただforgeでサーバーを建てる際もminecraftのファイルは必要なので消さないようにしましょう。  
以下のコマンドでサーバーを起動します。  

```sh
java -Xmx10G -Xms10G -jar forge-1.16.5-36.2.34.jar --nogui
```

-Xmxと-Xmsには適切なメモリ容量を割り当てましょう。

## 利用規約の同意

初回起動すると`eula.txt`というファイルが生成されると思うのでエディターで開いて`eula=false`となっているのを`true`に変更しましょう。  
その後、再度サーバーを起動します。  

## ポートの開放

Java版Minecraftで用いるポートは25565なので開放します。  

```sh
iptables -A INPUT -p tcp --dport 25565 -j ACCEPT
iptables -A INPUT -p tcp --sport 25565 -j ACCEPT
```

## サーバーが正常か確認

これまでの手順でワールドに入れるようになったので1度ワールドに入れるか確認したほうが無難です。  
MODを入れてからサーバーに異常が発生するとサーバーの問題かMODの問題か切り分けが難しくなるので。  
あと自分だけの問題かもしれないですが、MODを入れてからサーバーを起動してもワールドの生成が一向に進まなかったのでローカルでワールドを生成してからサーバーに転送しました。  

## MODの導入

MODをダウンロードしてmodsディレクトリに格納しましょう。  

## サーバーを再起動

MOD構成が変わるとサーバーを再起動しないとMODが反映されません。  
また再起動の際にconfigやworldディレクトリが残っているとエラーになる可能性があるので念のため消しておきましょう。  

## サーバーをバックグラウンドで動かす

sshした端末で単にコマンドを実行するだけだとsshのセッションが切れるとプロセスも終了してしまいます。  
サーバーも閉じてしまうので不便極まりないです。  
なのでバックグラウンドで動作させましょう。  

```sh
nohup java -Xmx10G -Xms10G -jar forge-1.16.5-36.2.34.jar --nogui &
```

これでコマンドがバックグラウンドで動作するようになります。  
バックグラウンドで動作するようになると終了操作がCtrl + Cで出来なくなるので  

```sh
ps -aux | grep java
```

でサーバーを起動しているプロセスを特定しkillコマンドでプロセスを終了させましょう。  
またこの起動方法だとログがnohup.outというファイルに出力されるようになります。  

余談ですが、このログファイルを利用してサーバーに入退出した人を検知して通知するDiscordのbotを作成したのでよろしければ
[こちらの記事](https://yashikota.com/blog/minecraft-bot)
も見ていってください。  
それでは良いクラフターライフを。  
