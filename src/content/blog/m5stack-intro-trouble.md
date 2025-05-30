---
title: M5Stackに入門する際にハマったこと
pubDate: 2022-10-30
updDate: 
isUnlisted: false
category: tech
tags: ["電子工作", "M5Stack"]
showToc: false
---

今回のターゲットはM5Stackですが、Arduinoやその他ESP32シリーズでも通用するとは思います。  
なお、開発環境はWindows11です。  

---

## M5StackがPCに認識されない

最初に大いにハマったポイント。  
今回使用したM5Stack BasicはPCとの接続にUSB Type-Cを利用しているのですが、裏表を間違えると認識してくれません。  
USB Type-Cは基本的に裏表を気にする必要がないので気が付きませんでした。  

## Arduino IDEのコンパイルがものすごく遅い

これはArduino IDEがソースコードを1つずつウイルスチェックにかけているからだそうです。[^1]  
VSCode+PlatformIOに乗り換えて解決しました。  

[^1]:https://twitter.com/lovyan03/status/1583638899955761153

## シリアルが文字化けしてる

これは定番のハマりポイントですかね？  
シリアル通信はクロックレートを合わせないと正常に通信ができません。  
PlatformIOでは```platformio.ini```に```monitor_speed = 115200```と書けば大丈夫です。  

---

とりあえずはこんなとこですかね。  
またハマりポイントが増えたら追記します。  
