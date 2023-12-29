---
title: AtCoder Beginner Contestの開催情報を通知するBotを作った
pubDate: 2023-01-12
updDate: 
isUnlisted: false
tags: ["技術解説"]
---

タイトルの通り
[AtCoder Beginner Contest](https://atcoder.jp/)
の開催1時間前にDiscordで通知してくれるBotを作成したので適当に解説していきます。  
ちなみに自分専用のBotなので公開したりはしないです。  

# 次に開催されるコンテストの情報を取得する

[リポジトリはこちらです](https://github.com/yashikota/abc-latest-api)  

まずはコンテストの情報を取得することには始まりません。  
というわけで公式のAPIを探してみたんですが無さそうなんで野良APIを探してみます。  
それで最初は
[AtCoder Problems API](https://github.com/kenkoooo/AtCoderProblems/blob/master/doc/api.md)
を使おうかなと思ったのですが、開催済みのコンテストの情報しか載っていなかったので断念。  
結局良い感じのAPIが見つからなかったので、自分でスクレイピングすることにしました。  

スクレイピングといえばPythonですが、今回は
[Deno](https://deno.land/)
を使うことにしました。  
理由はDenoを使ってみたかった、それだけです😉  

Denoのライブラリで
[deno_dom](https://deno.land/x/deno_dom)
というものがあったのでこれを利用してDOMからよしなに情報を抽出していきます。  

```ts
const doc = new DOMParser().parseFromString(html, "text/html");
// DOMを取得
const times = doc.querySelectorAll(".m-list_contest_info .time");
const titles = doc.querySelectorAll(".m-list_contest_ttl");
const links = doc.querySelectorAll(".m-list_contest_ttl a");
```

時刻表記が```2022-12-17 21:00:00+0900```と、ISO 8601に近い形式ですがこのままユーザーに提示しても分かりにくいので、JSTに変換しました。  
変換により```2022/12/17 21:00:00```という形式になります。  

```ts
// timesの表記が「2022-12-17 21:00:00+0900」のようになっているので、JSTに変換
for (let i = 0; i < times.length; i++) {
  const time = times[i].textContent.replace("開始", "");
  const date = new Date(time);
  const jst = date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  times[i].textContent = jst;
}
```

単にスクレイピングするだけでは複数のコンテストの情報が取れちゃうので、日付順にソートして最初のものだけを取得することで、一番直近に開催されるコンテストのみを取得しています。  

```ts
// 2次元配列として格納
const contestsList = [];
for (let i = 0; i < times.length; i++) {
  const time = times[i].textContent.replace(/[\n\t\r]/g, "");
  const title = titles[i].textContent.replace(/[\n\t\r]/g, "");
  const link = url + links[i].getAttribute("href");
  contestsList.push([time, title, link]);
}

// Beginnerが含まれるコンテストのみを抽出し、開催時刻が最新のものだけを取得
const latestAbc = (contestsList.filter((contest) =>
  contest[1].includes("Beginner")
))[0];
```

次に開催情報をWeb APIとして提供するのですが、Denoでは標準ライブラリに
[HTTPサーバーを構築するAPI](https://deno.land/std@0.154.0/http/server.ts)
があるのでこれを利用していきます。  
ちなみにNode.jsの4倍ぐらいの速さらしいです。凄い。  

こっちは単にGETリクエストが飛んできたらJSONでレスポンスを返すだけの単純なものです。  
GETじゃなかったら404を返します。  

```ts
const handler = async (req: Request) => {
  const latestAbc: any = await getLatestAbc();

  if (req.method === "GET") {
    return new Response(
      JSON.stringify({
        start: latestAbc[0],
        title: latestAbc[1],
        url: latestAbc[2],
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      },
    );
  } else {
    return new Response("Not Found", {
      status: 404,
    });
  }
};
```

実際にAPIを叩いてみるとこんな感じでレスポンスが帰ってきます。  

```json
{"start":"2023/1/15 21:00:00","title":"AtCoder Beginner Contest 285","url":"https://atcoder.jp/contests/abc285"}
```

これでコンテストの情報の取得は完了です。  

## Discordでコンテストの開催1時間前に情報を通知するBotを作る

[リポジトリはこちらです](https://github.com/yashikota/abc-latest-bot)

こちらも最初はDenoで作ろうと思ってたのですが、どうやらDeno Deployがcronに対応していないらしく、定期的な実行が無理でした。  
今回作るBotでは1時間ごとに動作させ、開催1時間前かどうかを判定しているため、定期的に動作させる仕組みが不可欠です。  
次にcronが実装されている
[Cloudflare Workers](https://workers.cloudflare.com/)
を試してみました。  
こちらはJS/TSのみならずRustやC、Python、Kotlin、なんとCobol[^1]までサポートしています[^2]。  

[^1]:Wasmに変換して使うらしいです。でも使う人いるのかな🤔?
[^2]:[サポートしている言語の一覧はこちら](https://developers.cloudflare.com/workers/platform/languages/)

で、折角なのでRustで挑戦してみることにしました。  
ほぼ初書きなので文法や型に苦しめられながらもコンテストの情報を取得することが出来ました。  

```rust
fn fetch_contest_info() -> serde_json::Value {
let url = "https://abc-latest.deno.dev/";
    let res = ureq::get(url)
        .set("Accept", "application/json")
        .call();
    let res = res.unwrap();
    let body = res.into_string().unwrap();
    let body: serde_json::Value = serde_json::from_str(&body).unwrap();
    body
}
```

RustでHTTPクライアントとしては
[reqwest](https://github.com/seanmonstar/reqwest)
とかが有名らしいですけど、今回はfetchしたいだけなので、reqwestより軽量な
[ureq](https://github.com/algesten/ureq)
を使うことにしました。  

上のコードではfetchしたJSONをserdeでStringに変換しています。  

また、現在時刻とコンテストの開催日時を取得する関数も作成しました。  

```rust
fn get_now_time() -> String {
    let time_difference = 9;
    let hour = 3600;
    FixedOffset::east_opt(time_difference * hour)
        .unwrap()
        .from_utc_datetime(&chrono::Utc::now().naive_utc())
        .format("%Y/%m/%d %H:%M:%S")
        .to_string()
}

fn get_contest_time() -> String {
    let body = fetch_contest_info();
    let contest_time = body["start"].as_str().unwrap();
    contest_time.to_string()
}
```

rustでは通常標準ライブラリに含まれるような機能(乱数や時刻など)もコミュニティ主導の開発に任せるという文化があるらしく、時刻の取得も
[chrono](https://github.com/chronotope/chrono)
というライブラリが事実上の標準ライブラリとして用いられているそうです[^3]。  

[^3]:余談ですが、このライブラリの名前を聞いたときにクロノ・トリガーを連想してしまって頭から離れなくなったので、風の憧憬を流しながら作業していました😄

あとはコンテスト開催時刻から現在時刻を引いて、1時間を切っているかどうかを判定する関数を作成しました。  
最後の行ですが、単に```duration < Duration::hours(1)```としてしまうとマイナス(現在時刻がコンテスト開催時刻を過ぎた状態)になってもTrueが返ってくるのでちゃんと```duration > Duration::hours(0)```の条件も付ける必要があります。  

```rust
pub fn is_one_hour_before_the_contest() -> bool {
    let contest_time = get_contest_time();
    let now_time = get_now_time();
    let contest_time = NaiveDateTime::parse_from_str(&contest_time, "%Y/%m/%d %H:%M:%S").unwrap();
    let now_time = NaiveDateTime::parse_from_str(&now_time, "%Y/%m/%d %H:%M:%S").unwrap();
    let duration = contest_time - now_time;
    duration < Duration::hours(1) && duration > Duration::hours(0)
}
```

これで開催1時間前かどうかを判定することができたのでいよいよDiscordBotの作成に取り掛かっていくのですが！！！  
ここで大きな問題が…   
RustでDiscordBotを作ろうとすると
[Serenity](https://github.com/serenity-rs/serenity)
というライブラリを使うのですが、これがWasmに対応していない😭  
Wasmに対応しないとCloudflare Workersで動かせないので泣く泣く断念しました…  
仕方がないのでCircle CIというCIサービスを使って開発することにしました。  

今回作成するBotは1時間前になったら特定のチャンネルに通知するだけの至極単純なものなので、ほぼ
[公式のexample](https://github.com/serenity-rs/serenity/blob/current/examples/e01_basic_ping_bot/src/main.rs)
の通りです。  

```rust
async fn ready(&self, ctx: Context, ready: Ready) {
    println!("{} is connected!", ready.user.name);
    let channel_id_number: u64 = env::var("CHANNEL_ID").unwrap().parse().unwrap();
    let channel_id = ChannelId(channel_id_number);
    if contest::is_one_hour_before_the_contest() {
        if let Err(why) = channel_id.say(&ctx.http, contest::get_contest_info()).await {
            println!("Error sending message: {:?}", why);
        }
    } else {
        println!("Not 1 hour before the contest");
    }
    process::exit(0);
}
```

ちなみにcontest::get_contest_info()ではDiscordで表示するメッセージを作成しています。  

```rust
pub fn get_contest_info() -> String {
    let body = fetch_contest_info();
    let contest_time = body["start"].as_str().unwrap();
    let contest_title = body["title"].as_str().unwrap();
    let contest_url = body["url"].as_str().unwrap();
    let contest_info = format!(
        "**AtCoder Beginner Contest開催情報**
        **コンテスト名** : {contest_title:}
        **開始日時** : {contest_time:}
        {contest_url:}");
    contest_info
}
```

これをCircle CIで1時間ごとに実行させるようにすると完成です。  

```yaml
jobs:
  build:
    docker:
      - image: cimg/rust:1.65.0
    steps:
      - checkout

      - run:
          name: Run main.rs
          command: cargo run

workflows:
  version: 2
  Abc Latest Bot:
    triggers:
      - schedule:
          cron: "00 * * * *" # 1時間おきに実行
```

動作するとこんな感じです。  
![abc-bot](https://raw.githubusercontent.com/yashikota/blog/master/data/img/abc-bot.png)

## 最後に

これでコンテストの通知が来るようになったので、うっかり参加し忘れることもなくなるでしょう。  
競プロにも精進していきたいと思います！！！  
