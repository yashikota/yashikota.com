---
title: Minecraftサーバーに入退出した人を検知して通知するDiscordのbotを作成した
pubDate: 2023-02-07
updDate: 
isUnlisted: false
category: tech
tags: ["ゲーム"]
---

Minecraftサーバーに入退出した人を検知してDiscordに通知するbotを作成したのでそのプログラムを解説していきます。  
リポジトリは
[こちら](https://github.com/yashikota/minecraft-server-bot)
です。  
なおMinecraftサーバーの建て方は
[こちらの記事](https://yashikota.com/blog/minecraft-server)
で解説しています。  

## ログを解析する

サーバーはnohupコマンドで起動しているので実行中のログはnohup.outファイルに格納されています。  
それをPythonでいい感じにパースしています。  

ログインはログインした人のアカウント名とIPアドレスがくっついて出力されるので正規表現で削除するようにしています。  
あとは内包表記で該当箇所だけを抽出してリストで返却しています。  

```py
def get_logged_in_user():
    file_path = "../mc/nohup.out"
    regex = r"\[\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}\]"
    with open(file_path, "r") as f:
        return [re.sub(regex, "", (line.split(" ")[4])) for line in f if "logged in with entity" in line]
```

ログアウトはシンプルに名前だけなのでもっと単純に該当箇所だけを抽出して返却しています。  

```py
def get_logged_out_user():
    file_path = "../mc/nohup.out"
    with open(file_path, "r") as f:
        return [line.split(" ")[4] for line in f if "left the game" in line]
```

現在プレイしているプレイヤーはログインしたプレイヤーからログアウトしたプレイヤーを引けば出来ますが、Pythonでは単純にリスト同士の引き算が出来ないので標準ライブラリのcollectionsにあるCounterクラスを使っています。  

```py
def get_active_user():
    return list(Counter(get_logged_in_user()) - Counter(get_logged_out_user()))
```

## botを作成する

ログの分析ができたのでbotを作成していきます。  
今回はDiscordを使ってbotを作るのでdiscord.pyを使います。  

botが導入されたサーバーでlogin, logout, activeいずれかのコマンドが入力された場合は適切なメッセージ返すようにしています。  

```py
@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith("login"):
        await message.channel.send(", ".join(lib.get_logged_in_user()))

    if message.content.startswith("logout"):
        await message.channel.send(", ".join(lib.get_logged_out_user()))

    if message.content.startswith("active"):
        if len(user := lib.get_active_user()) == 0:
            await message.channel.send("サーバーに誰もいません")
        else:
            await message.channel.send(f"現在プレイしているのは {', '.join(user)} です")
```

ただ、いちいちコマンドを打ってプレイヤーがいるかどうか確認するのも面倒くさいのでアクティブユーザーを定期的に確認してプレイヤー数の増減があれば自動で通知してくれる機能も作りました。  

とはいってもdiscord.pyの標準機能にあるtask.loopを利用して監視しているだけです。  

```py
@tasks.loop(seconds=5)
async def check_active_user():
    channel = client.get_channel(int(CHANNEL_ID))
    previous_active_user = lib.get_active_user()
    await asyncio.sleep(5)
    now_active_user = lib.get_active_user()

    if previous_active_user != now_active_user:
        if len(previous_active_user) < len(now_active_user):
            await channel.send(f"{lib.get_logged_in_user()[-1]} がログインしました")
        else:
            await channel.send(f"{lib.get_logged_out_user()[-1]} がログアウトしました")
        if len(now_active_user) == 0:
            await channel.send("サーバーに誰もいません")
        else:
            await channel.send(f"現在プレイしているのは {', '.join(now_active_user)} です")
```

## 動作

動作するとこのような感じです。  

![bot](/static/images/minecraft-bot.png)
