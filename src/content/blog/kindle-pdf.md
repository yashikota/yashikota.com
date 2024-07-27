---
title: "adbを使ってKindle本をPDFに変換する"
pubDate: 2024-07-27
updDate: 
isUnlisted: false
category: tech
tags: ["kindle"]
---

## はじめに

電子書籍はよくKindleで購入しているんですが、電子書籍は本の所有権を買うのではなく利用権を購入するものなので、なんらかの理由で購入した電子書籍にアクセスできなくなると資産がパーになってしまいます。  

https://wired.jp/2012/10/25/amazons-remote-wipe-of-customers-kindle-highlights-perils-of-drm/

そこそこ費やしてきたので全ロスは避けたいなぁという思いもありPDFにして保存することにしました。  
PDFの変換方法をぱっと調べてみたところ、azwをcalibreで変換する方法が一般的だそうですが、やってみたところ変換できなかったり1/4ぐらいのサイズで出力されたりでうまくいきませんでした。  
そこでAndroid端末とadbを利用して、画面に表示されたものをスクショして保存するようにしたところ上手く行ったので共有します。  
ただし、**利用は自己責任**でお願いします。  

## 事前準備

まず書籍を表示する用のAndroidとそれを操作するPCが必要になります。  
Androidのバージョンはおそらく5以上で、PCはWindowsで確認しました。  
PCはadbさえ動けばいいのでmacでもLinuxでもいけるはずです。  
また、AndroidはUSB Debuggingの項目をONにしておいてください。  

## 実行

このリポジトリをクローンしてもいいですし、`script.ps1`さえあれば動くのでコピペしても良いです。  

https://github.com/yashikota/kindle-pdf

あとはUSBでPCとつなぎ、`./script.ps1`するだけです。  
プログラム自体は無限ループになっているので、最終ページに到達したら自分で`Ctrl + C`で終了させます。  
スクショは実行ディレクトリの`img/`に保存されているのでZIPにするなり、PDFにするなりお好きにどうぞ。  
ちなみにImageMagickがあれば`magick convert img/*.png out.pdf`でPDFに変換できます。  
