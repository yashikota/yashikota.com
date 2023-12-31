---
title: セキュリティ・ミニキャンプ オンライン 2022 参加記
pubDate: 2022-11-14
updDate: 
isUnlisted: false
tags: ["セキュリティ"]
---

11/5、11/6、11/12と3日間行われた
[セキュリティ・ミニキャンプ オンライン 2022](https://www.security-camp.or.jp/minicamp/online2022.html)
に参加しました!  
とても良い刺激になったので気持ち冷めないうちに色々書いていこうと思います。  

---

## 事前課題

基本的には講義で使用するツールのセットアップや使い方の学習、講義に向けての最低限の知識などを学びました。  
知らない技術や触りたかったけど触れていない技術などが出てきて良い学習になりました。  

## 特別講義（倫理）～ハッカーの倫理～

ハッキングは常に法令違反との背中合わせです。  
そんなハッキング行為を扱う情報セキュリティ技術者として倫理を学ぶ講義です。  
それと、この講義の講師の方と懇親会でお話したんですが、経歴が凄かったです。  
元は警察の技官をやっていて司法試験に合格して弁護士になられたそうです。  
しかも警察の技官から弁護士になるのは前例がないそうで…めっちゃ凄いですね…  

## AIを騙すテクニックと対策を学ぼう ～敵対的サンプル入門～

画像認識においてAIは特徴量という値を元にしてこれは〇〇であると判断しています。  
そして、画像に対して人間には感知できない程度のノイズを加えると意図的にAIに誤認識を起こさせることが出来ます。  
これを敵対的サンプル攻撃と言います。  
一番有名なのはパンダの画像にノイズを加えてテナガザルと誤認識させるやつだと思います。  
![An adversarial input, overlaid on a typical image, can cause a classifier to mis categorize a panda as a gibbon.](https://openai.com/content/images/2017/02/adversarial_img_1.png)
本講義では
[Adversarial Robustness Toolbox](https://github.com/Trusted-AI/adversarial-robustness-toolbox)
というPythonのライブラリを用いて、敵対的サンプル攻撃とその防御手法を検証しました。  
AIへの敵対的サンプル攻撃と聞くと何回も試行錯誤して苦労して生成しているのかなと個人的には思っていたので、こんなにも簡単に攻撃ができるんだと衝撃を受けました。  

## シミュレーションを用いたIoT機器の解析体験

ChipWhispererというオープンソースの電力差分解析ソフトウェアを用いてサイドチャネル攻撃を実施してみる講義です。  
サイドチャネル攻撃というと専門的なハードウェアと解析ソフトウェアが必要ですが、今回はソフトウェアで模擬的に実施します。  
この手のツールも今ではオープンソースで公開されているんだなぁ～と思いました。  
ちなみに
[ChipWhispererの使い方を簡単にまとめた記事](https://yashikota.com/blog/chipwhisperer)
を書いたのでよろしければどうぞ。  

## WebとCloudにおけるセキュリティの基礎と実践

近年のWebアプリケーションはクラウドを活用したものが多いですが、そのクラウドサービスでは脆弱性の他にクラウドサービスの不適切な利用・設定で情報漏洩などのセキュリティインシデントに繋がります。  
本講義ではOWASP Juice Shopを使って脆弱性を攻撃してみたり、提供されたAWSの環境に対してSSRFを仕掛けたりしました。  
特にクラウドサービスは個人ではなかなか使わないので今までSSRFの話をされてもイマイチ実感がわかなかったのですが、今回の講義で身をもって体感することができ、とても勉強になりました。  

## コンテナ技術に着目したクラウドネイティブセキュリティ入門

こちらはテキストベースでの解説となり、期間も約4週間と長丁場でした。  
コンテナについては簡単に環境構築できるツールとしてしか認識おらず、セキュリティ的な観点からどのような危険性があるのかを学びました。  
特にイメージの生成過程で機密ファイルがコピーされ、削除されたとしても、ツールを使うことにより容易に抽出可能なことについては驚きました。  
今後サービスはますますクラウドネイティブになっていくと思いますが、セキュリティリスクもやはり潜んでいるのだなと思いました。  

## 修了試験

CTF形式で講義で扱った問題を解き、順位を競いました。  
結果は5位となかなか良い成績を出せました！  
セキュリティ・キャンプのTシャツも頂いてめっちゃ嬉しいです！  
ありがとうございます(._.)  

## グループワーク

1日目と2日目の最終講義にグループワークがあり、4人で継続的に活動ができるものをするというお題が出され、私の班ではLTを継続してやることになりました。  
今でも定期的に活動を続けています。  

## おわりに

全ての講義がハイレベルかつ分かりやすく解説しており、これが無料なのか…と衝撃を受けました笑  
来年は夏の全国大会に絶対参加したいです。  
そのためにもあと半年、勉強を頑張っていきます。  