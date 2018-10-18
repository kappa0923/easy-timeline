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

https://easy-timeline.firebaseapp.com/

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
https://github.com/kappa0923/easy-timeline にアクセスし、 `Open in Cloud Shell` をクリック。

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

![images/image001.png]

以下のコマンドを実行してFirebaseプロジェクトと紐づけます

```bash
firebase use <project_id>
```

## 3. Firebaseのconfigを追加
### configの確認
「Project Overview」「ウェブアプリにFirebaseを追加」と選択

![images/image002.png]

### configの追加
<walkthrough-editor-open-file filePath="public/index.html" text="public/index.html"></walkthrough-editor-open-file>を開き、configをL65に追記して保存。

```html
<!-- TODO : 04. ここにスニペットをコピー -->
<script src="https://www.gstatic.com/firebasejs/5.5.3/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAHVY2r5jVOvb1mM-CG5b9lc70ikH0Wu0U",
    authDomain: "easy-timeline.firebaseapp.com",
    databaseURL: "https://easy-timeline.firebaseio.com",
    projectId: "easy-timeline",
    storageBucket: "easy-timeline.appspot.com",
    messagingSenderId: "665941225955"
  };
  firebase.initializeApp(config);
</script>
<!-- 04. end -->
```
