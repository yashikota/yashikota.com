---
title: Everyday OSS
pubDate: 2023-04-01
updDate: 
isUnlisted: false
tags: ["OSS"]
---

1日1つのOSS(オープンソースソフトウェア)を紹介していきます。  
情報は基本的には調査日時(Survey date)時点のものです。  
なお全ての情報が正しいとは限りません。ご了承ください。  

---

## Linux

| title | contents |
|-|-|
| No | 0001 |  
| Survey date | 2023/04/01 |  
| Official site | https://kernel.org |  
| Source code | https://git.kernel.org |  
| Language | C |  
| Category | OS, Linux |  
| License | GPL-2.0 |  
| Status | Active |  

Unix系のOSの1つであり、PCだけでなくサーバーや組み込み機器などにも搭載されている。  
LinuxをカーネルとしたディストリビューションとしてはUbuntuやRed Hat Enterprise Linux, Arch Linuxなどが有名。  

---

## GCC

| title | contents |
|-|-|
| No | 0002 |  
| Survey date | 2023/04/02 |  
| Official site | https://gcc.gnu.org |  
| Source code | https://gcc.gnu.org/git/gcc.git |  
| Language | C, C++ |  
| Category | Compiler, GNU |  
| License | GPLv3 |  
| Status | Active |  

GNUツールチェーンの中核をなすコンパイラ。  
CやC++だけでなくGoやFortranなどにも対応している。  
元はGNU C Compilerの略称だったが多言語対応したことに伴い、今はGNU Compiler Collectionの略称となっている。  

---

## LLVM

| title | contents |
|-|-|
| No | 0003 |  
| Survey date | 2023/04/03 |  
| Official site | https://llvm.org |  
| Source code | https://github.com/llvm/llvm-project |  
| Language | C++ |  
| Category | Compiler, VM |  
| License | Apache License v2.0 |  
| Status | Active |  

GCCと双璧をなすコンパイラ。またコンパイラ基盤。  
LLVM IRという中間言語に翻訳されてからターゲットの機械語に翻訳される。  
そのため言語やアーキテクチャを問わず、様々なプラットフォームに対応できる。  

---

## Python

| title | contents |
|-|-|
| No | 0004 |  
| Survey date | 2023/04/04 |  
| Official site | https://python.org |  
| Source code | https://github.com/python/cpython |  
| Language | Python, C |  
| Category | Programming language, Python |  
| License | Python Software Foundation License |  
| Status | Active |  

AIや科学技術計算をはじめとした幅広い分野で人気を誇る言語。  
動的型付け言語であり、簡単で読みやすいコードが書きやすい。  
また、標準ライブラリやサードパーティのライブラリが非常に充実している。  
Pythonは言語仕様に基づいた実装がいくつかある。  
Pythonソフトウェア財団が開発しているのはC言語で実装されたCPythonである。  
他にコミュニティーが開発しているものとしてはPythonで実装されたPyPyや.NETで実装されたIronPython、Rustで実装されたRustPythonなどがある。  

---

## Rust

| title | contents |
|-|-|
| No | 0005 |  
| Survey date | 2023/04/05 |  
| Official site | https://rust-lang.org |  
| Source code | https://github.com/rust-lang/rust |  
| Language | Rust |  
| Category | Programming language, Rust |  
| License | Apache License v2.0, MIT License |  
| Status | Active |  

言語仕様により安全性が強力に担保されており、メモリ安全性やスレッド安全性を目指して開発されている。  
ガベージコレクションを持たず、C言語やC++に匹敵する速度で動作する。  
近年生まれた言語ということもあり文法がモダンで、パッケージマネージャーやリンター、フォーマッターなどを標準で備えている。  
またStack Overflowが発表している最も愛されている言語ランキングでは2016年以来7年連続で首位を獲得している。  

---

## Firefox

| title | contents |
|-|-|
| No | 0006 |  
| Survey date | 2023/04/06 |  
| Official site | https://www.mozilla.org/firefox |  
| Source code | https://searchfox.org/mozilla-central/source |  
| Language | C, C++, Assembly, Rust |  
| Category | Web browser |  
| License | Mozilla Public License |  
| Status | Active |  

Mozillaが開発する高機能なブラウザ。  
Rustで開発されたレンダリングエンジンや高いカスタマイズ性、プライバシー保護性などの特徴がある。  
Linuxのディストリビューションでは標準のブラウザとしてよく用いられている。  
またTor Browserのベースにもなっている。  

---

## Chromium

| title | contents |
|-|-|
| No | 0007 |  
| Survey date | 2023/04/07 |  
| Official site | https://www.chromium.org |  
| Source code | https://source.chromium.org/chromium |  
| Language | C++, Assembly, Rust |  
| Category | Web browser |  
| License | BSD-3 |  
| Status | Active |  

Googleが開発を主導しており、Google Chromeのベースとなっているソフトウェア。  
Chrome以外にもEdgeやVivaldi、Operaなどもベースにしている。  
タブごとにプロセスが独立するマルチプロセスアーキテクチャに基づいて設計されており、安定性が高い。  
またサンドボックスやセーフブラウジング保護機能などを兼ね備える。  

---

## WebKit

| title | contents |
|-|-|
| No | 0008 |  
| Survey date | 2023/04/08 |  
| Official site | https://webkit.org |  
| Source code | https://github.com/WebKit/WebKit |  
| Language | C++ |  
| Category | Rendering engine |  
| License | LGPL, BSD licenses |  
| Status | Active |  

Appleが開発を主導するクロスプラットフォームのレンダリングエンジン。  
過去にはGoogleも開発に参加しておりChromeにも採用されていたが、開発方針の不一致によりGoogleのレンダリングエンジンはBlinkに分裂した。  

---

## GNU Core Utilities

| title | contents |
|-|-|
| No | 0009 |  
| Survey date | 2023/04/09 |  
| Official site | https://www.gnu.org/software/coreutils |  
| Source code | https://git.savannah.gnu.org/cgit/coreutils.git |  
| Language | C |  
| Category | Shell, Tool |  
| License | GPLv3 |  
| Status | Active |  

lsやcat、mkdir、rm等のUnix系OSで必須とも言えるコマンドツールを集めたソフトウェア。  
元々はfileutils、textutils、shellutilsに分かれていたが2002年9月にCore Utilitiesへ統合された。  

---

## Visual Studio Code

| title | contents |
|-|-|
| No | 0010 |  
| Survey date | 2023/04/10 |  
| Official site | https://code.visualstudio.com |  
| Source code | https://github.com/microsoft/vscode |  
| Language | TypeScript |  
| Category | Text Editor |  
| License | MIT License |  
| Status | Active |  

マイクロソフトが開発を主導するエディター。  
テキストの編集だけではなくデバッグやGit、コード補完、シンタックスハイライト、アドオンによる機能などの様々な機能を備える。  
StackOverflowの調査では最も人気のあるエディター。  

---

## Git

| title | contents |
|-|-|
| No | 0011 |  
| Survey date | 2023/04/11 |  
| Official site | https://git-scm.com |  
| Source code | https://git.kernel.org/pub/scm/git/git.git |  
| Language | C, Shell Script |  
| Category | Version Control System |  
| License | GPLv2 |  
| Status | Active |  

分散型のバージョン管理システム。  
Linuxの開発では商用のバージョン管理システムが用いられていたが、トラブルが有りその環境が使えなくなったため開発された。  
特に動作速度が重視されている。  

---

## Gitlab

| title | contents |
|-|-|
| No | 0012 |  
| Survey date | 2023/04/12 |  
| Official site | https://about.gitlab.com |  
| Source code | https://gitlab.com/gitlab-org/gitlab-foss |  
| Language | Ruby, JavaScript |  
| Category | Git |  
| License | MIT License |  
| Status | Active |  

Gitリポジトリマネージャーで、「ギットラブ」と発音する。  
SaaSとしてgitlab.comが提供されている。  

---

## LibreOffice

| title | contents |
|-|-|
| No | 0013 |  
| Survey date | 2023/04/13 |  
| Official site | https://www.libreoffice.org |  
| Source code | https://git.libreoffice.org/core |  
| Language | C++ |  
| Category | Application |  
| License | GPLv3 |  
| Status | Active |  

Microsoft Officeと互換性を持つオフィスソフトウェア。  
ワードプロセッサのWriter、表計算のCalc、プレゼンテーションのImpress、グラフィックスのDraw、データーベースのBase、数式作成のMathから構成されている。  

---

