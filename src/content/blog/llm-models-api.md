---
title: LLMのモデル一覧を返すAPIを作った
pubDate: 2025-09-23
updDate:
isUnlisted: false
category: tech
tags: ["API"]
showToc: false
---

LLMがかかわるようなWebアプリ作ってて、APIキーをユーザーに入れてもらってモデルを選択してもらうときに常に最新のモデル名をメンテナンスフリーで取得できるようにしたいなと思ったけど、探した感じいい感じのAPIとかなかったので簡単に作ってみました。  

https://llm-models-api.yashikota.workers.dev/models

このエンドポイントにGETリクエスト送ってもらうと全モデルの情報が取得できます。  
といっても中身はOpenRouterのAPIに乗っかってるだけですが、クエリパラメータでフィルタリングできるようにしてあり

- プロバイダー（`openai`, `google`など）やモデル名（`gpt-4`, `gemini-pro`など）、最小コンテキスト長などでフィルタリングできます。  
  - 例) OpenAIとGoogleのモデルのみ: <https://llm-models-api.yashikota.workers.dev/models?provider=openai,google>
- 無料モデルを除外したり、モデルIDからサフィックス（`:free`とか）を取り除いたり、コンテキスト長で絞り込んだりもできます。
  - 例) 32K以上のコンテキストのみ: <https://llm-models-api.yashikota.workers.dev/models?min_context=32000>
