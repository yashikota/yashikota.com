---
title: "Ollamaでllama-3-youko-8bを使う"
pubDate: 2024-06-26
updDate: 
isUnlisted: false
category: tech
tags: ["llm"]
---

Llama3 8Bに対して日本語データで継続事前学習を行った「Llama3 Youko 8B」をOllamaで使ってみました。  

https://huggingface.co/rinna/llama-3-youko-8b

## GGUFファイルのダウンロード

GGUFフォーマットでは配布されていませんが、有志の方が変換してくれたものがあるので、ありがたく使わせてもらいます。  

https://huggingface.co/mmnga/rinna-llama-3-youko-8b-gguf

量子化の種類はQ1からQ8までたくさんあるのですが、バランスの良いQ4_K_Mを使ってます。  

## Ollamaへの登録

GitHubに詳しいドキュメントがあるのでそれを見ながら記入していきます。  

@[card](https://github.com/ollama/ollama/blob/main/docs/modelfile.md)

一例として私が作成した `Modelfile` を載せておきます。  
SYSTEMの部分は[こちらの記事](https://zenn.dev/tos_kamiya/articles/9d8ce89bb933b1)を参考にしました。  

```txt
FROM ./rinna-llama-3-youko-8b-Q4_K_M.gguf # ダウンロードしたファイルを指定

PARAMETER temperature 0.1 # 高ければ創造的に、低ければ一貫的になる
PARAMETER num_ctx 4096 # コンテキストウィンドウのサイズを4096に

SYSTEM """以下は、タスクを説明する指示です。要求を適切に満たす応答を書きなさい。""""

TEMPLATE """{{ if .System }}{{ .System }}
{{ end }}{{ if .Prompt }}### 指示:
{{ .Prompt }}

{{ end }}### 応答:
"""
```

あとはコマンドを叩くだけです。  

```sh
ollama create youko -f Modelfile
```

**transferring model data** という表示がしばらく続き、最後に **success** と表示されればOKです！  

## 使ってみる

シェルから使う場合は

```sh
ollama run youko
```

で使えます。  
またOpen WebUIというウェブインターフェースもあるのでそちらを使うことも出来ます。  