## MediaWiki

| title | contents |
|-|-|
| No | 0014 |  
| Survey date | 2023/04/14 |  
| Official site | https://www.mediawiki.org/wiki/MediaWiki |  
| Source code | https://gerrit.wikimedia.org/g/mediawiki/core |  
| Language | PHP |  
| Category | Wiki |  
| License | GPLv2 |  
| Status | Active |  

Wikipediaに代表されるWikiソフトウェア。  
大規模WebサイトであるWikipediaでも使用されるため、数TBのコンテンツと数十万ビュー/毎秒にも耐えられるような設計になっている。  

---

## Bash

| title | contents |
|-|-|
| No | 0015 |  
| Survey date | 2023/04/15 |  
| Official site | https://www.gnu.org/software/bash |  
| Source code | https://git.savannah.gnu.org/cgit/bash.git |  
| Language | C |  
| Category | Shell |  
| License | GPLv3 |  
| Status | Active |  

ほとんどのLinuxディストリビューションでデフォルトに設定されているシェル。  
Bourne Shellを置き換えるという目標のもと開発された。  
bashという名前はBourne-again shellに由来する。  

---

## glibc

| title | contents |
|-|-|
| No | 0016 |  
| Survey date | 2023/04/16 |  
| Official site | https://www.gnu.org/software/libc |  
| Source code | https://sourceware.org/git/glibc.git |  
| Language | C |  
| Category | Library |  
| License | LGPL2.1 |  
| Status | Active |  

標準Cライブラリのデファクトスタンダード。  
動的ライブラリであり、`/lib/libc.so.6`に存在する。  

---

## musl

| title | contents |
|-|-|
| No | 0017 |  
| Survey date | 2023/04/17 |  
| Official site | https://musl.libc.org |  
| Source code | https://git.musl-libc.org/cgit/musl |  
| Language | C |  
| Category | Library |  
| License | MIT License |  
| Status | Active |  

軽量で効率的な標準Cライブラリ。  
Alpine Linuxなどでは標準Cライブラリとして採用されている。  

---

## Android

| title | contents |
|-|-|
| No | 0018 |  
| Survey date | 2023/04/18 |  
| Official site | https://www.android.com |  
| Source code | https://android.googlesource.com |  
| Language | Java, C, C++ |  
| Category | OS |  
| License | Apache 2.0 |  
| Status | Active |  

Googleが開発したLinuxベースのモバイル用OS。  
Android OSが搭載された端末は30億台を超え、世界一普及しているOSとなっている。  

---

## Cygwin

| title | contents |
|-|-|
| No | 0019 |  
| Survey date | 2023/04/19 |  
| Official site | https://www.cygwin.com |  
| Source code | https://cygwin.com/git/newlib-cygwin.git |  
| Language | C, C++ |  
| Category | Compatibility layer |  
| License | GPLv3 |  
| Status | Active |  

WindowsにUnixの互換レイヤーを提供するソフトウェア。  
仮想化ではないため軽量で高速に動作する。  

---

## Apache HTTP Server

| title | contents |
|-|-|
| No | 0020 |  
| Survey date | 2023/04/20 |  
| Official site | https://httpd.apache.org |  
| Source code | http://svn.apache.org/repos/asf/httpd/httpd |  
| Language | C |  
| Category | Web Server |  
| License | Apache License |  
| Status | Active |  

人気のあるWebサーバー用ソフトウェア。  
このソフトウェアを開発・支援するためにApache財団が発足した。  

---

## Nginx

| title | contents |
|-|-|
| No | 0021 |  
| Survey date | 2023/04/21 |  
| Official site | https://nginx.org |  
| Source code | https://hg.nginx.org/nginx |  
| Language | C |  
| Category | Web Server |  
| License | FreeBSD License |  
| Status | Active |  

Apache HTTP Serverに比べて高い処理性能、並列性能、省メモリを誇るサーバー用ソフトウェア。  
2021年のWebサーバの市場シェア調査結果によると、Nginxが首位、Apacheが2位となっている。  

---

## WordPress

| title | contents |
|-|-|
| No | 0022 |  
| Survey date | 2023/04/22 |  
| Official site | https://wordpress.org |  
| Source code | https://core.trac.wordpress.org/browser |  
| Language | PHP |  
| Category | CMS |  
| License | GPLv2 |  
| Status | Active |  

動的なブログを作成できるブログソフトウェア。  
テンプレート、プラグインも豊富で初心者でも簡単にブログを始めることができる。  

---

## MySQL

| title | contents |
|-|-|
| No | 0023 |  
| Survey date | 2023/04/23 |  
| Official site | https://www.mysql.com |  
| Source code | https://github.com/mysql/mysql-server |  
| Language | C, C++ |  
| Category | Database |  
| License | GPLv2 |  
| Status | Active |  

オープンソースのDBでは最も人気を誇る。  
現在はOracleが主に開発を行っている。  

---

## PostgreSQL

| title | contents |
|-|-|
| No | 0024 |  
| Survey date | 2023/04/24 |  
| Official site | https://www.postgresql.org |  
| Source code | https://git.postgresql.org/gitweb/?p=postgresql.git |  
| Language | C |  
| Category | Database |  
| License | PostgreSQL License |  
| Status | Active |  

拡張性とSQLへの準拠が特徴のRDBMS。  
元はPostquelというクエリ言語を用いており、名前もPOSTGRESだったがSQLサポートに伴いPostgreSQLと改名された。  

---

## MariaDB

| title | contents |
|-|-|
| No | 0025 |  
| Survey date | 2023/04/25 |  
| Official site | https://mariadb.org |  
| Source code | https://github.com/MariaDB/server |  
| Language | C, C++ |  
| Category | Database |  
| License | GPLv2 |  
| Status | Active |  

MySQLがオラクルに買収されたため、MySQLの作者がフォークして作ったもの。  
名前のMariaは作者の娘の名前に由来している。  

---

## Docker

| title | contents |
|-|-|
| No | 0026 |  
| Survey date | 2023/04/26 |  
| Official site | https://www.docker.com |  
| Source code | https://github.com/moby/moby |  
| Language | Go |  
| Category | Virtualization |  
| License | Apache License 2.0 |  
| Status | Active |  

コンテナ型仮想化環境を提供するデファクトスタンダードなソフトウェア。  
Dockerコンテナにより環境の差異を気にせずに開発できる。  

---

## React

| title | contents |
|-|-|
| No | 0027 |  
| Survey date | 2023/04/27 |  
| Official site | https://react.dev |  
| Source code | https://github.com/facebook/react |  
| Language | JavaScript |  
| Category | Web Library |  
| License | MIT License |  
| Status | Active |  

SPAを構築できるUIライブラリ。  
JSのUIライブラリとしてはデファクトスタンダードの立ち位置にある。  

---

## Vue.js

| title | contents |
|-|-|
| No | 0028 |  
| Survey date | 2023/04/28 |  
| Official site | https://vuejs.org |  
| Source code | https://github.com/vuejs/core |  
| Language | TypeScript |  
| Category | Web Library |  
| License | MIT License |  
| Status | Active |  

Reactと同じくSPAを構築できるUIライブラリ。  
他のJavaScriptライブラリを使用するプロジェクトへの導入において、容易になるように設計されている。  ]
また作者のEvan YouはViteも開発している。  

---

## Vite

| title | contents |
|-|-|
| No | 0029 |  
| Survey date | 2023/04/29 |  
| Official site | https://vitejs.dev |  
| Source code | https://github.com/vitejs/vite |  
| Language | TypeScript |  
| Category | Web Development Tool |  
| License | MIT License |  
| Status | Active |  

ローカル開発環境のサーバーを構築するソフトウェアで、高速に動作しホットリロードにも対応している。  
ヴィートと発音する。  

---

## Apache Maven

| title | contents |
|-|-|
| No | 0030 |  
| Survey date | 2023/04/30 |  
| Official site | https://maven.apache.org |  
| Source code | https://mvnrepository.com/artifact/org.apache.maven |  
| Language | Java |  
| Category | Build Tool |  
| License | Apache License 2.0 |  
| Status | Active |  

Java用のプロジェクト管理ツール。  
ソースコードのコンパイル、テスト、Javadoc生成、テストレポート生成、プロジェクトサイト生成、JAR生成、サーバへのデプロイ、WAR, EARファイル生成など様々な機能が用意されている。  

---

## Gradle

