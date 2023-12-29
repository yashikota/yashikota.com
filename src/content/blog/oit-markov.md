---
title: OIT Markov Botを支える技術
pubDate: 2022-08-10
updDate: 
tags: ["技術解説"]
---

## はじめに

[OIT Markov Bot](https://twitter.com/OITMarkov)の技術的な解説ブログです。  
正直精度良くないんで運用続けるか迷ってます。  
原因は多分ツイートの取得数不足。  

---

## 用語解説

- マルコフ連鎖

> 取りうる状態が離散的または有限であるマルコフ過程。時間的に状態が変化する系では、未来の状態が現在の状態によってのみ決まり、過去の状態によらない。 [^1]  

難しく書いてるけど、つまりは未来は現時点での状態だけで決定されるという法則。  
この理論を言語生成に利用しています。  

[^1]:[コトバンク より](https://kotobank.jp/word/%E3%83%9E%E3%83%AB%E3%82%B3%E3%83%95%E9%80%A3%E9%8E%96-137578)

- 形態素解析

> 自然言語で書かれた文を言語上で意味を持つ最小単位(＝形態素)に分け、それぞれの品詞や変化などを判別すること [^2]

[^2]:[Ledge.ai より](https://ledge.ai/morpho_analysis_japan/)

国立国語研究所が運用している
[Web茶まめ](https://chamame.ninjal.ac.jp/)
が有名だと思います。  

- Mecab

オープンソースの日本語用形態素解析エンジンです。  
今回はPythonで使用するので
[mecab-python3](https://github.com/SamuraiT/mecab-python3)
を使用しています。  

- UniDic

> 形態素解析器MeCab用の解析用辞書 [^3]

[^3]:[国立国語研究所 より](https://clrd.ninjal.ac.jp/unidic/about_unidic.html)

つまりは形態素解析で分けられた単語の品詞や類などを判別する辞書です。  
今回は品詞を判定するために使用しています。  
こちらもpythonで使用するので
[unidic-py](https://github.com/polm/unidic-py)
を使用しています。  

- Twitter API

APIはプログラムから操作をするために使われるインターフェースのことで、それのTwitterバージョンです。  
現在バージョン1とバージョン2があり、バージョン1を使用するためには英語で色々記入しなければならず、めんどくさいです。  
バージョン2は記入もなくすぐに使い始めることができますが、バージョン1より使えるAPIの種類は少ないです(拡充予定)。  
今回の運用ではテキストだけを扱えれば良いため、バージョン2を使用しています。  

- CI(継続的インテグレーション)

> 継続的インテグレーションは、ソフトウェアのビルドとテストを自動化する手法 [^4]

[^4]:[CircleCI より](https://circleci.com/ja/continuous-integration/)

Github ActionsやCircleCIなどのサービスがあります。  

## プログラムの解説

このプログラムはツイートの収集を行う
[collect.py](https://github.com/yashikota/oit-markov/blob/master/collect.py)
と、マルコフ連鎖により文章の生成を行う
[generate.py](https://github.com/yashikota/oit-markov/blob/master/generate.py)
と、生成された文章をTwitterに投稿する
[tweet.py](https://github.com/yashikota/oit-markov/blob/master/tweet.py)
の3つに分割しています。  
collect.py → generate.py → tweet.pyの順番に処理されていきます。  

外部ライブラリは

- [MeCab](https://github.com/SamuraiT/mecab-python3)
    → 形態素解析
- [WordCloud](https://github.com/amueller/word_cloud)
    → WordCloudの生成
- [tweepy](https://github.com/tweepy/tweepy)
    → Twitter投稿用
- [dotenv](https://github.com/theskumar/python-dotenv)
    → Twitter APIの環境変数用
- [markovify](https://github.com/jsvine/markovify)
    → マルコフ連鎖による文章の生成

の5つを使っています。  

### collect.py

エントリーポイントは```main```で、OIT WordCloudでも使用している
[リスト](https://twitter.com/i/lists/1516921724033728512)
を使用しています。  

```py
def main():
    # ツイートを取得
    text_list , count = get_tweets()
```

```get_tweet```関数にてツイートを取得しています。  

```py
# ツイートを取得する
def get_tweets():
    # 環境変数の読み込み
    load_dotenv()
    client = tweepy.Client(bearer_token=os.environ["BT"])
    OITWC_LIST_ID = "1516921724033728512"
    token = None
    count = 0
    text_list = list()
    # GET_TWEET_LIMIT = 100  # 取得するツイートの上限

    while True:
        tweets = client.get_list_tweets(
            id=OITWC_LIST_ID, pagination_token=token)

        for i in range(len(tweets[0])):
            # ツイートの文字列を取得
            text = (tweets[0][i].text)
            # リツイートを除外
            if "RT" in text:
                continue
            # 質問箱を除外
            if "みんなからの匿名" in text:
                continue
            # 文字列を整える
            text = format_text(text)
            # リストに追加
            text_list.append(text)
            # 取得したツイート数をカウント
            count += 1

            # ツイート取得数が上限に達したらループを抜ける
            # if i >= GET_TWEET_LIMIT:
            #     break

        # ツイート取得数が上限に達していない場合は次のページを取得
        try:
            token = ((tweets[3])["next_token"])
        except KeyError:
            break

    return text_list , count


# 文字列を整える
def format_text(text):
    # NG.txtを読み込む
    with open("ng.txt", "r", encoding="utf-8") as f:
        ng_word = f.read().splitlines()
    breaking_chars = ["(", ")", "[", "]", '"', "'"]

    # 正規化
    text = unicodedata.normalize("NFKC", text)
    # 改行、半角スペース、全角スペース、URL、メンション、ハッシュタグを除外
    text = re.sub(r"\r|\n| |\u3000|http\S+|@\S+|#\S+", "", text)
    # breaking_charsを除外
    for char in breaking_chars:
        text = text.replace(char, "")
    # NGワードを除外
    for ng in ng_word:
        text = text.replace(ng, "")

    return text
```

ここらへんの処理は
[OIT WordCloudを支える技術](https://yashikota.com/blog/oit-wc)
で紹介しているので割愛。  
違う点はツイートの取得をAPIの上限までやっていること。  
それでも400~500件ぐらいだけど。  
あとはNGワードリストを作って除外しています。  
爆破予告とかされたらたまらんので。  

### generate.py

エントリーポイントは```main```で、ツイートを解析して、文章の生成を行っています。  
デバッグ用にprintで生成された文章等を出力しています。  

```py
def main():
    # ツイートを取得
    texts , count = collect.main()
    # 正規化
    parsed_text = parse_texts(normalization(texts))
    # 文章生成
    sentence = gen_sentence(parsed_text)

    # 表示
    print(sentence, end="")
    print("["+str(len(sentence))+"文字]", end="")
    print("[解析ツイート数: "+str(count) + "]")
```

正規化の部分では記号やURLなどを除外してデータの前処理を行っています。  

```py
def normalization(texts):
    normalized_texts = list(str())

    for text in texts:
        normalized_texts.append(re.sub(
            '\'|\"|\(|\)|\[|\]|\r|<br />|\u3000|-|\||https?://[!\?/\+\-_~=;\.,\*&@#\$%\(\)\'\[\]]+|@[\\w]{1,15}', ' ', text))

    return normalized_texts
```

その後、形態素解析を行い単語リストに格納後  

```py
# 形態素解析
def parse_texts(normalized_texts):
    mecab = MeCab.Tagger("-Owakati")
    parsed_texts = str()

    for text in normalized_texts:
        parsed = mecab.parse(text)
        for token in parsed:
            if token == "\n":
                continue
            parsed_texts += token
            if token == "。":
                parsed_texts += "\n"

    return parsed_texts
```

単語リストを元にマルコフ連鎖にて文章の生成を行っています。  
STATE_SIZEは組み合わせる文章の数で今回は2を指定しています。  
本当は4ぐらいにしたいけど学習データが少なすぎて毎回同じような文章しか生成されないので妥協。  

```py
# 文章生成
def gen_sentence(parsed_text):
    STATE_SIZE = 2
    model = markovify.NewlineText(parsed_text, state_size=STATE_SIZE)
    sentence = None

    # 文が生成されるまで繰り返し
    while sentence == None:
        try:
            sentence = model.make_short_sentence(140)
        except Exception as e:
            print(e)

    sentence = "".join(sentence.split())

    return sentence
```

### tweet.py

生成された文章をTwitterに投稿しています。  
特に解説するような内容もないので割愛。  

```py
def tweet(sentence):
    # 環境変数の読み込み
    load_dotenv()
    client = tweepy.Client(bearer_token=os.environ["BT"], consumer_key=os.environ["CK"],
                           consumer_secret=os.environ["CS"], access_token=os.environ["AT"],
                           access_token_secret=os.environ["AS"])

    # ツイートする
    client.create_tweet(text=sentence)


def main():
    # 文章を生成
    sentence = generate.main()
    # ツイートする
    tweet(sentence)
```

### 投稿の仕組み

CircleCIを用いて7~25時の間、1時間に1回動作するようになっています。  
初期はGithub Actionsを用いていましたが、9時10時の投稿がされなかったり、ひどく遅延していたので乗り換えました。  

## 今後の改善点

学習元のデータ数が少なすぎて支離滅裂なことしか言ってないのが気になる。  
ただ、ツイートの取得数をこれ以上増やすことが難しそうなのでうーん…  
