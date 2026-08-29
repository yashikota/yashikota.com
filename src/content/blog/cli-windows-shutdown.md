---
title: WindowsのCLIでいい感じにシャットダウンする
pubDate: 2026-08-29
updDate: 
isUnlisted: false
category: tech
tags: ["Windows"]
showToc: false
---

## 指定秒数後にシャットダウンする

shutdown.exeを使います  
引数は秒しか受け付けないのですが、PowerShellだったら()つければ先に評価してくれるので以下のような式で3時間後みたいな感じのやつが書けます。便利  

```sh
shutdown -s -t (60 * 60 *3)
```

キャンセルしたい場合は

```sh
shutdown -a
```

## 指定時間にシャットダウンする

schtasks.exeを組み合わせます。  
これで23時にシャットダウンするタスクが作成されます。  

```sh
schtasks -create -tn "shutdown" -tr "shutdown -s -t 0" -sc once -st 23:00
```

キャンセルしたい場合は

```sh
schtasks -delete -tn "shutdown"
```

それでは良きシャットダウンライフを！  