| title | contents |
|-|-|
| No | 0031 |  
| Survey date | 2023/05/01 |  
| Official site | https://gradle.org |  
| Source code | https://github.com/gradle/gradle |  
| Language | Java, Groovy |  
| Category | Build Tool |  
| License | Apache License 2.0 |  
| Status | Active |  

Groovyという言語を使用する自動化システム。  
Apache Mavenと違って増分ビルドが可能。  

---

## SQLite

| title | contents |
|-|-|
| No | 0032 |  
| Survey date | 2023/04/31 |  
| Official site | https://sqlite.org/index.html |  
| Source code | https://www.sqlite.org/src/doc/trunk/README.md |  
| Language | C |  
| Category | Database |  
| License | Public domain |  
| Status | Active |  

一般的なDBと違い、データの保存に単一のファイルのみを使用するRDBMS。  
そのため軽量であり、様々な用途で使用されている。  

---

## FFmpeg

| title | contents |
|-|-|
| No | 0033 |  
| Survey date | 2023/05/02 |  
| Official site | https://ffmpeg.org |  
| Source code | https://git.ffmpeg.org/ffmpeg.git |  
| Language | C, Assembly |  
| Category | Multimedia framework |  
| License | LGPL2.1 |  
| Status | Active |  

マルチメディアデータを記録、変換、再生するソフトウェア。  
様々なコーデックに対応しており、幅広く利用されている。  

---

## Blender

| title | contents |
|-|-|
| No | 0034 |  
| Survey date | 2023/05/03 |  
| Official site | https://www.blender.org |  
| Source code | https://projects.blender.org/blender/blender |  
| Language | C, C++, Python |  
| Category | 3D |  
| License | GPLv3 |  
| Status | Active |  

3DCG製作や2Dアニメーションを作れるソフトウェア。  
多機能かつ軽量なためアマチュアならずプロにも普及している。  
またPythonで操作することもできる。  

---

## KiCad

| title | contents |
|-|-|
| No | 0035 |  
| Survey date | 2023/05/04 |  
| Official site | https://www.kicad.org |  
| Source code | https://gitlab.com/kicad/code/kicad |  
| Language | C, C++ |  
| Category | EDA |  
| License | GPLv3 |  
| Status | Active |  

電子回路設計のためのCADツール。  
回路図エディタの他、PCBレイアウトや3Dビューワーなどがある。  

---

## Audacity

| title | contents |
|-|-|
| No | 0036 |  
| Survey date | 2023/05/05 |  
| Official site | https://www.audacityteam.org |  
| Source code | https://github.com/audacity/audacity |  
| Language | C, C++ |  
| Category | Audio Editor |  
| License | GPLv2 |  
| Status | Active |  

