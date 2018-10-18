# Introduction to creating timeline with Firebase
## 0. About
これはFirebaseでTimelineアプリを作るためのサンプル兼Codelabです。

手順に沿ってコードを実装していくことで、Firebaseを利用したTimelineアプリを動かすことができます。

また、このCodelabではGCP, Firebaseを利用するため、Googleアカウントが必要です。
用意していない人は必ず取得しておいてください。

<walkthrough-directive-name name="kappa0923">
</walkthrough-directive-name>

## 1. Introduction
Firebaseはアプリ開発のためのクラウドサービスでいわゆるmBaaS(mobile backend as a service)です。

### 何ができるの？
柔軟でスケーラブルなNoSQLクラウドデータベースであるCloud Firestoreや、Push通知を行うためのCloud Messaging、ウェブサイトの静的ホスティングを行うためのFirebase Hostingなど、モバイルアプリを開発するために必要なサービスが提供されています。

さらに、かなり無料枠が大きく、簡単なアプリなら無料で作ることができちゃいます！

### 何を作るの？
Firebaseを利用してタイムラインアプリを作ります！

[https://easy-timeline.firebaseapp.com/](https://easy-timeline.firebaseapp.com/)

### 今日のゴール
ただタイムラインアプリを作るだけでなく、Firebaseってどう使うの？何ができるの？という部分を学んでいきましょう。

自分でFirebaseを使おうと思ったときに、少しでもハードルを下げるきっかけになれば。

### 準備するもの
- Googleアカウント
  - Firebaseを使うために必要です
- (Codeエディタ)
  - ローカルでコードを編集したい方は
- Node.js
  - v6以上
  - ローカルで開発したい方は入れておいてください

## 2. Setup
### コードダウンロード
[https://github.com/kappa0923/easy-timeline](https://github.com/kappa0923/easy-timeline) にアクセスし、 `Open in Cloud Shell` をクリック。

Cloud Shellが開かれ、サンプルコードがダウンロードされます。

同時に、このチュートリアルが開始されます。
もし、セッションが切れたりしてチュートリアルが途切れてしまったら、以下のコマンドでチュートリアルを再開できます。

```bash
cloudshell launch-tutorial -d TUTORIAL.md
```

### プロジェクト作成
1. [Firebaseコンソール](https://console.firebase.google.com/
) にアクセスし、プロジェクトを追加をクリック
2. プロジェクト名に好きな文字列を入力し、プロジェクトを作成

### Firebaseへのログイン
以下のコマンドを実行してFirebaseにログインします
URLが表示されるのでそこにアクセスし、トークンを入力して `Success! Logged in as XXXX@XXX` と表示されればOK

```bash
firebase login --no-localhost
```

Firebaseコンソールから「設定」「プロジェクトの設定」から `プロジェクトID` を確認

![images/image001.png](https://github.com/kappa0923/easy-timeline/blob/master/images/image001.png?raw=true)

以下のコマンドを実行してFirebaseプロジェクトと紐づけます

```bash
firebase use <project_id>
```

## 3. Firebaseのconfigを追加
### configの確認
「Project Overview」「ウェブアプリにFirebaseを追加」と選択

![images/image002.png](https://github.com/kappa0923/easy-timeline/blob/master/images/image002.png?raw=true)

### configの追加
<walkthrough-editor-open-file filePath="easy-timeline/public/index.html" text="public/index.html"></walkthrough-editor-open-file>を開き、configをL65に追記して保存。

![images/image003.png](https://github.com/kappa0923/easy-timeline/blob/master/images/image003.png?raw=true)

```html
<!-- TODO : 03. ここにスニペットをコピー -->
<script src="https://www.gstatic.com/firebasejs/5.5.3/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "hogehoge.firebaseapp.com",
    databaseURL: "https://hogehoge.firebaseio.com",
    projectId: "hogehoge",
    storageBucket: "hogehoge.appspot.com",
    messagingSenderId: "00000000000"
  };
  firebase.initializeApp(config);
</script>
<!-- 03. end -->
```

## 4. 動作確認
以下のコマンドを実行

```bash
firebase serve --only hosting --port 8080
```

ウェブでプレビューボタンで確認

<walkthrough-spotlight-pointer spotlightId="devshell-web-preview-button" text="Open Cloud Shell"></walkthrough-spotlight-pointer>

こんな画面が表示されます。
左側に自分の投稿が、右側に自分のタイムラインが表示されるように作っていきます。

![images/image004.png](https://github.com/kappa0923/easy-timeline/blob/master/images/image004.png?raw=true)

## 5. Firestoreの有効化
投稿を保存するため、Firestoreをコンソールから有効化

![images/image005.png](https://github.com/kappa0923/easy-timeline/blob/master/images/image005.png?raw=true)

一旦テストアプリなのでテストモードでデータベースを設定

![images/image006.png](https://github.com/kappa0923/easy-timeline/blob/master/images/image006.png?raw=true)

## 6. 投稿の保存
投稿は `users/{uid}/posts/{postId}` とuser自身のサブコレクションとして保存する。
こうすることで特定のユーザーの投稿を一括で簡単に取得できる。

<walkthrough-editor-open-file filePath="easy-timeline/public/scripts/index.js" text="public/scripts/index.js"></walkthrough-editor-open-file>を開き、L174~177のコメントアウトを外す。

```js
// ボタン押下時に投稿を取得
switch (postType) {
  case POST_BUTTON.MY:
    // TODO : 06. 自分の投稿の保存
    userId = myUserId;
    userRef = this.firestore.collection('users').doc(userId);
    message = this.myPostInput.value;
    this.myPostInput.value = '';
    break;
```

左側のフォームに適当なメッセージを入力して `SEND`
FirebaseのコンソールからFirestoreを確認すると、投稿が保存されている！

## 7. 投稿を表示
Firestoreに保存されている投稿を表示する。
ただ1回読み込んで表示するだけでなく、snapshotを用いることで更新を検知！

<walkthrough-editor-open-file filePath="easy-timeline/public/scripts/index.js" text="public/scripts/index.js"></walkthrough-editor-open-file>を開き、L89~99のコメントアウトを外す。

```js
// TODO : 07. 投稿の情報をFirestoreから読み出し
myUserRef.collection('posts')
  .orderBy('postAt')
  .onSnapshot((querySnapshot) => {
    for (const change of querySnapshot.docChanges()) {
      if (change.type === 'added') {
        const doc = change.doc;
        this.displayPost(doc.id + myUserId, doc.data().userName,
          doc.data().message, doc.data().userPic, DISPLAY_TYPE.MY);
      }
    }
  });
```

投稿をするとリアルタイムに表示される。

## 8. 他人の投稿を保存
自分の投稿同様、他人の投稿もFirestoreに保存する。
自分の投稿と他人の投稿はuserIdを分けることで分離する。

<walkthrough-editor-open-file filePath="easy-timeline/public/scripts/index.js" text="public/scripts/index.js"></walkthrough-editor-open-file>を開き、L181~184のコメントアウトを外す。

```js
case POST_BUTTON.OTHER:
  // TODO : 08. 他人の投稿を保存
  userId = otherUserId;
  userRef = this.firestore.collection('users').doc(userId);
  message = this.otherPostInput.value;
  this.otherPostInput.value = '';
  break;
```

右側のフォームに適当なメッセージを入力して `SEND`
FirebaseのコンソールからFirestoreを確認すると、別のユーザーに投稿が保存されている！

## 9. 自分と他人の投稿を自分のタイムラインに保存
Cloud Functionsを利用して、投稿を自分のタイムラインにコピーする。
RBDだと同じデータを複数持つのはご法度だけど、Firestoreは読み出し・速度に重きを置く。

投稿は `users/{uid}/posts/{postId}` とuser自身のサブコレクションとして保存する。

以下のコマンドを実行してCloud Functionsにデプロイする。

```bash
firebase deploy --only functions
```

デプロイが完了した後に自分/他人で投稿すると、自分のタイムラインにデータがコピーされている。

以下のコードでFirestoreのドキュメントの更新を検出。
波括弧で囲ってるものはコード中で変数として利用できる。

```js
functions.firestore.document('users/{userId}/posts/{postId}').onCreate()
```

## 10. 自分のタイムラインを表示
Firestoreから自分のタイムラインを読み込んで表示する。

<walkthrough-editor-open-file filePath="easy-timeline/public/scripts/index.js" text="public/scripts/index.js"></walkthrough-editor-open-file>を開き、L102~112のコメントアウトを外す。

```js
// TODO : 10. タイムラインの情報をFirestoreから読み出し
myUserRef.collection('timeline')
  .orderBy('postAt')
  .onSnapshot((querySnapshot) => {
    for (const change of querySnapshot.docChanges()) {
      if (change.type === 'added') {
        const doc = change.doc;
        this.displayPost(doc.id + otherUserId, doc.data().userName,
          doc.data().message, doc.data().userPic, DISPLAY_TYPE.OTHER);
      }
    }
  });
```

投稿をするとタイムラインがリアルタイムに更新される。

## 11. アプリを公開
Firebase Hostingにウェブアプリを公開しましょう。
デプロイすると自動的に公開され、ドメイン・SSL証明書などもすべてやってくれます。

```bash
firebase deploy --only hosting
```

`Deploy complete!` と表示されればOK。
インターネットに公開されているので、スマホとかからも同じURLでアクセス可能。

## Congratulations
<walkthrough-conclusion-trophy></walkthrough-conclusion-trophy>

お疲れ様でした！
何か質問などがあれば
