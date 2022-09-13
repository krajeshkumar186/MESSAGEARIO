const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const firestore = admin.firestore();

exports.onUserStatusChanged = functions.database
  .ref("/status/{uid}")
  .onUpdate(async (change, context) => {
    const eventStatus = change.after.val();

    const userFirestoreRef = firestore.doc(`/profiles/${context.params.uid}`);

    eventStatus.last_changed = new Date(eventStatus.last_changed);
    return userFirestoreRef.update(eventStatus);
  });
