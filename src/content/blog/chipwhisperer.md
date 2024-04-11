---
title: ChipWhispererの使い方
pubDate: 2022-11-13
updDate: 
isUnlisted: false
category: tech
tags: ["セキュリティ"]
---

ChipWhispererの日本語の情報が全然なかったので書きました。  
動作確認環境はWindows11(21H2)で、ChipWhispererのバージョンは5.6.1です。  

---

## ChipWhispererとは？

電力差分解析を模擬的に実行できる、オープンソースのツールです。  
電力差分解析とはサイドチャネル攻撃の1種で、暗号処理中の電力消費の違いから秘密鍵を推定する攻撃です。  
今回はシミュレーションでサイドチャネル攻撃を行いますが、
[公式サイト](https://www.newae.com/chipwhisperer)
ではサイドチャネル攻撃のためのハードウェアの販売もされています。  

## インストール

Windowsの場合は
[ChipWhispererのGithubのReleases](https://github.com/newaetech/chipwhisperer/releases)
のAssetsからインストーラーをダウンロードします。  
MacやLinuxの場合は、
[公式のインストールガイド](https://chipwhisperer.readthedocs.io/en/latest/index.html#install)
を参照してインストールしてください。  

## 使い方

起動すると自動的にJupyter Notebookが起動します。  
jupyter → coursesと進むとfault101やsca101といったディレクトリがあります。  
scaから始まっているディレクトリが電力差分解析のやつです。  

## SCA101

READMEから引っ張ってきた内容です。  

```txt
SCA101: Introduction to Power Analysis Attacks

Lab 2-1A: Instruction Power Differences
Lab 2-1B: Power Analysis for Password Bypass
Lab 3-1: Large hamming Weight Swings
Lab 3-2: Recovering an AES Key from a Single Bit
Lab 3-3: Recovery an AES key from a Power measurement (DPA)
Lab 4-1: Showing the Hamming Weight relationship of data & power.
Lab 4-2: Correlation Power Analysis
Lab 4-3: Using ChipWhisperer for CPA Attacks
Lab 5-1: ChipWhisperer CPA Attacks in Practice
Lab 6-4: Triggering on UART
```

### Lab 2_1A

sca101の中に

- Lab 2_1A - Instruction Power Differences (HARDWARE).ipynb
- Lab 2_1A - Instruction Power Differences (MAIN).ipynb
- Lab 2_1A - Instruction Power Differences (SIMULATED).ipynb

の3つのファイルがあります。  
今回はソフトウェアによるシミュレーションで試すので、MAINとSIMULATEDの2つを開きます。  
SIMULATEDのセルに書いてあるソースコードを全てコピーした後、MAINの１つ目のセルに上書きしてペーストします。  
上にある```▶Run```か```Ctrl + Enter```でコードのセルを実行して、```OK to continue!```が出てくれば成功です。  
出てこない場合はソースコードのコピペをミスっているか、環境壊れているかもです。  
後はセルを順番に実行していくだけで
![ChipWhisperer_21A](https://raw.githubusercontent.com/yashikota/blog/master/data/img/ChipWhisperer_21A.webp)
このような波形が得られます。  

## Lab 2_1B

先ほどと同じくSIMULATEDのソースコードをMAINにコピペして実行します。  
ここからは単にセルを実行するだけではダメで、各セルのSTART SOLUTIONからEND SOLUTIONの間に解答を記述する必要があります。  

```python
# ###################
# START SOLUTION
# ###################
この間に解答を記述する
# ###################
# END SOLUTION
# ###################
```

ちなみに解答は```SOLN_Lab 2_1B - Power Analysis for Password Bypass.ipynb```というファイルに書いてあります。  
残りのLabも同じように進めていけば大丈夫です。  

## SCA201

READMEから引っ張ってきた内容です。  

```txt
SCA201: Power Analysis Attacks on AES Implementations

Lab 1-1A: Resynchronizing Traces with Sum of Absolute Differences
Lab 1-1B: Resynchronizing Traces with Dynamic Time Warp
Lab 2-1: CPA on a 32-bit AES Implementation
Lab 2-2: CPA on a Hardware AES Implementation: Last-Round State
Lab 2-3: CPA on a Hardware AES Implementation: Mix-Columns
Lab 3-1A: AES-256 Bootloader Attack
Lab 3-B: AES-256 Bootloader with Reverse Engineering using Power Analysis
```

AESの秘密鍵を推定する攻撃です。  

---

## おわりに

サイドチャネル攻撃という言葉は知っていても実際にどんな攻撃を行うのか、攻撃の過程はどうなっているのかなど実際に手を動かしてやってみないと分からないことが学べて面白いと思います！  
無料で使うことができるので、是非やってみてください！  
