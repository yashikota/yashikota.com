---
title: Unicasat Reverse Path ForwardingでDDoS緩和の実証実験
pubDate: 2024-04-14
updDate:
isUnlisted: false
category: tech
tags: ["security", "network"]
showToc: false
---

## DoSとは

DoS(Denial of Service attack, サービス不能攻撃)とは、サーバやネットワークなどのリソースに多量のトラフィックを流して、サービスを妨害する攻撃のこと。  
手法としては、送信元アドレスを攻撃対象のサーバに偽装し、第三者のサーバ(DNSやNTP)を経由してトラフィックの量を増幅させ、大量の応答パケットが攻撃対象に届くようにする。  

## DDoSとは

DoSをDistributed、つまり複数の端末から分散して攻撃を行うとDDoSになる。  
これにより更に大量のトラフィックを集中させ、攻撃を行う。  

## uRPFとは

プロバイダーの対策により詐称IPアドレスからのパケット受信を防ぐ技術にuRPF(Unicast Reverse Path Forwarding)チェックがある。  
uRPFはルータで行うチェックで

1. インターフェースに到着するパケットの送信元アドレスがルーティングテーブルになければ、破棄
2. パケットが到着したインターフェース だけを介して送信元に到達できなければ、破棄

の2つの手法があり、1だけは「緩やかなLooseモード」、1, 2両方は「厳密なstrictモード」となる。  
これにより、送信元が偽装されたパケットをブロックできるためDDoS攻撃を防げる。  

## Demo

uRPFでDDoS攻撃が緩和できる概念実証のデモシステムをCiscoルーターで作成し、実証を行った。  

![topology](https://img.yashikota.com/blog/urpf-demo/topology.avif)

まず、PC2台をルーターを噛まして接続する。  
その後、攻撃側PCを以下に示すコマンドを使用して、IPアドレスを偽造した。なおホストOSはUbuntu20.04である。  

```sh
sudo iptables -t nat -A POSTROUTING -j SNAT --to-source 192.168.2.1
```

この状態で一旦攻撃対象PCにpingを送信すると、偽造されたIPアドレスからパケットが届いていることが分かる。  
その後、ルーターにuRPFを以下のコマンドで設定した。  

```sh
conf t
int Gig0
ip verify unicast source reachable-via rx
```

このコマンドを設定後、Wireshark等のパケットキャプチャーで確認すると、偽造されたIPアドレスからのICMP(ping)が来なくなったことが分かる。  
なお、IPアドレスの偽造を終了するには以下のコマンドを使用する。  

```sh
sudo iptables -t nat -D POSTROUTING -j SNAT --to-source 192.168.2.1
```

以上の手順を踏まえたデモを以下に示す。  

https://youtu.be/RPfOea8lgBo

## 参考文献

https://www.infraexpert.com/study/aclz22.html

https://marsblog.hatenablog.jp/entry/2018/12/26/162252