オーディオファイルや録音した音声の編集やミキシング、フィルターの適応などができる多機能なオーディオエディター。  
フォーク版として、[Dark Audacity](http://www.darkaudacity.com)がある。  

---

## Next.js

| title | contents |
|-|-|
| No | 0037 |  
| Survey date | 2023/05/06 |  
| Official site | https://nextjs.org |  
| Source code | https://github.com/vercel/next.js |  
| Language | JavaScript, TypeScript |  
| Category | Web framefork |  
| License | MIT |  
| Status | Active |  

Reactベースのフレームワークであり、サーバーサイドレンダリング(SSR)やスタティックジェネレート(SG)、ファイルベースのルーティングなど豊富な機能を提供する。  

---

## Angular

| title | contents |
|-|-|
| No | 0038 |  
| Survey date | 2023/05/07 |  
| Official site | https://angular.io |  
| Source code | https://github.com/angular/angular |  
| Language | TypeScript |  
| Category | Web framework |  
| License | MIT |  
| Status | Active |  

Googleが開発を主導するWebフレームワーク。  
元々はAngularJSと呼ばれていたが、パフォーマンスの不満と使いにくい欠点があったため一から作り直しAngularとなった。  

---

## Node.js

| title | contents |
|-|-|
| No | 0039 |  
| Survey date | 2023/05/08 |  
| Official site | https://nodejs.org |  
| Source code | https://github.com/nodejs/node |  
| Language | JavaScript, C++ |  
| Category | Runtime environment |  
| License | MIT |  
| Status | Active |  

サーバーサイドのJavaScript実行環境。  
だが最近ではクライアントサイドでのJavaScript開発環境としても幅広く用いられる。  

---

## Deno

| title | contents |
|-|-|
| No | 0040 |  
| Survey date | 2023/05/09 |  
| Official site | https://deno.com |  
| Source code | https://github.com/denoland/deno |  
| Language | Rust, JavaScript, TypeScript |  
| Category | Runtime environment |  
| License | MIT |  
| Status | Active |  

Node.jsの作者がNode.jsの反省点を生かし作った新たなJavaScript実行環境で、モダンかつセキュアな改善が盛り込まれている。  
初期はNode.jsとは非互換だったが、2022年頃から互換対応し始めた。  

---

## Bun

| title | contents |
|-|-|
| No | 0041 |  
| Survey date | 2023/05/10 |  
| Official site | https://bun.sh |  
| Source code | https://github.com/oven-sh/bun |  
| Language | Zig, C++, JavaScript |  
| Category | Runtime environment |  
| License | MIT |  
| Status | Active |  

Node.jsと互換性をもつJavaScript実行環境。  
Zigという言語で実装されており動作が高速。  

---

## V8

| title | contents |
|-|-|
| No | 0042 |  
| Survey date | 2023/05/11 |  
| Official site | https://v8.dev |  
| Source code | https://chromium.googlesource.com/v8/v8 |  
| Language | C++ |  
| Category | JavaScript engine |  
| License | MIT |  
| Status | Active |  

Googleが開発を主導するJIT型のJavaScriptエンジン。  
Chromiumの他Node.jsやDenoにも採用されている。  

---

## QEMU

| title | contents |
|-|-|
| No | 0043 |  
| Survey date | 2023/05/12 |  
| Official site | https://www.qemu.org |  
| Source code | https://gitlab.com/qemu-project/qemu |  
| Language | C |  
| Category | Emulator |  
| License | GPLv2 |  
| Status | Active |  

プロセッサーエミュレーターで、x86やPowerPC、ARMなど様々なアーキテクチャに対応している。  
AndroidのSDKにも利用されている。  

---

## KVM

| title | contents |
|-|-|
| No | 0044 |  
| Survey date | 2023/05/13 |  
| Official site | https://www.linux-kvm.org/page/Main_Page |  
| Source code | https://git.kernel.org/pub/scm/virt/kvm/kvm.git |  
| Language | C |  
| Category | Hypervisor |  
| License | GPL |  
| Status | Active |  

正式にはKernel-based Virtual Machineと言い、カーネルベースの仮想化モジュール。  
KVM自体はエミュレーションは全く実行しないため、エミュレーションの実行にQEMUと組み合わせて使用されることが多い。  

---

## NumPy

| title | contents |
|-|-|
| No | 0045 |  
| Survey date | 2023/05/14 |  
| Official site | https://numpy.org |  
| Source code | github.com/numpy/numpy |  
| Language | Python, C |  
| Category | Numerical analysis |  
| License | BSD |  
| Status | Active |  

Pythonにて数値計算を行うライブラリで、高水準の数学計算関数を数多く提供する。  
NumPy自体はC言語で書かれているため動作は高速。  

---

## SciPy

| title | contents |
|-|-|
| No | 0046 |  
| Survey date | 2023/05/15 |  
| Official site | https://scipy.org |  
| Source code | https://github.com/scipy/scipy |  
| Language | Python, Fortran, C |  
| Category | Numerical analysis |  
| License | BSD |  
| Status | Active |  

Pythonにて高度な数学、科学、工業計算を扱うライブラリ。  
統計、最適化、積分、線形代数、フーリエ変換、信号・イメージ処理、遺伝的アルゴリズム、常微分方程式ソルバ、特殊関数、その他のモジュールを提供している。  

---

## scikit-learn

| title | contents |
|-|-|
| No | 0047 |  
| Survey date | 2023/05/16 |  
| Official site | https://scikit-learn.org |  
| Source code | https://github.com/scikit-learn/scikit-learn |  
| Language | Python |  
| Category | Machine learning library |  
| License | New BSD |  
| Status | Active |  

教師あり学習、教師なし学習に対応した機械学習ライブラリ。  
SVM、ランダムフォレスト、GBなどの回帰、分類、クラスタリングアルゴリズムを備えている。  

---

## PyTorch

| title | contents |
|-|-|
| No | 0048 |  
| Survey date | 2023/05/17 |  
| Official site | https://pytorch.org |  
| Source code | https://github.com/pytorch/pytorch |  
| Language | Python, C++ |  
| Category | Machine learning library |  
| License | BSD-3 |  
| Status | Active |  

TorchというLua製の機械学習ライブラリをPythonに移植したもの。  
Facebookが開発を主導しており、機械学習ライブラリのシェア率ではNo1。  

---

## TensorFlow

| title | contents |
|-|-|
| No | 0049 |  
| Survey date | 2023/05/18 |  
| Official site | https://tensorflow.org |  
| Source code | https://github.com/tensorflow/tensorflow |  
| Language | Python, C++ |  
| Category | Machine learning library |  
| License | Apache 2.0 |  
| Status | Active |  

Googleが開発を主導する機械学習ライブラリ。  
運用のサポートが手厚く、ビスネス用途で数多く使われている。  

---

## Keras

| title | contents |
|-|-|
| No | 0050 |  
| Survey date | 2023/05/19 |  
| Official site | https://keras.io |  
| Source code | https://github.com/keras-team/keras |  
| Language | Python |  
| Category | Machine learning library |  
| License | Apache 2.0 |  
| Status | Active |  

最小限、拡張可能性に重きをおいた機械学習ライブラリ。  
メンテナがGoogleのエンジニアであり、TensorFlow 2から同梱されるようになった。  

---

## Chainer

| title | contents |
|-|-|
| No | 0051 |  
| Survey date | 2023/05/20 |  
| Official site | https://chainer.org |  
| Source code | https://github.com/chainer/chainer |  
| Language | Python, C++ |  
| Category | Machine learning library |  
| License | MIT |  
| Status | Inactive |  

日本のスタートアップ企業PFNが開発していた機械学習ライブラリ。  
Pytorchにも大きな影響を与えたが、英語圏の勢いに負けてしまい開発終了することになった。  

---

## ncurses

| title | contents |
|-|-|
| No | 0052 |  
| Survey date | 2023/05/21 |  
| Official site | https://invisible-island.net/ncurses/announce.html |  
| Source code | https://invisible-mirror.net/archives/ncurses |  
| Language | C |  
| Category | Widget toolkit |  
| License | X11 |  
| Status | Active |  

TUIを提供するライブラリ。  
cursesの代替を目指して開発され今では最も普及している。  

---

## JAX

| title | contents |
|-|-|
| No | 0053 |  
| Survey date | 2023/05/22 |  
| Official site | https://jax.readthedocs.io/en/latest |  
| Source code | https://github.com/google/jax |  
| Language | Python |  
| Category | Machine learning library |  
| License | Apache2.0 |  
| Status | Active |  

Googleが開発を行う機械学習ライブラリ。  
標準でGPUにも対応しており、自動微分やJITコンパイラ、SPMDプログラミングなどの便利な機能を提供している。  

---

## Icarus Verilog

| title | contents |
|-|-|
| No | 0054 |  
| Survey date | 2023/05/23 |  
| Official site | https://bleyer.org/icarus |  
| Source code | https://github.com/steveicarus/iverilog |  
| Language | C++, Verilog, C |  
| Category | Verilog Simulator |  
| License | GPL2.0 |  
| Status | Active |  

Verilogシミュレーター。  
System Verilogにも対応している。  
また、GNUwaveなどで波形を見ることもできる。  

---

## Simple DirectMedia Layer

| title | contents |
|-|-|
| No | 0055 |  
| Survey date | 2023/05/24 |  
| Official site | https://www.libsdl.org |  
| Source code | https://github.com/libsdl-org/SDL |  
| Language | C, C++ |  
| Category | Multimedia library |  
| License | Zlib license |  
| Status | Active |  

グラフィックの描画やサウンドの再生などのAPIを提供するマルチメディアライブラリ。  
JavaやRust、phpなどの様々な言語のラッパーが存在する。  

---

## wgpu

| title | contents |
|-|-|
| No | 0056 |  
| Survey date | 2023/05/25 |  
| Official site | https://wgpu.rs |  
| Source code | https://github.com/gfx-rs/wgpu |  
| Language | Rust |  
| Category | Graphics API |  
| License | Apache-2.0, MIT licenses |  
| Status | Active |  

Rustで書かれたWebGPUのAPI。  
WebGPUベースなのでクロスプラットフォームであり、様々なグラフィックAPIに変換される。  

---

## OpenCV

| title | contents |
|-|-|
| No | 0057 |  
| Survey date | 2023/05/26 |  
| Official site | https://opencv.org |  
| Source code | https://github.com/opencv/opencv |  
| Language | C++ |  
| Category | Image processing library |  
| License | Apache2.0 |  
| Status | Active |  

元々はIntelが開発していた画像処理ライブラリ。  
Pythonでもopencv-pythonとしてパッケージが提供されている。  

---

## Rye

| title | contents |
|-|-|
| No | 0058 |  
| Survey date | 2023/05/27 |  
| Official site | https://rye-up.com |  
| Source code | https://github.com/mitsuhiko/rye |  
| Language | Rust |  
| Category | Package manager |  
| License | MIT |  
| Status | Active |  

Flaskの開発者が開発中のRust製Pythonパッケージマネージャー。  
Pythonのバージョン管理からvirtualenvsの設定まで行える。  
pyenv + poetry のようなイメージ。  

---

## Poetry

| title | contents |
|-|-|
| No | 0059 |  
| Survey date | 2023/05/28 |  
| Official site | https://python-poetry.org |  
| Source code | https://github.com/python-poetry/poetry |  
| Language | Python |  
| Category | Package manager |  
| License | MIT |  
| Status | Active |  

pyproject.tomlに対応したパッケージマネージャー。  
pipと違い自動的に仮想環境が構築される。  

---

## Pipenv

| title | contents |
|-|-|
| No | 0060 |  
| Survey date | 2023/05/29 |  
| Official site | https://pipenv.pypa.io |  
| Source code | https://github.com/pypa/pipenv |  
| Language | Python |  
| Category | Package manager |  
| License | MIT |  
| Status | Active |  

 PyPA (Python Packaging Authority) というコミュニティが開発しているパッケージマネージャー。  
 Pipfileという独自のファイルで依存関係を管理する。  

---

## pyenv

| title | contents |
|-|-|
| No | 0061 |  
| Survey date | 2023/05/30 |  
| Official site | https://github.com/pyenv/pyenv |  
| Source code | https://github.com/pyenv/pyenv |  
| Language | Python |  
| Category | Environment manager |  
| License | MIT |  
| Status | Active |  

 Pythonのバージョンの切り替えを簡単に行えるツール。  
 ディレクトリごとにバージョンを切り替えることもできる。  

---

## ruff

| title | contents |
|-|-|
| No | 0062 |  
| Survey date | 2023/05/31 |  
| Official site | https://beta.ruff.rs |  
| Source code | https://github.com/charliermarsh/ruff |  
| Language | Rust |  
| Category | Linter |  
| License | MIT |  
| Status | Active |  

Rustで書かれたPythonのリンター。  
flake8に比べても格段に早い。  

---

## flake8

| title | contents |
|-|-|
| No | 0063 |  
| Survey date | 2023/06/01 |  
| Official site | https://flake8.pycqa.org |  
| Source code | https://github.com/PyCQA/flake8 |  
| Language | Python |  
| Category | Linter |  
| License | MIT |  
| Status | Active |  

PyPAが管理しているプロジェクト。  
以下の3つのツールから構成されている。  
- pyflakes    : コードのエラーチェック  
- pycodestyle : PEP8に準拠しているかチェック  
- mccabe      : 循環的複雑度のチェック  

---

## pytest

| title | contents |
|-|-|
| No | 0064 |  
| Survey date | 2023/06/02 |  
| Official site | https://docs.pytest.org |  
| Source code | https://github.com/pytest-dev/pytest |  
| Language | Python |  
| Category | Testing framework |  
| License | MIT |  
| Status | Active |  

ユニットテスト、統合テスト、E2Eテスト、機能テストを実行できるフレームワーク。  
現在主流なフレームワークであり、標準ライブラリであるunittestより便利。  

---

## mypy

| title | contents |
|-|-|
| No | 0065 |  
| Survey date | 2023/06/03 |  
| Official site | https://mypy-lang.org |  
| Source code | https://github.com/python/mypy |  
| Language | Python |  
| Category | Type checker |  
| License | MIT |  
| Status | Active |  

Pythonで静的型検査が行えるライブラリ。  
コードに型ヒントを付与する必要がある。  

---

## OpenAL Soft

| title | contents |
|-|-|
| No | 0066 |  
| Survey date | 2023/06/04 |  
| Official site | https://openal-soft.org |  
| Source code | https://github.com/kcat/openal-soft |  
| Language | C++ |  
| Category | Sound library |  
| License | GPLv2 |  
| Status | Active |  

Open ALというクロスプラットフォームのオーディオAPIを実装しているライブラリ。  
3Dオーディオを表現することができる。  

---

## Lightweight Java Game Library

| title | contents |
|-|-|
| No | 0067 |  
| Survey date | 2023/06/05 |  
| Official site | https://www.lwjgl.org |  
| Source code | https://github.com/LWJGL/lwjgl3 |  
| Language | Java |  
| Category | Game library |  
| License | BSD |  
| Status | Active |  

OpenGL/Vulkan, OpenAL, OpenCLをJavaから扱えるようにしたライブラリ。  
高いパフォーマンスと型安全で使いやすいAPIを提供する。  

---

## tox

| title | contents |
|-|-|
| No | 0068 |  
| Survey date | 2023/06/06 |  
| Official site | https://tox.wiki |  
| Source code | https://github.com/tox-dev/tox |  
| Language | Python |  
| Category | Test command line tool |  
| License | MIT |  
| Status | Active |  

複数のバージョンのPythonでテストを行えるようにするライブラリー。  

---

## black

| title | contents |
|-|-|
| No | 0069 |  
| Survey date | 2023/06/07 |  
| Official site | https://black.readthedocs.io |  
| Source code | https://github.com/psf/black |  
| Language | Python |  
| Category | Formatter |  
| License | MIT |  
| Status | Active |  

pep8に準拠したフォーマットに整形してくれるフォーマッター。  
設定項目が1行あたりの文字数の変更しかない。  
チーム内でフォーマッターの設定を議論する必要がないので効率的。  

---

## isort

| title | contents |
|-|-|
| No | 0070 |  
| Survey date | 2023/06/08 |  
| Official site | https://pycqa.github.io/isort |  
| Source code | https://github.com/PyCQA/isort |  
| Language | Python |  
| Category | Formatter |  
| License | MIT |  
| Status | Active |  

import文をPEP8に準拠した適切な順番に並び替えるフォーマッター。  
よくblackやruffと組み合わせて使用する。  

---

## pysen

| title | contents |
|-|-|
| No | 0071 |  
| Survey date | 2023/06/09 |  
| Official site | https://github.com/pfnet/pysen |  
| Source code | https://github.com/pfnet/pysen |  
| Language | Python |  
| Category | Utility |  
| License | MIT |  
| Status | Active |  

flake8、mypy、black 、isortのlint、formatを一度に実行できるライブラリ。  
全て.pyproject.tomlに設定を記述するため設定ファイルがたくさん生成されない。  

---

## Wasmtime

| title | contents |
|-|-|
| No | 0072 |  
| Survey date | 2023/06/10 |  
| Official site | https://wasmtime.dev |  
| Source code | https://github.com/bytecodealliance/wasmtime |  
| Language | Rust |  
| Category | Wasm runtime |  
| License | MIT |  
| Status | Active |  

WASIと呼ばれるブラウザ外でWasmを実行するAPIを実装するWASMランタイム。  
Wasmの仕様を決めているBytecode Allianceが開発を行っている。  

---

## Wasmer

| title | contents |
|-|-|
| No | 0073 |  
| Survey date | 2023/06/11 |  
| Official site | https://wasmer.io |  
| Source code | https://github.com/wasmerio/wasmer |  
| Language | Rust |  
| Category | Wasm runtime |  
| License | MIT |  
| Status | Active |  

WASIをサポートするWasmランタイム。  
Wasmtimeと比べて高速に動作したり、機能が豊富。  

---

## POV-Ray

| title | contents |
|-|-|
| No | 0074 |  
| Survey date | 2023/06/12 |  
| Official site | https://www.povray.org |  
| Source code | https://github.com/POV-Ray/povray |  
| Language | C++ |  
| Category | Ray tracer |  
| License | AGPL3.0 |  
| Status | Active |  

Persistence of Vision Raytracerの略であり、ポヴレイと読まれる。  
3Dレンダリングエンジンの1つで、数学的なモデリングにも対応している。  

---

## Recoil

| title | contents |
|-|-|
| No | 0075 |  
| Survey date | 2023/06/13 |  
| Official site | https://recoiljs.org |  
| Source code | https://github.com/facebookexperimental/Recoil |  
| Language | JavaScript |  
| Category | State management library  |  
| License | MIT |  
| Status | Active |  

Facebook謹製のReact用状態管理ライブラリ。  
ただしまだ安定化はされていない。  

---

## FastAPI

| title | contents |
|-|-|
| No | 0076 |  
| Survey date | 2023/06/14 |  
| Official site | https://fastapi.tiangolo.com/lo |  
| Source code | https://github.com/tiangolo/fastapi |  
| Language | Python |  
| Category | Web framework |  
| License | MIT |  
| Status | Active |  

Pythonで高速に動作するウェブサーバー用フレームワーク。  
OpenAPIドキュメントが自動生成されるなど便利な機能が豊富。  

---

## Django

| title | contents |
|-|-|
| No | 0077 |  
| Survey date | 2023/06/15 |  
| Official site | https://www.djangoproject.com |  
| Source code | https://github.com/django/django |  
| Language | Python |  
| Category | Web framework |  
| License | MIT |  
| Status | Active |  

model–template–viewsアーキテクチャを採用するWebフレームワーク。  
機能がとても豊富で、InstagramやBitbucketなどにも採用されている。  

---

## Flask

| title | contents |
|-|-|
| No | 0078 |  
| Survey date | 2023/06/16 |  
| Official site | https://flask.palletsprojects.com |  
| Source code | https://github.com/pallets/flask |  
| Language | Python |  
| Category | Web framework |  
| License | BSDv3 |  
| Status | Active |  

軽量なWebフレームワーク。  
元はエイプリルフールのジョークとして作成されたが、その後本格的なアプリケーションとして成長した。  

---

## Bottle

| title | contents |
|-|-|
| No | 0079 |  
| Survey date | 2023/06/17 |  
| Official site | https://bottlepy.org |  
| Source code | https://github.com/bottlepy/bottle |  
| Language | Python |  
| Category | Web framework |  
| License | MIT |  
| Status | Active |  

シンプルかつ軽量なWebフレームワーク。  
単一のファイルのみで構成され、標準ライブラリ以外に依存関係を持たない。  

---

## GLFW

| title | contents |
|-|-|
| No | 0080 |  
| Survey date | 2023/06/18 |  
| Official site | https://www.glfw.org |  
| Source code | https://github.com/glfw/glfw |  
| Language | C |  
| Category | Graphic API |  
| License | Zlib |  
| Status | Active |  

OpenGLをベースとした軽量なグラフィックAPI。  
キーボードやマウス、ジョイスティックなどもサポートする。  

---

## pybind11

| title | contents |
|-|-|
| No | 0081 |  
| Survey date | 2023/06/19 |  
| Official site | https://pybind11.readthedocs.io |  
| Source code | https://github.com/pybind/pybind11 |  
| Language | C++, Python |  
| Category | Head library |  
| License | BSD |  
| Status | Active |  

CやC++で実装したプログラムをPythonから簡単に使えるようにするライブラリ。  
パッケージ化することもできる。  

---

## nanobind

| title | contents |
|-|-|
| No | 0082 |  
| Survey date | 2023/06/20 |  
| Official site | https://nanobind.readthedocs.io |  
| Source code | https://github.com/wjakob/nanobind |  
| Language | C++, Python |  
| Category | Head library |  
| License | BSD-3 |  
| Status | Active |  

pybind11の作者が新たに作ったバインディングライブラリ。  
パフォーマンスの向上やCMakeとの連携などが改善されている。  

---

## nanobind

| title | contents |
|-|-|
| No | 0082 |  
| Survey date | 2023/06/20 |  
| Official site | https://nanobind.readthedocs.io |  
| Source code | https://github.com/wjakob/nanobind |  
| Language | C++, Python |  
| Category | Head library |  
| License | BSD-3 |  
| Status | Active |  

pybind11の作者が新たに作ったバインディングライブラリ。  
パフォーマンスの向上やCMakeとの連携などが改善されている。  

---

## Cython

| title | contents |
|-|-|
| No | 0083 |  
| Survey date | 2023/06/21 |  
| Official site | https://cython.org |  
| Source code | https://github.com/cython/cython |  
| Language | Python, Cython |  
| Category | Optimising static compiler |  
| License | Apache-2.0 |  
| Status | Active |  

PythonをC/C++に変換することで、高速化を図る処理系。  
Cython言語というPythonのスーパーセットを用いてトランスパイルを行う。  

---

## PyO3

| title | contents |
|-|-|
| No | 0084 |  
| Survey date | 2023/06/22 |  
| Official site | https://pyo3.rs |  
| Source code | https://github.com/PyO3/pyo3 |  
| Language | Rust |  
| Category | Binding library |  
| License | Apache 2.0 |  
| Status | Active |  

Python用のRustバインディング。  
RustからPythonコードの実行ができる。  

---

## naga

| title | contents |
|-|-|
| No | 0085 |  
| Survey date | 2023/06/23 |  
| Official site | https://crates.io/crates/naga |  
| Source code | https://github.com/gfx-rs/naga |  
| Language | Rust |  
| Category | Shader translation library |  
| License | Apache 2.0 |  
| Status | Active |  

Rustのwgpuでに対応したシェダー変換ライブラリ。  
WGSLやHLSL、GLSL、Metalなど主要なシェダーに対応している。  

---

## OpenSSL

| title | contents |
|-|-|
| No | 0086 |  
| Survey date | 2023/06/24 |  
| Official site | https://www.openssl.org |  
| Source code | https://github.com/openssl/openssl |  
| Language | C, Perl |  
| Category | Security library |  
| License | Apache 2.0 |  
| Status | Active |  

SSL、TLSプロトコルや各種暗号プロトコルを提供するライブラリ。  
幅広く活用されており、様々なプラットフォームで利用できる。    

---

## panda

| title | contents |
|-|-|
| No | 0087 |  
| Survey date | 2023/06/25 |  
| Official site | https://panda-css.com |  
| Source code | https://github.com/chakra-ui/panda |  
| Language | TypeScript |  
| Category | CSS framework |  
| License | MIT |  
| Status | Active |  

Chakra UIのチームが開発したゼロランタイムでモダンなCSS in JSライブラリ。  
様々なライブラリ/フレームワークに対応している。  

---

## Tailwind CSS

| title | contents |
|-|-|
| No | 0088 |  
| Survey date | 2023/06/26 |  
| Official site | https://tailwindcss.com |  
| Source code | https://github.com/tailwindlabs/tailwindcss |  
| Language | CSS, JavaScript |  
| Category | CSS framework |  
| License | MIT |  
| Status | Active |  

ユーティリティーファーストなCSSフレームワーク。  
タグにユーティリティークラスを付与することでスタイルが適応される。  

---

## Chakra UI

| title | contents |
|-|-|
| No | 0089 |  
| Survey date | 2023/06/27 |  
| Official site | https://chakra-ui.com |  
| Source code | https://github.com/chakra-ui/chakra-ui |  
| Language | TypeScript |  
| Category | CSS framework |  
| License | MIT |  
| Status | Active |  

スタイルも一緒に提供してくれるUIコンポーネントライブラリ。  
効率よくUIを構築することができる。  

---

## MUI

| title | contents |
|-|-|
| No | 0090 |  
| Survey date | 2023/06/28 |  
| Official site | https://mui.com |  
| Source code | https://github.com/mui/material-ui |  
| Language | TypeScript, JavaScript |  
| Category | CSS framework |  
| License | MIT |  
| Status | Active |  

Googleが提唱するMaterial Designを提供するUIライブラリ。  
昔はMaterial UIという名前だったが改名されMUIとなっている。  

---

## NextUI

| title | contents |
|-|-|
| No | 0091 |  
| Survey date | 2023/06/29 |  
| Official site | https://nextui.org |  
| Source code | https://github.com/nextui-org/nextui |  
| Language | TypeScript |  
| Category | CSS framework |  
| License | MIT |  
| Status | Active |  

モダンで美しいUIを提供するUIライブラリ。  
version2ではTailwindベースで開発が進められている。  

---

## Stitches

| title | contents |
|-|-|
| No | 0092 |  
| Survey date | 2023/06/30 |  
| Official site | https://stitches.dev |  
| Source code | https://github.com/stitchesjs/stitches |  
| Language | JavaScript |  
| Category | CSS framework |  
| License | MIT |  
| Status | Inactive |  

near-zero runtimeで型安全に書けるCSS in JSライブラリ。  
現在は開発が終了しており、メンテナンスフェーズに入っている。  

---

## styled-components

| title | contents |
|-|-|
| No | 0093 |  
| Survey date | 2023/07/01 |  
| Official site | https://styled-components.com |  
| Source code | https://github.com/styled-components/styled-components |  
| Language | TypeScript |  
| Category | CSS framework |  
| License | MIT |  
| Status | Active |  

CSS in JSライブラリの1つでメジャーなライブラリ。  
スタイルを当てたコンポーネントを定義するという特徴を持つ。  

---

## bpftune

| title | contents |
|-|-|
| No | 0094 |  
| Survey date | 2023/07/02 |  
| Official site | https://github.com/oracle-samples/bpftune |  
| Source code | https://github.com/oracle-samples/bpftune |  
| Language | C |  
| Category | eBPF |  
| License | GPL 2.0 |  
| Status | Active |  

オラクルが開発しているLinuxカーネル用チューニングツール。  
輻輳やTCP、Netnsなどのチューナーが利用できる。  

---

## OpenEXR 

| title | contents |
|-|-|
| No | 0095 |  
| Survey date | 2023/07/03 |  
| Official site | https://openexr.com |  
| Source code | https://github.com/AcademySoftwareFoundation/openexr |  
| Language | C, C++ |  
| Category | Image format |  
| License | BSD License |  
| Status | Active |  

HDRイメージのための規格でスターウォーズの特殊効果を担当したILM社によって作られた。  
現在では様々なソフトウェアでサポートされている。  

---

## OpenSubdiv 

| title | contents |
|-|-|
| No | 0096 |  
| Survey date | 2023/07/04 |  
| Official site | https://graphics.pixar.com/opensubdiv |  
| Source code | https://github.com/PixarAnimationStudios/OpenSubdiv |  
| Language | C++, C |  
| Category | 3DCG |  
| License | Apache 2.0 |  
| Status | Active |  

サブディビジョンサーフェスというポリゴンを滑らかに分割する手法を実装するライブラリ。  
アニメーション映画でおなじみのピクサーが開発している。  

---

## Streamlit

| title | contents |
|-|-|
| No | 0097 |  
| Survey date | 2023/07/05 |  
| Official site | https://streamlit.io |  
| Source code | https://github.com/streamlit/streamlit |  
| Language | Python, TypeScript |  
| Category | Web framework |  
| License | Apache 2.0 |  
| Status | Active |  

Pythonのコードだけでお手軽にWebサイトを作成できるフレームワーク。  
機械学習アプリのデモ用などに使われている。  

---

## Gradio

| title | contents |
|-|-|
| No | 0098 |  
| Survey date | 2023/07/06 |  
| Official site | https://www.gradio.app |  
| Source code | https://github.com/gradio-app/gradio |  
| Language | Python |  
| Category | Web framework |  
| License | Apache 2.0 |  
| Status | Active |  

機械学習のデモを簡単に行えるサイトを構築できるPythonライブラリ。  
Stable Diffusion web UIにも使われている。  

---

## OpenSSL

| title | contents |
|-|-|
| No | 0099 |  
| Survey date | 2023/07/07 |  
| Official site | https://www.openssl.org |  
| Source code | https://github.com/openssl/openssl |  
| Language | C, Perl |  
| Category | Cryptography library |  
| License | Apache 2.0 |  
| Status | Active |  

SSL/TLSと暗号を扱うライブラリ。  
様々なプラットフォームにて使用されている。  

---

## zlib

| title | contents |
|-|-|
| No | 0100 |  
| Survey date | 2023/07/08 |  
| Official site | https://z-lib.is |  
| Source code | https://github.com/madler/zlib |  
| Language | C |  
| Category | Data compression library |  
| License | zlib License |  
| Status | Active |  

データ圧縮、展開を行うライブラリ。  
可逆圧縮形式のDeflateを採用している。

---

## Zstandard

| title | contents |
|-|-|
| No | 0101 |  
| Survey date | 2023/07/09 |  
| Official site | https://facebook.github.io/zstd |  
| Source code | https://github.com/facebook/zstd |  
| Language | C |  
| Category | Data compression library |  
| License | GPL2.0 |  
| Status | Active |  

高速で可逆圧縮なデータ圧縮ライブラリ。  
リアルタイム圧縮をサポートし、zlibより高い圧縮率を誇る。  

---

## Ubuntu

| title | contents |
|-|-|
| No | 0102 |  
| Survey date | 2023/07/10 |  
| Official site | https://ubuntu.com |  
| Source code | https://code.launchpad.net/ubuntu |  
| Language | C, Assembly |  
| Category | OS, Linux |  
| License | GPL |  
| Status | Active |  

DebianをベースにしたLinuxカーネルの1つであり、大きなシェアを獲得している。  
半年に1回アップデートが提供されており、2年に1度LTS版がリリースされる。  

---

## Android

| title | contents |
|-|-|
| No | 0103 |  
| Survey date | 2023/07/11 |  
| Official site | https://www.android.com |  
| Source code | https://android.googlesource.com |  
| Language | Java, Kotlin, C, C++ |  
| Category | OS |  
| License | Apache License 2.0 |  
| Status | Active |  

世界で最も使用されているモバイル用OS。  
Linuxベースでタッチ操作などに最適化されている。  

---

## Debian

| title | contents |
|-|-|
| No | 0104 |  
| Survey date | 2023/07/12 |  
| Official site | https://www.debian.org |  
| Source code | https://sources.debian.org |  
| Language | C |  
| Category | OS |  
| License | DFSG-compatible licenses |  
| Status | Active |  

Linuxディストリビューションの1つ。  
UbuntuはDebianの派生ディストリビューションである。  

---

## OpenJDK

| title | contents |
|-|-|
| No | 0105 |  
| Survey date | 2023/07/13 |  
| Official site | https://openjdk.org |  
| Source code | https://github.com/openjdk/jdk |  
| Language | Java, C++ |  
| Category | Java platform |  
| License | GPL2.0 |  
| Status | Active |  

Java言語の公式リファレンス実装。  
javacやJavaクラスライブラリが含まれている。  

---

## Redis

| title | contents |
|-|-|
| No | 0106 |  
| Survey date | 2023/07/14 |  
| Official site | https://redis.io |  
| Source code | https://github.com/redis/redis |  
| Language | C |  
| Category | KVS |  
| License | BSD-3 |  
| Status | Active |  

インメモリデータベースなKVSで、NoSQLの1つ。  
処理速度が早く、キャッシュ用途としても用いられる。  

---

## Godot

| title | contents |
|-|-|
| No | 0107 |  
| Survey date | 2023/07/15 |  
| Official site | https://godotengine.org |  
| Source code | https://github.com/godotengine/godot |  
| Language | C++ |  
| Category | Game engine |  
| License | MIT |  
| Status | Active |  

2Dと3Dゲームが作れるゲームエンジン。  
WindowsやMac, LinuxだけでなくiOSやAndroidにも対応している。  

---

## Robot Operating System

| title | contents |
|-|-|
| No | 0108 |  
| Survey date | 2023/07/16 |  
| Official site | https://www.ros.org |  
| Source code | https://index.ros.org/repos |  
| Language | C++, Python |  
| Category | middleware |  
| License | Apache 2.0 |  
| Status | Active |  

OSと名が付くが、どちらかというとミドルウェアの部類に属するソフトウェア。  
ハードウェアの制御やIPC、分散処理、リアルタイム通信などを備えている。  

---

## OpenBLAS

| title | contents |
|-|-|
| No | 0109 |  
| Survey date | 2023/07/17 |  
| Official site | https://www.openblas.net |  
| Source code | https://github.com/xianyi/OpenBLAS |  
| Language | C, Fortran |  
| Category | Math library |  
| License | BSD-3 |  
| Status | Active |  

BLASという数値線形代数の関数を定義するAPIのオープンソースの実装。  
手作業で各プラットフォームに最適化されている。  

---

## LAPACK

| title | contents |
|-|-|
| No | 0110 |  
| Survey date | 2023/07/18 |  
| Official site | https://www.netlib.org/lapack |  
| Source code | https://github.com/Reference-LAPACK/lapack |  
| Language | Fortran, C |  
| Category | Math library |  
| License | BSD-new |  
| Status | Active |  

 数値線形代数の数値解析ライブラリで、BLASを元に開発されている。  
 線型方程式や線型最小二乗問題、固有値問題、特異値問題等が演算できる。  

---

## wezterm

| title | contents |
|-|-|
| No | 0111 |  
| Survey date | 2023/07/19 |  
| Official site | https://wezfurlong.org/wezterm |  
| Source code | https://github.com/wez/wezterm |  
| Language | Rust |  
| Category | Terminal |  
| License | MIT |  
| Status | Active |  

Rustで作られたGPUアクセラレーターを搭載したクロスプラットフォームなターミナルエミュレータ。  
精力的に開発されており、様々な機能が搭載されている。  

---

## CLISP

| title | contents |
|-|-|
| No | 0112 |  
| Survey date | 2023/07/20 |  
| Official site | https://clisp.sourceforge.io |  
| Source code | http://git.savannah.gnu.org/cgit/gcl.git |  
| Language | Common lisp, C |  
| Category | Compiler |  
| License | GPL v2 |  
| Status | Active |  

Common Lispの実装の一つであり、様々なプラットフォームに移植されている。  
インタプリタとコンパイラの両方を含んでいる。  

---

## libpng

| title | contents |
|-|-|
| No | 0113 |  
| Survey date | 2023/07/21 |  
| Official site | http://www.libpng.org/pub/png/libpng.html |  
| Source code | https://github.com/glennrp/libpng |  
| Language | C |  
| Category | Graphics library |  
| License | libpng license |  
| Status | Active |  

PNGのエンコード・デコードを行うライブラリ。  
様々なプラットフォームをサポートしており、幅広く使われている。  

---

## libjpeg-turbo

| title | contents |
|-|-|
| No | 0114 |  
| Survey date | 2023/07/22 |  
| Official site | https://libjpeg-turbo.org |  
| Source code | https://github.com/libjpeg-turbo/libjpeg-turbo |  
| Language | C |  
| Category | Graphics library |  
| License | libjpeg-turbo Licenses |  
| Status | Active |  

JPEGのエンコード・デコードを行うライブラリ。  
SIMD命令に対応し、オリジナルのlibjpegより高速化している。  

---

## Eye of GNOME

| title | contents |
|-|-|
| No | 0115 |  
| Survey date | 2023/07/23 |  
| Official site | https://help.gnome.org/users/eog/stable/commandline.html |  
| Source code | https://gitlab.gnome.org/GNOME/eog |  
| Language | C |  
| Category | Image viewer |  
| License | GPL2.0 |  
| Status | Active |  

PNGやJPEG、GIF、BMP、TIFF、WebpやAVIF等の様々な画像フォーマットの表示に対応した画像ビューワー。  
Exifの表示にも対応している。  

---

## libwebp

| title | contents |
|-|-|
| No | 0116 |  
| Survey date | 2023/07/24 |  
| Official site | https://developers.google.com/speed/webp  |  
| Source code | https://chromium.googlesource.com/webm/libwebp |  
| Language | C |  
| Category | Image library |  
| License | BSD-3 |  
| Status | Active |  

Webpのエンコード・デコードを行うライブラリ。  
WebPイメージの閲覧やmux、アニメーション作成のためのツールも備える。  

---

## ImHex

| title | contents |
|-|-|
| No | 0117 |  
| Survey date | 2023/07/25 |  
| Official site | https://imhex.werwolv.net |  
| Source code | https://github.com/WerWolv/ImHex |  
| Language | C++ |  
| Category | Hex editor |  
| License | GPL2.0 |  
| Status | Active |  

多機能なクロスプラットフォームバイナリエディタ。  
正規表現によるパターンマッチングや動的な構造体を定義などができる。  

---

## libavif

| title | contents |
|-|-|
| No | 0118 |  
| Survey date | 2023/07/26 |  
| Official site | https://github.com/AOMediaCodec/libavif |  
| Source code | https://github.com/AOMediaCodec/libavif |  
| Language | C |  
| Category | Graphics library |  
| License | Apache2.0 |  
| Status | Active |  

次世代の画像圧縮アルゴリズムであるAVIFのリファレンス実装。  
コーディックライブラリをlibaomやdav1d、libgav1などに変更することができる。  

---

## OpenVDB

| title | contents |
|-|-|
| No | 0119 |  
| Survey date | 2023/07/27 |  
| Official site | https://www.openvdb.org |  
| Source code | https://github.com/AcademySoftwareFoundation/openvdb |  
| Language | C++ |  
| Category | Software library |  
| License | MPL2.0 |  
| Status | Active |  

sparse volumetricデータを扱うためのソフトウェアライブラリ。  
長編映画制作で一般的なボリューメトリック・アプリケーションに使用されている。  

---

## xv6

| title | contents |
|-|-|
| No | 0120 |  
| Survey date | 2023/07/28 |  
| Official site | https://pdos.csail.mit.edu/6.828/2016/xv6.html |  
| Source code | https://github.com/mit-pdos/xv6-public |  
| Language | C |  
| Category | OS |  
| License | MIT |  
| Status | Active |  

Version 6 Unixをx86向けに再実装した教育用OS。  
ソースコードをPDFにプリントアウトする機能があり、102ページに収まる。  

---

## xv6-riscv

| title | contents |
|-|-|
| No | 0121 |  
| Survey date | 2023/07/29 |  
| Official site | https://pdos.csail.mit.edu/6.S081/2020/xv6.html |  
| Source code | https://github.com/mit-pdos/xv6-riscv |  
| Language | C |  
| Category | OS |  
| License | MIT |  
| Status | Active |  

xv6をRISC-V向けに再実装した教育用OS。  
現在はこちらがメイン。  

---

## DVC

| title | contents |
|-|-|
| No | 0122 |  
| Survey date | 2023/07/30 |  
| Official site | https://dvc.org |  
| Source code | https://github.com/iterative/dvc |  
| Language | Python |  
| Category | Data |  
| License | Apache2.0 |  
| Status | Active |  

Gitで管理がしにくい機械学習のモデルやデータファイルなどのサイズがデカイファイルをGitで管理しやすくする。  
パブリッククラウドやセルフホストしたファイルサーバーなどが使える。  

---

## Tree-sitter

| title | contents |
|-|-|
| No | 0123 |  
| Survey date | 2023/07/31 |  
| Official site | https://tree-sitter.github.io/tree-sitter |  
| Source code | https://github.com/tree-sitter/tree-sitter |  
| Language | Rust, C |  
| Category | Parser |  
| License | MIT |  
| Status | Active |  

様々な言語の構文解析が出来るライブラリ。  
NeovimやEmacsなどにも採用されている。  

---

## Vim

| title | contents |
|-|-|
| No | 0124 |  
| Survey date | 2023/08/01 |  
| Official site | https://www.vim.org |  
| Source code | https://github.com/vim/vim |  
| Language | Vim Script, C |  
| Category | Text editor |  
| License | Vim license |  
| Status | Active |  

CUIで動作するテキストエディタで全ての操作をキーボードで行える。  
プラグイン等で拡張もでき、プログラマーなどに人気が高い。  

---

## Neovim

| title | contents |
|-|-|
| No | 0125 |  
| Survey date | 2023/08/02 |  
| Official site | https://neovim.io |  
| Source code | https://github.com/neovim/neovim |  
| Language | Vim Script, C, Lua |  
| Category | Text editor |  
| License | Apache2.0 |  
| Status | Active |  

Vimから派生したテキストエディタ。  
Luaスクリプトの使用非同期のジョブ管理などモダンな機能が豊富に取り入れられている。  

---

## Emacs

| title | contents |
|-|-|
| No | 0126 |  
| Survey date | 2023/08/03 |  
| Official site | https://www.gnu.org/software/emacs |  
| Source code | https://git.savannah.gnu.org/cgit/emacs.git |  
| Language | Emacs lisp, C |  
| Category | Text editor |  
| License | GPL3.0 |  
| Status | Active |  

Vimと並ぶUnixにおける代表的なテキストエディタ。  
拡張性が優れており、テキストエディタの枠に収まらずIDEとやメールクライアントはては[航空交通管制にも](https://ezoeryou.github.io/blog/article/2022-11-09-emacs.html)にも使われていた。  

---

## GDB

| title | contents |
|-|-|
| No | 0127 |  
| Survey date | 2023/08/04 |  
| Official site | https://www.sourceware.org/gdb |  
| Source code | https://sourceware.org/git/binutils-gdb.git |  
| Language | C, C++, Python |  
| Category | Debugger |  
| License | GPL3.0 |  
| Status | Active |  

プログラム実行中に変数の値の変更や追跡、関数の呼び出しなどを行えるデバッガー。  
C言語にとどまらずC++やGo、Rustといった他のシステムプログラミング言語にも対応している。  

---

## LLDB

| title | contents |
|-|-|
| No | 0128 |  
| Survey date | 2023/08/05 |  
| Official site | https://lldb.llvm.org |  
| Source code | https://github.com/llvm/llvm-project |  
| Language | C++ |  
| Category | Debugger |  
| License | Apache2.0 |  
| Status | Active |  

LLVMプロジェクトが開発を行うデバッガー。  
Pythonで扱うことも出来る。  

---

## rtx

| title | contents |
|-|-|
| No | 0129 |  
| Survey date | 2023/08/06 |  
| Official site | https://github.com/jdxcode/rtx |  
| Source code | https://github.com/jdxcode/rtx |  
| Language | Rust |  
| Category | Runtime manager |  
| License | MIT |  
| Status | Active |  

様々な言語の実行環境のバージョンを管理できるマネージャー。  
asdfと互換性があり、asdfよりも数十倍高速化されている。  

---

## starship

| title | contents |
|-|-|
| No | 0130 |  
| Survey date | 2023/08/07 |  
| Official site | https://starship.rs |  
| Source code | https://github.com/starship/starship |  
| Language | Rust |  
| Category | Shell prompt |  
| License | ISC |  
| Status | Active |  

クロスプラットフォームなシェルプロンプトをカスタマイズするソフトウェア。  
綺麗で見栄えのあるシェルプロンプトが簡単に実現できる。  

---

## fish

| title | contents |
|-|-|
| No | 0131 |  
| Survey date | 2023/08/08 |  
| Official site | https://fishshell.com |  
| Source code | https://github.com/fish-shell/fish-shell |  
| Language | C++, Rust, Shell |  
| Category | Unix shell |  
| License | GPL2.0 |  
| Status | Active |  

デフォルトの設定でコマンドが補完されたりシンタックスハイライトが効いたりするユーザーフレンドリーなシェル。  
テーマの変更もブラウザからGUIで行うことができ、簡単にカスタマイズができる。  

---

## wavedrom

| title | contents |
|-|-|
| No | 0132 |  
| Survey date | 2023/08/09 |  
| Official site | https://wavedrom.com |  
| Source code | https://github.com/wavedrom/wavedrom |  
| Language | JavaScript |  
| Category | Chart |  
| License | MIT |  
| Status | Active |  

JSONで記述したテキストからタイミングチャートを生成するツール。  
VSCodeに拡張機能もあり、リアルタイムでチャートが作れる。  

---

## Z shell

| title | contents |
|-|-|
| No | 0133 |  
| Survey date | 2023/08/10 |  
| Official site | https://www.zsh.org |  
| Source code | https://sourceforge.net/projects/zsh |  
| Language | C |  
| Category | Unix shell |  
| License | MIT |  
| Status | Active |  

POSIX互換なシェルで、数多くの機能を持つ。  
macではデフォルトのターミナルとして採用されている。  

---

## GNU Privacy Guard

| title | contents |
|-|-|
| No | 0134 |  
| Survey date | 2023/08/11 |  
| Official site | https://www.gnupg.org |  
| Source code | https://dev.gnupg.org/source/gnupg |  
| Language | C |  
| Category | OpenPGP |  
| License | GPL3.0 |  
| Status | Active |  

OpenPGPに準拠した暗号化ソフトウェア。  
多くのOSに含まれており、電子メールクライアントなどにも搭載される。  

---

## Make

| title | contents |
|-|-|
| No | 0135 |  
| Survey date | 2023/08/12 |  
| Official site | https://www.gnu.org/software/make |  
| Source code | https://git.savannah.gnu.org/cgit/make.git |  
| Language | C |  
| Category | Build tool |  
| License | GPL3.0 |  
| Status | Active |  

複数のファイル間の依存関係を解決しながらビルドを行うツール。  
タイムスタンプを参照して前回のビルドより更新が行われていない場合はビルドを行わない。  

---
