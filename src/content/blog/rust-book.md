---
title: 実践Rustプログラミング入門を読んだ
pubDate: 2023-02-28
updDate: 
isUnlisted: false
tags: ["Rust", "本"]
---

[実践Rustプログラミング入門](https://www.shuwasystem.co.jp/book/9784798061702.html)
というRustの本を読了したので感想とかいろいろ書いていきます。  

---

## 1章

Rustの良いところとか便利なツールとかが紹介されている。  
Rustは単に安全な言語だけじゃなくてモダンで便利な言語でもあるよって話があったりして良い。  

## 2章

みんな大好き環境構築。  
Cargoが最強すぎる。  

## 3章

いよいよRustの基本文法編。  
Rust独特のOption型とかResult型とか。あとBox型は知らなかった。  
この本は書名の通り開発に重きを置いているので文法の解説は重厚ってわけじゃないので意外とサクサク読めた。  
まあでも1回じゃ理解しきれなかったので複数回読む必要がありそう。  

## 4章

CLIで逆ポーランド記法の電卓作成。  
Cで作ったことあったけど、やっぱり言語標準でスタック構造があると開発が楽やねって思った。  
エラーハンドリングが独特なのとテストがしやすいのが印象的だった。  
余談だけど、anyhowとthiserrorの開発者が一緒って見て凄いなぁってなったけど調べたらserdeとかasync-traitとか開発していてエグってなった。  
あと本では

```rust
use clap::Clap;
```

ってなってるけどバージョンが変わったからかv4.1.6では

```rust
use clap::Parser;

#[derive(Parser, Debug)]
```

としないとエラーがでる。

## 5章

よくあるToDoアプリを作る。  
Webフレームワークとしてactix-webを使っていてSQLライブラリにはr2d2というものを使っている。  
まあでも調べた感じ最近はsqlxっていうライブラリのほうが良さげ？  
あと最近はtokioのチームが作っているaxumとかも勢いがあるらしいのでそっちも使ってみたい。  

ちなみにDistrolessというコンテナイメージを使ったら36.9MBまで削減できた。  

```txt
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
todo-app     latest    71a44657add4   1 hours ago   36.9MB
```

## 6章

早速環境構築でハマった。  
どうやらnode.jsのバージョンが17以上だとだめな模様。voltaを使ってv16.16.0に固定したらいけた。  

238ページのsrc/lib.rsのインポート定義部分のコードに`mod mod login`ってあるけどこれは誤植？エラーになるし…  
[Githubにあるコード](https://github.com/forcia/rustbook/blob/master/ch06/6-2/mandelbrot/src/lib.rs#L1)
みても`mod logic`って書いてるから誤植ぽい。  

ちなみに描画結果はこんな感じ。  

![mandelbrot](/static/images/blog/rust-book/01.png)

あと生成速度の実行結果はこんな感じになった。  

```txt
generate:wasm elapsed::27.700000001117587[ms]
mandelbrot_bg.js:277  draw:wasm elapsed::0.40000000037252903[ms]

index.js:69 wasm only
    mandelbrot_bg.js:277  generate:wasm elapsed::31.300000000745058[ms]
    mandelbrot_bg.js:277  draw:wasm elapsed::0.19999999925494194[ms]
index.js:73 wasm+js
    index.js:86  generate:wasm generate_elapsed:31[ms]
    index.js:87  draw: js draw_elapsed: 1 [ms]
index.js:90 js only
    index.js:103  generate:js generate_elapsed:23[ms]
    index.js:104  draw: js draw_elapsed: 1 [ms]

index.js:116 (wasmResult === jsResult):true
```

Chrome110ではwasmよりjsのほうが速かった  

```txt
generate:wasm generate_elapsed:28390[ms]
index.js:140 average: 28.389[ms]

index.js:157  generate:js generate_elapsed:22070[ms]
index.js:158 average: 22.024[ms]
```

ナンプレの結果  

|言語|問題1[ms]|問題2[ms]|問題3[ms]|問題4[ms]|
|-|-|-|-|-|
|js|1|2|46|97|
|wasm|1|0|0|0|

こちらはwasmが圧勝  
というか0msって計測ミス?ってレベルで速い…  

## 7章

icedというGUIのクレートを使ってGUIプログラミング。  
updateメソッドは書籍では

```rust
fn update(&mut self, message: Self::Message) -> Command<Self::Message>
```

ってなってるけどバージョンが上がったからか

```rust
fn update(&mut self, message: Self::Message, _clipboard: &mut Clipboard)
```

としないとエラーが出る。  
一応
[GitHubにあるコード](https://github.com/forcia/rustbook/blob/master/ch07/7-2/src/main.rs)
では修正されている。

## 8章

組み込み開発。といってもqemuでやるので実機を用意する必要はなし。  
memory.xでメモリアドレス空間を記述したり、build.rsでビルドの設定書いたりしてやっぱ組み込み開発は特別感あるなぁって思ったり。  

## 9章

Rustでの開発を進めるにあたって便利なツールが色々紹介されている章。  
crates.ioで公開されているクレートだけじゃなくてローカルにcloneしてきたクレートのリポジトリを参照して使えるのは便利だなと思った。  

コードカバレッジの章は`cargo install cargo-tarpaulin`とすると以下のエラーが発生した。

```txt
failed to compile `cargo-tarpaulin v0.25.0`, intermediate artifacts can be found at `/tmp/cargo-installi9kfqC`
```

解決しようと思ったけどできなかったので色々探してみると、
[新しいコードカバレッジツールが出ている](https://qiita.com/dalance/items/69e18fe300760f8d7de0)
みたいなのでそれを採用。  

```sh
cargo install cargo-llvm-cov
rustup component add llvm-tools-preview
```

でインストールして

```sh
cargo llvm-cov
```

で実行。すると以下の結果が出てきた(test_abs_neg()追加前)。  

```txt
Filename                                                 Regions    Missed Regions     Cover   Functions  Missed Functions  Executed       Lines      Missed Lines     Cover    Branches   Missed Branches     Cover
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/home/kota/dev/rust-book/samples/coverage/src/lib.rs           8                 1    87.50%           4                 0   100.00%          10                 1    90.00%           0                 0         -
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
TOTAL                                                          8                 1    87.50%           4                 0   100.00%          10                 1    90.00%           0                 0         -
```

ちゃんと計測出来てそう。  

cargo-profilerを入れようとすると  

```txt
error: toolchain 'nightly-x86_64-unknown-linux-gnu' is not installed
```

と怒られてしまったので以下のコマンドで追加

```sh
rustup toolchain install nightly
```

と、こんなエラーが…

```txt
error: Regex error -- please file a bug. In bug report, please include the original output file from profiler, e.g. from valgrind --tool=cachegrind --cachegrind-out-file=cachegrind.txt
```

[かなり初期からあるissue](https://github.com/svenstaro/cargo-profiler/issues/8)
でも解決してなさそうな問題なので意外とやっかいなものかも？  

```txt
WARNING: perf not found for kernel 5.19.0-32

  You may need to install the following packages for this specific kernel:
    linux-tools-5.19.0-32-generic
    linux-cloud-tools-5.19.0-32-generic

  You may also want to install one of the following packages to keep up to date:
    linux-tools-generic
    linux-cloud-tools-generic
failed to sample program
```

linux-tools-genericとlinux-cloud-tools-genericを入れてみたけど変わらず…  
結局解決できなかったので飛ばした。  

## 10章

バイナリサイズの最適化ではhelloが4.0Mで、stripする前は1.6M、手元の環境では267KBになった。  
最適化レベルのzはnightlyでないと`error: the option Z is only accepted on the nightly compiler`と怒られるので、

```sh
rustup install nightly
rustup default nightly
```

でnightlyで実行するように。  

## 11章

マクロやFFI、パニック、unsafeなどの詳しい話がのっている章。  
Rustを使いこなそうとするとここの話は避けて通れないので何回も読み直してしっかり理解したいところ。  

Rustのエディションはバージョンが違ったら互換性がないと思って良いのかな？  
Rustは将来的にも互換性を約束するみたいなことを聞いた気がするからどっちなんだろ。  

---

## おわりに

2020年の9月に出た本なので少し古いですが、Rustの基礎と実践的な開発を進めていく上では特に問題ないと思います。  
基礎文法だけじゃなくてもっと実践的な開発の知識、方法を知りたい方にはおすすめです。  
なのでしっかりとRustの基礎文法を固めたい方は他の本をおすすめします(読んでないけどオライリーの本が良さげ？)。  
まあ基礎文法固める本を読みつつこの本やれば一番力になると思います。  
次はRustで4bit CPUのエミュレーター作るかESP32のコードをRustで書いてみるかをやっていきたいです。  
