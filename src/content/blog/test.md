---
title: "test"
pubDate: 2023-12-29
updDate: 2025-05-28
isUnlisted: true
category: life
tags: ["雑記"]
showToc: true
---

## url preview

https://github.com/octocat/Hello-World

https://github.com/octocat/Hello-World/blob/master/README

https://www.oreilly.co.jp/books/9784873119694

https://www.c-r.com/book/detail/1462

https://asciidwango.jp/post/176293765750/clean-architecture

https://www.shuwasystem.co.jp/book/9784798046143.html

https://www.seshop.com/product/detail/25970

https://www.lambdanote.com/products/cpu

https://gihyo.jp/book/2014/978-4-7741-6753-4

https://www.borndigital.co.jp/book/19115/

https://www.sbcr.jp/product/4815609795/

https://book.mynavi.jp/ec/products/detail/id=22065

https://store-jp.nintendo.com/list/goods/book-music-poster/NSJ_8_B9AAA.html

https://www.kadokawa.co.jp/product/301508001220/

https://book.impress.co.jp/books/1115101145

https://bookplus.nikkei.com/atcl/catalog/03/579100/

https://www.kohgakusha.co.jp/books/detail/978-4-7775-2239-2

https://www.kadokawa.co.jp/product/200600003156/

https://www.amazon.co.jp/dp/4756136591

https://books.rakuten.co.jp/rb/16094948/?l-id=item-r-rank-05

https://store.shopping.yahoo.co.jp/jiasp5/20221218003459-00424us.html

https://www.kinokuniya.co.jp/f/dsg-01-9784756136596

https://booklog.jp/item/1/4274067939

https://honto.jp/netstore/pd-book_01955162.html

https://jp.mercari.com/shops/product/cp6TKKsPueMeXCLDfN675F

https://bookmeter.com/books/148192

https://www.hanmoto.com/bd/isbn/9784910508016

https://item.rakuten.co.jp/gorilla55/tx-701

https://ja.wikipedia.org/wiki/UNIX%E5%93%B2%E5%AD%A6

# 見出し

```
# 見出し1
## 見出し2
### 見出し3
#### 見出し4
```

# 見出し1
## 見出し2
### 見出し3
#### 見出し4

## リスト

- Hello!
- Hola!
  - Bonjour!
  - Hi!

## 番号付きリスト

1. First
2. Second

## テキストリンク

[アンカーテキスト](https://yashikota.com)

## 画像

![](https://storage.googleapis.com/zenn-user-upload/gxnwu3br83nsbqs873uibiy6fd43)

## 画像の横幅を指定する

画像の表示が大きすぎる場合は、URL の後`#○○px`と記述すると、画像の幅を px 単位で指定できます。

```
![altテキスト](https://画像のURL#250px)
```

![alt](https://storage.googleapis.com/zenn-user-upload/gxnwu3br83nsbqs873uibiy6fd43#250px)

## キャプションをつける

![alt](https://storage.googleapis.com/zenn-user-upload/gxnwu3br83nsbqs873uibiy6fd43#350px)
*caption text*

## テーブル

| Head | Head | Head |
| ---- | ---- | ---- |
| Text | Text | Text |
| Text | Text | Text |

## コードブロック

```javascript title="foo.js"
const foo = () => {
    console.log("foo");
};
```

```javascript title="foo.js" mark={5} ins={8} "テキスト"
const foo = () => {
    // コード中の「テキスト」という文字列を強調
    console.log("テキスト");
    console.log("テキスト");
    // この行だけ強調
};
```

```bash
bash
```

## diff のシンタックスハイライト

```diff js
@@ -4,6 +4,5 @@
+    const foo = bar.baz([1, 2, 3]) + 1;
-    let foo = bar.baz([1, 2, 3]);
```

## 数式

$$
e^{i\theta} = \cos\theta + i\sin\theta
$$

## インラインで数式を挿入する

`$a\ne0$`というように`$`ひとつで挟むことで、インラインで数式を含めることができます。たとえば$a\ne0$のようなイメージです。

## 引用

> 引用文
> 引用文

## 注釈

脚注の例[^1]です。

[^1]: 脚注の内容その 1

## 区切り線

---

## インラインスタイル

_イタリック_
**太字**
~~打ち消し線~~
インラインで`code`を挿入する

## インラインのコメント

```html
<!-- コメントテスト -->
```

<!-- コメントテスト -->

## タスクリスト

- [x] #739
- [ ] https://github.com/octo-org/octo-repo/issues/740
- [ ] Add delight to the experience when all tasks are complete :tada:

## アラート

> [!NOTE/ノート]
> Useful information that users should know, even when skimming content.

> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

## 動画

https://pub-382fdd19478344f2bb7643f2f3bc54d3.r2.dev/neko.mp4

## リンクカード

```bash
# URLだけの行
https://zenn.dev/zenn/articles/markdown-guide
```

https://zenn.dev/zenn/articles/markdown-guide

## X（Twitter）のポスト（ツイート）

https://twitter.com/jack/status/20

https://x.com/jack/status/20

### リプライ元のポストを非表示にする

リプライを埋め込んだ場合、デフォルトでリプライ元のポスト含まれて表示されます。`ポストのURL?conversation=none`のようにクエリパラメータに`conversation=none`を指定すると、リプライ元のポストが含まれなくなります。

## YouTube

https://youtu.be/enTFE2c68FQ

https://www.youtube.com/watch?v=enTFE2c68FQ

## ダイアグラム

```mermaid
graph TB
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
```
