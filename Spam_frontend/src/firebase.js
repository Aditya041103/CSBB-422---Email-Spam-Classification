// src/firebase.js
// Client-side Firebase initialization for Firestore (web SDK v9 modular)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  // optional other keys:
  // storageBucket, messagingSenderId, appId
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
