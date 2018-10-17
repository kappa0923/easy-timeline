"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config());
const firestore = new admin.firestore.Firestore();
firestore.settings({ timestampsInSnapshots: true });
exports.postTimeline = functions.firestore.document('users/{userId}/posts/{postId}').onCreate((snapshot, context) => {
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
//# sourceMappingURL=index.js.map