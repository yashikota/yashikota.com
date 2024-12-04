---
title: CRAFTING INTERPRETERSをやるアドカレ
pubDate: 2024-12-01
updDate: 
isUnlisted: false
category: tech
tags: ["インタプリタ", "アドベントカレンダー"]
---

[CRAFTING INTERPRETERS](https://craftinginterpreters.com/contents.html)というインタプリタの作り方が無料で知れちゃう教材があります。(ただし英語)  
現在、この教材をもとにして勉強会を主催してるんですが、なかなか実装できていないのでアドベントカレンダーに便乗して1日1章ずつ実装していこうという個人アドカレです。  
30章あるので、アドカレの期限を少し超えて12/30まで頑張ります。  

## 1章

導入部分。  
今回作るインタプリタはJavaとCで実装することや、yacc, bison等を使わずに全部自作することが説明されている。  
あと注釈にちらっと書いていた[カリー＝ハワード同型対応](https://ja.wikipedia.org/wiki/%E3%82%AB%E3%83%AA%E3%83%BC%EF%BC%9D%E3%83%8F%E3%83%AF%E3%83%BC%E3%83%89%E5%90%8C%E5%9E%8B%E5%AF%BE%E5%BF%9C)というのを初めて知った。  
プログラミング言語の理論と数学が直接的に対応関係があるとのことで、そらそうと言われたらそうかも知れないけど面白いなと思った。  
しかもそれを[哲学的に考える](https://ocw.kyoto-u.ac.jp/wp-content/uploads/2021/04/2010_tetsugakukisobunkaseminar-2_05.pdf)こともやっているらしく興味深かった。  

## 2章

この章はインタプリタの全容を知れる部分。  
といってもよくある 字句解析 → 構文解析 → 意味解析 → 最適化 → コード生成 という流れ。  

IRにもいくつかの形式があるらしく、これはこれで面白そうと思ったり。  

https://ja.wikipedia.org/wiki/%E5%88%B6%E5%BE%A1%E3%83%95%E3%83%AD%E3%83%BC%E3%82%B0%E3%83%A9%E3%83%95

https://ja.wikipedia.org/wiki/%E9%9D%99%E7%9A%84%E5%8D%98%E4%B8%80%E4%BB%A3%E5%85%A5

https://ja.wikipedia.org/wiki/%E7%B6%99%E7%B6%9A%E6%B8%A1%E3%81%97%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB

https://ja.wikipedia.org/wiki/3%E7%95%AA%E5%9C%B0%E3%82%B3%E3%83%BC%E3%83%89

コード最適化についても説明があった。今回は特に最適化はやらないらしい。  
詳しい最適化については以下のページが詳しかった。  

https://www.hpcs.cs.tsukuba.ac.jp/~msato/lecture-note/comp-lecture/note11.html

また、cloxではC言語でVMを作ってどのプラットフォームでも実行できるようにするとのこと。面白そう。  

## 3章

Lox言語の仕様について解説した章。  
C言語風だが動的型付けでJSっぽさもある。  

海外では実引数を引数、仮引数をパラメータと言うらしくびっくりした。一応日本語と同じ用に呼ぶ流派もあるみたいだけど、これに関しては日本語の呼び方がわかりやすいなぁと。  

クロージャをサポートしているのが不思議というか謎。筆者の好みなんだろうか。  

あとクラスをサポートしているのが良い。  
[低レイヤを知りたい人のためのCコンパイラ作成入門](https://www.sigbus.info/compilerbook)もやったんだけど、残念ながらクラスは出てこなかったから知りたかった。  

次回からコードを書き始めるらしい。がんばるぞ。  

## 4章

今日から実装していく日々の始まり。  
といってもWebサイトで完全に動くコードが提示されているのでコピペはできる。  
写経しても結局脳死で丸写しだし、時間がかかるし、タイポするので今回はコピペメインでやろうかなと。  
というわけで軽く実装する内容の紹介。  

```java
public class Lox {
  public static void main(String[] args) throws IOException {
    if (args.length > 1) {
      System.out.println("Usage: jlox [script]");
      System.exit(64); 
    } else if (args.length == 1) {
      runFile(args[0]);
    } else {
      runPrompt();
    }
  }
}
```

jloxはファイルからの入力はもちろん、REPLとしても使える。  

```java
  static void error(int line, String message) {
    report(line, "", message);
  }

  private static void report(int line, String where,
                             String message) {
    System.err.println(
        "[line " + line + "] Error" + where + ": " + message);
    hadError = true;
  }
```

エラーハンドリングも行数を教えて指摘してくれる。  

```java
  private void scanToken() {
    char c = advance();
    switch (c) {
      case '(': addToken(LEFT_PAREN); break;
      case ')': addToken(RIGHT_PAREN); break;
      case '{': addToken(LEFT_BRACE); break;
      case '}': addToken(RIGHT_BRACE); break;
      case ',': addToken(COMMA); break;
      case '.': addToken(DOT); break;
      case '-': addToken(MINUS); break;
      case '+': addToken(PLUS); break;
      case ';': addToken(SEMICOLON); break;
      case '*': addToken(STAR); break; 
    }
  }
```

字句解析部分はemunで定義したトークンを元に愚直に場合分けする。  
この際使用している `advance()` は1文字消費して文字を取得するメソッド。  

```java
  private char advance() {
    return source.charAt(current++);
  }
```

後に必要になるが、文字を消費しない `peek()` というメソッドもある。  

```java
  private char peek() {
    if (isAtEnd()) return '\0';
    return source.charAt(current);
  }
```

演算子はトークンを取得したあと、更に1文字進めてみて `!` か `!=` どうかのように判定する。  

```java
      case '!':
        addToken(match('=') ? BANG_EQUAL : BANG);
        break;
      case '=':
        addToken(match('=') ? EQUAL_EQUAL : EQUAL);
        break;
      case '<':
        addToken(match('=') ? LESS_EQUAL : LESS);
        break;
      case '>':
        addToken(match('=') ? GREATER_EQUAL : GREATER);
        break;
```

```java
  private boolean match(char expected) {
    if (isAtEnd()) return false;
    if (source.charAt(current) != expected) return false;

    current++;
    return true;
  }
```

`/` が出てきても除算なのかコメントなのか1文字じゃわからないので1つ進めて見てみる。  
Pythonとかみたいに `#` をコメントにしても良さそうと思ったり。  

```java
      case '/':
        if (match('/')) {
          // A comment goes until the end of the line.
          while (peek() != '\n' && !isAtEnd()) advance();
        } else {
          addToken(SLASH);
        }
        break;
```

あとは空白を読み飛ばしたり、改行で行数のカウントを増やしたり。  

```java
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break;

      case '\n':
        line++;
        break;
```

jloxでは数値型を全部doubleとして扱うらしいので、 `c >= '0' && c <= '9'` で true なやつがここでパースされる。  

```java
  private void number() {
    while (isDigit(peek())) advance();

    // Look for a fractional part.
    if (peek() == '.' && isDigit(peekNext())) {
      // Consume the "."
      advance();

      while (isDigit(peek())) advance();
    }

    addToken(NUMBER,
        Double.parseDouble(source.substring(start, current)));
  }
```

文字も予約後と衝突しないか確認するためにトークンを全部見て確認する。  

```java
  private void identifier() {
    while (isAlphaNumeric(peek())) advance();

    addToken(IDENTIFIER);
  }
```

という感じで字句解析を一通り？やって4章は終わり。  
次は構文木とかのお話。  

## 5章



## 6章



## 7章



## 8章



## 9章



## 10章



## 11章



## 12章



## 13章



## 14章



## 15章



## 16章



## 17章



## 18章



## 19章



## 20章



## 21章



## 22章



## 23章



## 24章



## 25章



## 26章



## 27章



## 28章



## 29章



## 30章
