// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6xez94-0hqklzWLqK7Q1Z71l_hJh2IeA",
  authDomain: "stocklink-90182.firebaseapp.com",
  projectId: "stocklink-90182",
  storageBucket: "stocklink-90182.appspot.com",
  messagingSenderId: "994817517160",
  appId: "1:994817517160:web:fee5de072b6543e42cbddd",
  measurementId: "G-Z9QDD521Z7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Firestore for database operations

export { auth, db };
