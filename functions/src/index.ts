/**
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

// index.ts

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config());

const firestore = new admin.firestore.Firestore();
firestore.settings({ timestampsInSnapshots: true });

export const postTimeline = functions.firestore.document('users/{userId}/posts/{postId}').onCreate((snapshot, context) => {
  // 更新されたデータの情報を取得
  const userId = context.params.userId;
  const postId = context.params.postId;
  const postData = snapshot.data();

  // 更新されたデータを書き込み
  const postRef = firestore.collection('users').doc('user_my').collection('timeline').doc(postId);

  return postRef.set(postData, { merge: true })
    .then(() => {
      console.log('Document successfully written!');
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
});
