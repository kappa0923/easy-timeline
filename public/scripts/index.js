/**
 * MIT License
 * 
 * Copyright (c) 2018 kappa0923.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// index.js
'use strict';

const POST_BUTTON = {
  MY: Symbol(),
  OTHER: Symbol()
}

const DISPLAY_TYPE = {
  MY: Symbol(),
  OTHER: Symbol()
}

const myUserId = 'user_my';
const otherUserId = 'user_other';

/**
 * @desc Initializes EasyTimeline.
 */
class EasyTimeline {
  /**
   * @desc Template for post.
   */
  static get POST_TEMPLATE() {
    return (
      '<li class="mdc-card mdc-list-item post-item">' +
      '<img class="mdc-list-item__graphic timeline-image" >' +
      '<span class="mdc-list-item__text">' +
      '<span class="mdc-list-item__primary-text timeline-message"></span>' +
      '<span class="mdc-list-item__secondary-text timeline-name"></span>' +
      '</span>' +
      '</li>'
    );
  }

  /**
   * @desc Constructor
   */
  constructor() {
    this.checkSetup();

    this.myPostButton = document.getElementById('myPostButton');
    this.myPostInput = document.getElementById('myPostInput');
    this.otherPostButton = document.getElementById('otherPostButton');
    this.otherPostInput = document.getElementById('otherPostInput');
    this.myTimeline = document.getElementById('myTimeline');
    this.otherTimeline = document.getElementById('otherTimeline');

    this.myPostButton.addEventListener('click', this.postClicked.bind(this, POST_BUTTON.MY));
    this.otherPostButton.addEventListener('click', this.postClicked.bind(this, POST_BUTTON.OTHER));

    this.initFirebase();
  }

  /**
   * @desc Firebaseの初期設定
   */
  initFirebase() {
    this.firestore = firebase.firestore();

    const settings = { timestampsInSnapshots: true };
    this.firestore.settings(settings);

    const myUserRef = this.firestore.collection('users').doc(myUserId);
    // TODO : 07. 投稿の情報をFirestoreから読み出し
    // myUserRef.collection('posts')
    //   .orderBy('postAt')
    //   .onSnapshot((querySnapshot) => {
    //     for (const change of querySnapshot.docChanges()) {
    //       if (change.type === 'added') {
    //         const doc = change.doc;
    //         this.displayPost(doc.id + myUserId, doc.data().userName,
    //           doc.data().message, doc.data().userPic, DISPLAY_TYPE.MY);
    //       }
    //     }
    //   });

    // TODO : 10. タイムラインの情報をFirestoreから読み出し
    // myUserRef.collection('timeline')
    //   .orderBy('postAt')
    //   .onSnapshot((querySnapshot) => {
    //     for (const change of querySnapshot.docChanges()) {
    //       if (change.type === 'added') {
    //         const doc = change.doc;
    //         this.displayPost(doc.id + otherUserId, doc.data().userName,
    //           doc.data().message, doc.data().userPic, DISPLAY_TYPE.OTHER);
    //       }
    //     }
    //   });
  }

  displayPost(key, name, text, picUrl, displayType) {
    // 表示する子要素のcontainerを取得
    let item = document.getElementById(key);

    // 子要素を生成
    if (!item) {
      const container = document.createElement('li');
      container.innerHTML = EasyTimeline.POST_TEMPLATE;
      item = container.firstChild;
      item.setAttribute('id', key);
      if (displayType === DISPLAY_TYPE.MY) {
        console.log('post : ' + text);
        this.myTimeline.appendChild(item);
      } else {
        console.log('timeline : ' + text);
        this.otherTimeline.appendChild(item);
      }
    }

    // ユーザー名を表示
    if (name) {
      let nameElement = item.querySelector('.timeline-name');
      nameElement.textContent = name;
    }

    // 投稿テキストを表示
    if (text) {
      let messageElement = item.querySelector('.timeline-message');
      messageElement.textContent = text;
      // 改行を<br>で置き換え.
      messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    }

    // 子要素の画像のURLを指定
    if (picUrl) {
      let picElement = item.querySelector('.timeline-image');
      picElement.setAttribute('src', picUrl);
    }

    // Show the card fading-in.
    setTimeout(() => {
      item.classList.add('visible');
    }, 1);
  }

  /**
   * SENDを押した際に呼ばれる
   * @param {Enum} postType SENDイベントの識別子
   * @param {Object} event イベント
   */
  postClicked(postType, event) {
    let userId;
    let userRef;
    let message;

    // ボタン押下時に投稿を取得
    switch (postType) {
      case POST_BUTTON.MY:
        // TODO : 06. 自分の投稿の保存
        // userId = myUserId;
        // userRef = this.firestore.collection('users').doc(userId);
        // message = this.myPostInput.value;
        // this.myPostInput.value = '';
        break;
      case POST_BUTTON.OTHER:
        // TODO : 08. 他人の投稿を保存
        // userId = otherUserId;
        // userRef = this.firestore.collection('users').doc(userId);
        // message = this.otherPostInput.value;
        // this.otherPostInput.value = '';
        break;
      default:
        break;
    }

    if (message === '') {
      console.log(userId + ' is empty');
      return;
    }

    const postRef = userRef.collection('posts');

    // Firesotreへの保存処理
    postRef.add({
      userName: userId,
      message: message,
      userPic: '/images/profile_placeholder.png',
      postAt: firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  /**
   * @desc firebaseが正常にロードされているかのチェック
   */
  checkSetup() {
    if (!window.firebase
      || !(firebase.app instanceof Function)
      || !firebase.app().options) {
      window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
    }
  }
}

window.onload = () => {
  // Initializes EasyTimeline.
  window.easyTimeline = new EasyTimeline();

  // Initialize Material Design Components
  window.mdc.autoInit();
  const MDCTextField = window.mdc.textField.MDCTextField;
  const myTextField = new MDCTextField(document.querySelector('#myPostForm'));
  const otherTextField = new MDCTextField(document.querySelector('#otherPostForm'));
};