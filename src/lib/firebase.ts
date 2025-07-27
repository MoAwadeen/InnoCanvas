
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "innocanvas-2jh2v",
  appId: "1:425542504976:web:6f724d3fa9ce8d62497095",
  storageBucket: "innocanvas-2jh2v.firebasestorage.app",
  apiKey: "AIzaSyDJJaulpAxzRKMrlaxBYr72gjyaMfa24kw",
  authDomain: "innocanvas-2jh2v.firebaseapp.com",
  messagingSenderId: "425542504976",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
