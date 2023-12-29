---
title: OIT WordCloudを支える技術
pubDate: 2022-06-25
updDate: 
isUnlisted: false
tags: ["技術解説"]
---

## はじめに

書こう書こうって思ってたら3ヶ月ぐらい経っちゃいました```(・ω<)```てへぺろ  
[OIT WordCloud](https://twitter.com/OITWordCloud)の技術的な解説ブログです。  
とは言ってもライブラリそのまんま使ってるだけなんで、一連の処理がどんな感じになっているのかをざーっと書いていきます。  

---

## 用語解説

- WordCloud

> 文章中で出現頻度が高い単語を複数選び出し、その頻度に応じた大きさで図示する手法 [^1]  

[^1]:[コトバンク より](https://kotobank.jp/word/%E3%83%AF%E3%83%BC%E3%83%89%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%89-674221)

自分のツイートをWordCloud化するモノは多数あるので知ってる人も多いと思います。  
頻出単語がビジュアル的に表現されます。  

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
現時点ではバージョン2で画像を投稿するAPIがないため、バージョン1を使用しています。  

- CI(継続的インテグレーション)

> 継続的インテグレーションは、ソフトウェアのビルドとテストを自動化する手法 [^4]

[^4]:[CircleCI より](https://circleci.com/ja/continuous-integration/)

Github ActionsやCircleCIなどのサービスがある。  

## プログラムの解説

このプログラムはWordCloudの生成を行う
[generate.py](https://github.com/yashikota/oit-wordcloud/blob/master/generate.py)
と、生成されたWordCloudをTwitterに投稿する
[bot.py](https://github.com/yashikota/oit-wordcloud/blob/master/bot.py)
の2つに分割しています。  
これによりWordCloudの生成だけを行うこともでき、開発時のテストもやりやすくなります。  
botの動作時にはbot.pyを実行することでbot.pyからgenerate.pyが呼び出されてWordCloudが生成され、それがTwitterに投稿されます。  

外部ライブラリは

- [MeCab](https://github.com/SamuraiT/mecab-python3)
    → 形態素解析
- [WordCloud](https://github.com/amueller/word_cloud)
    → WordCloudの生成
- [tweepy](https://github.com/tweepy/tweepy)
    → Twitter投稿用
- [dotenv](https://github.com/theskumar/python-dotenv)
    → Twitter APIの環境変数用

の4つを使っています。  

### generate.py

エントリーポイントは```main```で、最初に環境変数を読み込みます(Twitter用)。  
画像のパスをUUIDで生成し、pathに入れています。  
```get_tweets```でツイートの取得をし、形態素解析済みの単語と単語の数を戻り値として受け取っています。  
そして```wordcloud```に単語と画像のパスを引数にして渡すことでWordCloudが生成されます。  

```python
def main():
    # 環境変数の読み込み
    load_dotenv()

    path = str(uuid.uuid4())

    # ツイートの取得とWord Cloudの生成
    word, count = get_tweets()
    wordcloud(word, path)

    return count, path
```

```get_tweets```では最初に変数の初期化や、定数の設定を行っています。  

```python
def get_tweets():
    word_list = list()
    token = None
    count = 0
    client = tweepy.Client(bearer_token=os.environ["BT"])
    # TWITTER_LIST_ID = "1238737475306020865" # oit(たぶん枚方のみ)
    OITWC_LIST_ID = "1516921724033728512"  # OIT
    GET_TWEET_LIMIT = 100  # 取得するツイートの上限
```

tweetsにリストから取得できたツイートを格納しています。  
whileで無限ループにしているのは1回のツイート取得では目標であるツイート取得数に届かない可能性があるので、その対策です。  

```python
while True:
    tweets = client.get_list_tweets(
        id=OITWC_LIST_ID, pagination_token=token)
```

そしてforでツイートを1つずつ解析していきます。  

```python
text = (tweets[0][i].text)
```

標準ライブラリのunicodedataで全角を半角に統一しています。  

```python
text = unicodedata.normalize("NFKC", text)
```

取得したツイートがリツイートならば除外しています。  
これはできるだけ外部要因を取り除くためです。  

```python
if "RT" in text:
    continue
```

正規表現を用いて改行、全角スペース、URL、メンション、ハッシュタグを取り除いています。  

```python
text = re.sub(r"\n|\u3000|http\S+|@\S+|#\S+", "", text)
```

これらの処理を行った上で形態素解析しています。  
この```word_analysis```は形態素解析用の関数です。  

```python
text_list = word_analysis(text)
```

こちらが形態素解析用の関数です。  
パーサーと呼ばれる構文解析を行うモノを作成し、形態素解析を行い、名刺、形容詞、形容動詞だけを残しています。  
戻り地は単語のリスト(配列)です。  

```python
def word_analysis(text):
    # パーサーを作成
    parse = MeCab.Tagger().parse(text)
    # 改行で分割
    lines = parse.splitlines()
    word_list = list()
    # 残したい品詞を指定
    HINSHI = ["名詞", "形容詞", "形容動詞"]

    for line in lines:
        item = re.split("[\t,]", line)
        if (len(item) >= 2 and item[1] not in HINSHI) or item[0] == "EOS":
            continue
        word_list.append(item[0])

    return word_list
```

戻ってきた単語のリストから重複を排除しています。  
これは1つのツイートに同じ単語を複数記入して、頻出単語にするのを防止するためです。  
ただし複数のツイートで同じ単語が出てたとしても重複排除はしません。  

```python
text_list = list(set(text_list))
```

重複排除した後、リストに入れています。  

```python
# 空の要素を削除
if len(text_list) == 0:
    continue
# リストに追加
word_list.extend(text_list)
```

その際ツイート数のカウントを行い上限に達するとbreakでwhileから抜けます。  

```python
# ツイート数のカウント
count += 1
# ツイート取得数が上限に達したらループを抜ける
if count >= GET_TWEET_LIMIT:
    break
```

上限に達していない場合は次のツイートを取得しに行きますが、エラーが発生する可能性があるため例外処理を行っています。  

```python
# ツイート取得数が上限に達していない場合は次のページを取得
try:
    token = ((tweets[3])["next_token"])
except KeyError:
    break
```

ループから抜けた後、単語のリストを半角スペース区切りの1つの文字列に変換して戻り値とします。  

```python
# リストを1つの文字列に変換
word = " ".join(word_list)

return word, count
```

上の処理を全部組み合わせるとこのようになります。  

```python
def get_tweets():
    word_list = list()
    token = None
    count = 0
    client = tweepy.Client(bearer_token=os.environ["BT"])
    # TWITTER_LIST_ID = "1238737475306020865" # oit(たぶん枚方のみ)
    OITWC_LIST_ID = "1516921724033728512"  # OIT
    GET_TWEET_LIMIT = 100  # 取得するツイートの上限

    while True:
        tweets = client.get_list_tweets(
            id=OITWC_LIST_ID, pagination_token=token)

        for i in range(len(tweets[0])):
            # ツイートの文字列を取得
            text = (tweets[0][i].text)
            # 正規化
            text = unicodedata.normalize("NFKC", text)
            # リツイートを除外
            if "RT" in text:
                continue
            # 改行、全角スペース、URL、メンション、ハッシュタグを除外
            text = re.sub(r"\n|\u3000|http\S+|@\S+|#\S+", "", text)
            # 形態素解析
            text_list = word_analysis(text)
            # 単語の重複排除
            text_list = list(set(text_list))
            # 空の要素を削除
            if len(text_list) == 0:
                continue
            # リストに追加
            word_list.extend(text_list)
            # ツイート数のカウント
            count += 1
            # ツイート取得数が上限に達したらループを抜ける
            if count >= GET_TWEET_LIMIT:
                break
        # ツイート取得数が上限に達していない場合は次のページを取得
        try:
            token = ((tweets[3])["next_token"])
        except KeyError:
            break
    # リストを1つの文字列に変換
    word = " ".join(word_list)

    return word, count


# 形態素解析
def word_analysis(text):
    # パーサーを作成
    parse = MeCab.Tagger().parse(text)
    # 改行で分割
    lines = parse.splitlines()
    word_list = list()
    # 残したい品詞を指定
    HINSHI = ["名詞", "形容詞", "形容動詞"]

    for line in lines:
        item = re.split("[\t,]", line)
        if (len(item) >= 2 and item[1] not in HINSHI) or item[0] == "EOS":
            continue
        word_list.append(item[0])

    return word_list
```

```wordcloud```では上記の処理で生成された単語と画像のパスを受け取りWordCloudを生成しています。  
生成自体はライブラリが自動で行うので、処理としてはフォントの指定、NGワードの指定、背景の指定、フォントの色の指定などです。  

```python
def wordcloud(word, path):
    # フォントを指定
    FONT_PATH = "./font/UDEVGothic-Bold.ttf"

    # NGワードを指定
    NG = ["人", "こと", "時間", "やつ", "日", "時", "分", "ない", "気", "今", "いい", "笑", "笑笑"]

    wc = WordCloud(font_path=FONT_PATH, background_color="black",
                   prefer_horizontal=0.85, colormap="Set3",
                   collocations=False, height=1080, width=1920,
                   stopwords=set(NG)).generate(word)
    wc.to_file("./img/" + path + ".png")
```

### bot.py

エントリーポイントは```main```でgenerate.pyのmain関数を呼び出しWordCloudの生成と単語数、画像のパスを受け取っています。  
その後環境変数を読み込みます(Twitter用)。  
```post_tweet```で投稿を行い、```add_list```でフォローしている人をリストに追加しています。  
```follow_back```は凍結される恐れがあるので現在は使っていません。  

```python
def main():
    # Word Cloudを生成し、解析ツイート数を取得
    count, path = generate.main()

    # APIキーの読み込み
    load_dotenv()
    auth = tweepy.OAuthHandler(os.environ["CK"], os.environ["CS"])
    auth.set_access_token(os.environ["AT"], os.environ["AS"])
    api = tweepy.API(auth)

    post_tweet(count, path, api)
    # follow_back(api) # 現在不使用
    add_list()
```

```post_tweet```でツイートを行っています。  
imgに画像のパスを、dateに投稿時点での年月日と時間を、textに投稿されるテキストをそれぞれ設定し、```api.update_status_with_media```というtweepyの関数で投稿を行います。

```python
def post_tweet(count, path, api):
    # 画像のパスを取得
    img = "./img/" + path + ".png"

    # 年月日と時刻を取得
    date = datetime.datetime.now(datetime.timezone(
        datetime.timedelta(hours=+9))).strftime("%Y年%m月%d日%H時")

    # ツイート
    text = date + "のWordCloudです\n" + str(count) + "件のツイートを解析しました"
    api.update_status_with_media(text, filename=img)
```

今は不使用ですが```follow_back```ではフォロワーを取得し、フォローしていない人がいればフォローする処理になっています。  

```python
def follow_back(api):
    # フォローされているアカウントを取得
    follower_list = api.get_follower_ids(count=1000)

    # フォローされているアカウントをフォロー
    for i in range(len(follower_list)):
        try:
            api.create_friendship(user_id=follower_list[i])
        except tweepy.errors.Forbidden:
            continue
```

```add_list```ではフォローしている人を[リスト](https://twitter.com/i/lists/1516921724033728512)に追加する処理を行っています。  
このリストはツイートの取得に使用しているリストです。  

最初にリストのIDの定数化やAPIの設定を行っています。  

```python
def add_list():
    OITWC_ACCOUNT_ID = "1516397750317117441"
    OITWC_LIST_ID = "1516921724033728512"
    client = tweepy.Client(bearer_token=os.environ["BT"], consumer_key=os.environ["CK"],
                           consumer_secret=os.environ["CS"], access_token=os.environ["AT"],
                           access_token_secret=os.environ["AS"])
    following_list = list()
    member_list = list()
```

followingにフォローしている人のIDを格納し、memberにリストのメンバーのIDを格納しています。  

```python
# フォローしているアカウントのIDを取得
following = client.get_users_following(id=OITWC_ACCOUNT_ID)
for i in range(len(following[0])):
    following_list.append(following[0][i].id)

# リストのメンバーのIDを取得
member = client.get_list_members(id=OITWC_LIST_ID)
for i in range(len(member[0])):
    member_list.append(member[0][i].id)
```

そしてフォローしている人のIDからリストのメンバーのIDを引き、もし残っているIDがあるならばそれはリストに追加されていない人なので、unlistedに格納し、フォローするようにしています。  

```python
# フォローしているアカウントがリストに含まれていない場合はリストに追加
unlisted = list(set(following_list) - set(member_list))

# リストに追加
for i in range(len(unlisted)):
    client.add_list_member(id=OITWC_LIST_ID, user_id=unlisted[i])
```

### 投稿の仕組み

CircleCIを用いて7~25時の間、1時間に1回動作するようになっています。  
初期はGithub Actionsを用いていましたが、9時10時の投稿がされなかったり、ひどく遅延していたので乗り換えました。  

## 今後の改善点

実はtf-idfという重み付けの方法も
[やってみた](https://github.com/yashikota/oit-wordcloud/blob/tf-idf/generate.py)
のですが、思うような結果にならなかったので不採用にしました。残念  

```python
def tfidf(word_list):
    vectorizer = TfidfVectorizer(use_idf=True, token_pattern=u"(?u)\\b\\w+\\b")
    vec = vectorizer.fit_transform(word_list)
    vec_list = list()

    for i in range(len(vec.toarray())):
        vec_sum = sum(vec.toarray()[i])
        vec_list.append(vec_sum)

    word = dict(zip(vectorizer.get_feature_names_out(), vec_list))
```
