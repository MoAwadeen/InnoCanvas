
// This file is no longer needed for core authentication and can be removed
// if all functionality is migrated to Supabase.
// For now, we leave it in case some minor feature still depends on it.

import { initializeApp, getApps, getApp } from "firebase/app";

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

// We are now using Supabase for Auth and DB.
// const auth = getAuth(app);
// const db = getFirestore(app);

export { app };
