---
title: YOLOv5の自動アノテーションするツールを作った
pubDate: 2023-01-13
tags: ["技術解説"]
---

YOLOv5で大量にアノテーションする必要が出てきたので楽をするために半自動アノテーションツールを作成しました。  
[リポジトリはこちらです](https://github.com/yashikota/auto-annotation)  
自分用に作ったので操作性等は壊滅的ですが、汎用性はあると思います。  

## annotation.py

torch.hub.load関数によってローカルに保存されたモデルを読み込んでいます。  
この方法がなかなか見つからなくて苦労しました😓  

```py
# モデルを読み込む
dir = os.getcwd() + "/yolov5"
model = torch.hub.load(dir, "custom", path="best.pt", source="local")
print("The list of classes the model can detect are: ", model.names)
```

その後、入力されたディレクトリに含まれる全ての画像をforで回しながらOpenCVで読み込み、認識を実行していきます。  
認識後の画像はimage0.jpgというファイル名で出力されるので逐一リネームして上書きされないようにしています。  

```py
# 入力画像に対して認識を実行し、結果を保存
for image_file in image_files:
    # 入力画像を読み込み
    image_path = os.path.join(input_dir, image_file)
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # 認識を実行
    results = model(image)

    # 結果を保存
    results.save(save_dir=args.output_dir, exist_ok=True)
    os.rename(os.path.join(args.output_dir, "image0.jpg"), os.path.join(args.output_dir, image_file))
```

認識結果はYOLOv5形式に従ってX座標の中心の値、Y座標の中心の値、幅、高さをアノテーションファイルとして書き出しています。  

```py
objects = results.pandas().xyxy[0]
file_name = os.path.splitext(os.path.basename(image_file))[0]
with open(os.path.join(args.output_dir, file_name + ".txt"), "w") as f:
    for object in objects.itertuples():
        class_id = object[6]
        center_x = (object.xmin + object.xmax) / 2 / image.shape[1]
        center_y = (object.ymin + object.ymax) / 2 / image.shape[0]
        width = (object.xmax - object.xmin) / image.shape[1]
        height = (object.ymax - object.ymin) / image.shape[0]
        f.write(f"{class_id} {center_x} {center_y} {width} {height}")
```

### annotation.pyの使い方

YOLOv5のリポジトリが必要なのでGitのSubmoduleでダウンロードします。  

```sh
git submodule update --init
```

アノテーションをさせたい画像をディレクトリに格納して用意します。  
以下のコマンドを入力するとアノテーションを実行していきます。  
なお、アノテーションにはある程度学習させたモデルが必要です。  

```sh
python3 annotation.py {入力ディレクトリ} {出力ディレクトリ}
```

このアノテーションの作業が終わるとAIがご認識した画像が含まれていると思うので、画像を1枚ずつ確認しミスをしているものを削除します。  
単に画像だけを削除してしまうとアノテーションファイルが残ってしまって学習の際にエラーとなってしますので、アノテーションファイルも同時に削除する必要があります。  
しかし画像との対応を確認しながら削除するのはめんどくさいので```regulate.py```を使用します。  

## regulate.py

こちらはもっと単純で、アノテーションをさせたい画像が入ったディレクトリの中身とアノテーションし終わった画像が入ったディレクトリの中身をすべて取得てから差分を取得して画像とアノテーションファイルを削除します。  

```py
# input_dirのファイル一覧を取得
input_files = [os.path.basename(file) for file in glob.glob(os.path.join(args.input_dir, "*"))]

# output_dirの.txtファイルでないファイル一覧を取得
output_files = [os.path.basename(file) for file in glob.glob(os.path.join(args.output_dir, "*")) if os.path.splitext(file)[1] != ".txt"]

diff_files = list(set(input_files) - set(output_files))

if len(diff_files) != 0:
    for file in diff_files:
        print(f"削除: {file}")
        os.remove(os.path.join(args.input_dir, file))
        print(f"削除: {os.path.splitext(file)[0] + '.txt'}")
        os.remove(os.path.join(args.output_dir, os.path.splitext(file)[0] + ".txt"))
```

### regulate.pyの使い方

annotation.pyと同じく、入力ディレクトリと出力ディレクトリを指定して実行するだけで不要なファイルを削除します。  

```sh
python3 regulate.py {入力ディレクトリ} {出力ディレクトリ}
```

## 最後に

機械学習のアノテーションは面倒くさい作業ですが、これでかなり作業量が減ったのでQOLが向上しました✨  
