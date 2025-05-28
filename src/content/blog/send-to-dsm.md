---
title: "SynologyのNASからWake On LANを送れるようにしてPCを起動できるようにする"
pubDate: 2024-10-31
updDate: 
isUnlisted: false
category: tech
tags: ["nas", "misc"]
showToc: false
---

外出先で家のPCを使いたくても電源が落ちていると使えないので、Wake On LAN(WoL)を設定することにしました。  
で、WoLを送信する元がそもそも起動していないと意味がないんですけど、幸い24/365稼働しているSynologyのNASが同じLANに存在するのでこれを利用することにしました。  

検索してみると、いくつかWoLを設定する記事が見つかります。  

https://simplelife.pgw.jp/it/synology_diskstation_wake-on-lan

ただ、この方法だとWoLの送信がDSM上のUIからしか操作できないので不便です。  
特にWoLを使いたいタイミングは外出先で更にモバイル端末な事もありえるので、エンドポイントにリクエストを飛ばすことでWoLのパケットを飛ばせるようにしてみました。  

https://github.com/yashikota/wake-on-dsm

といっても簡単なHTMLとPHPで作ったものです。  

HTMLでは起動するPCを選択できるようにしています。  
また、手動でMACアドレスを入力して起動できるようにもしています。  

![1](https://img.yashikota.com/blog/send-to-dsm/1.png)

PHPはこんな感じです。  

```php
<?php

function sendMagicPacket($macAddress, $broadcastIp = '255.255.255.255', $port = 9) {
    $macBinary = pack('H*', str_replace(':', '', $macAddress));
    $packet = str_repeat(chr(0xFF), 6) . str_repeat($macBinary, 16);

    $sock = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
    if (!$sock) {
        return "Error: Could not create socket - " . socket_strerror(socket_last_error());
    }

    if (!socket_set_option($sock, SOL_SOCKET, SO_BROADCAST, 1)) {
        socket_close($sock);
        return "Error: Could not set socket option - " . socket_strerror(socket_last_error());
    }

    $sent = socket_sendto($sock, $packet, strlen($packet), 0, $broadcastIp, $port);
    socket_close($sock);

    if (!$sent) {
        return "Error: Could not send packet - " . socket_strerror(socket_last_error());
    }

    return "Magic packet successfully sent to $macAddress on $broadcastIp:$port";
}

$macAddress = '';

if (isset($_POST['macSelect']) && $_POST['macSelect'] !== 'other') {
    $macAddress = $_POST['macSelect'];
}
elseif (isset($_POST['mac'])) {
    $macAddress = $_POST['mac'];
}

$message = '';

if ($macAddress) {
    $message = sendMagicPacket($macAddress);
} else {
    $message = "Error: No MAC address provided";
}

echo $message;
```

これを `wake.php` として、 `index.html` と同じディレクトリに格納すればOKです。  

あとはNASのほうでサーバーとして立ち上げます。  
SynologyのNASでは[WebStation](https://kb.synology.com/ja-jp/DSM/help/WebStation/application_webserv_virtualhost?version=7)というアプリケーションがあるので、これを使います。  

![2](https://img.yashikota.com/blog/send-to-dsm/2.png)

開くとこんな画面になるので `Apache HTTP Server 2.4` と `PHP 8.0` がインストールされていない場合はインストールしてください。  

あとは スクリプト言語の設定 > PHP > 作成 からカスタマイズプロファイルを作成します。  
この際、拡張から `sockets` を有効にする必要があります。  
あとはこのプロファイルを使って、Webサービスポータルから仮想ホストを作成します。  
Networkはポートベースでポートは任意で、バックエンドはドキュメントルートにプログラムの格納ディレクトリを、HTTPバックエンドサーバーにApacheを、スクリプト言語の設定に先ほど作成したプロファイルを選択すればOKです。  

![3](https://img.yashikota.com/blog/send-to-dsm/3.png)

これを設定後、 `http://{NASのIPアドレス}:{設定したポート番号}` にアクセスすると画面が表示されると思います。  
あとはMACアドレスを入力して、ボタンを押すとパケットが送信されます。  

また、外からでもこれを叩けるようにします。  
WoLを送信するだけなので危険性はそこまでないかもしれないんですが、やはり外部に露出させてしまうとセキュリティ的に危なっかしいので、ポート公開はしません。  
その代わりに、本来はVPNやらなんやらで通信経路を作る必要がありますが、[Tailscale](https://tailscale.com)というめっちゃ便利なVPNを使ったら設定不要でアクセスできるのでオススメです。  
設定方法は割愛します。  

そんな感じで設定した後、スマホからエンドポイントを叩くと無事PCが起動することを確認しました！  
これでどこにいてもPCを起動できので便利です！  
