import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase
  .initializeApp({
    apiKey: "AIzaSyDBaDSyfSDx3HkSv-4gJFSaucoLvwB5yv0",
    authDomain: "messagario.firebaseapp.com",
    projectId: "messagario",
    storageBucket: "messagario.appspot.com",
    messagingSenderId: "895262656403",
    appId: "1:895262656403:web:0031b175ee17bfb0d90a66",
    measurementId: "G-F62YSLGEM1",
  })
  .firestore();

export default db;

const { Timestamp } = firebase.firestore;
export { Timestamp };
