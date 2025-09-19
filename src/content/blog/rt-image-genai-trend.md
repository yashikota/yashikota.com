---
title: OSSなリアルタイム画像生成AIの動向
pubDate: 2025-09-16
updDate: 
isUnlisted: false
category: tech
tags: ["LLM"]
showToc: true
---


基盤モデル(いわゆる`Stable Diffusion`みたいなやつ)は**いじらず**に、パイプラインの工夫やキャッシュの改良、演算回数を削減したり使いまわしたりすることで、リアルタイムに生成します。  

おそらく一番有名なのは[StreamDiffusion](https://arxiv.org/abs/2312.12491)だと思います。  


(長らくarxivだけで公開されていましたが、[ICCVに採択されたみたい](https://iccv.thecvf.com/virtual/2025/poster/1798)です)
