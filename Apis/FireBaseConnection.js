// Import the functions you need from the SDKs you need
const  firebase  = require("@firebase");
const  { getFirestore, collection, getDocs } = require('firebase/firestore/lite');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB3zO_aU97QjkN-p1MUofYobc2QNCf3y2M",
    authDomain: "yourit-department.firebaseapp.com",
    projectId: "yourit-department",
    storageBucket: "yourit-department.appspot.com",
    messagingSenderId: "48510265085",
    appId: "1:48510265085:web:8837542fa278e9ae0bc094"
};
const firebaseSequelizer = require("firestore-sequelizer");
// Initialize Firebase
const fireBaseApp = firebase.initializeApp(firebaseConfig);

const fireStore = fireBaseApp.firestore()

module.exports = fireStore