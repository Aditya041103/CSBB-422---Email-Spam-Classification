// src/Auth.js
// Simple (insecure) email+password writer + reader using Firestore.
// For demo only.

import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Store email+password in text in collection "users".
 * Returns the new document id or throws error if email exists.
 */
export async function Signup(email, password) {
  const colRef = collection(db, "users");

  // Check if email already exists
  const q = query(colRef, where("email", "==", email));
  const snap = await getDocs(q);

  if (!snap.empty) {
    throw new Error("EMAIL_EXISTS");
  }

  const docRef = await addDoc(colRef, {
    email,
    password,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id };
}

/**
 * Sign in by finding a document with matching email and comparing password.
 * Returns { id, data } if success or null if failure.
 */
export async function SignIn(email, password) {
  const colRef = collection(db, "users");
  const q = query(colRef, where("email", "==", email));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  // If multiple docs with same email exist, pick the first
  const doc = snap.docs[0];
  const data = doc.data();
  if (data.password === password) {
    return { id: doc.id, data };
  }
  return null;
}

/**
 * Check if an email exists in the users collection.
 * Returns { id, email } if found or null if not found.
 */
export async function checkEmailExists(email) {
  const colRef = collection(db, "users");
  const q = query(colRef, where("email", "==", email));
  const snap = await getDocs(q);
  
  if (snap.empty) return null;
  
  const doc = snap.docs[0];
  return { id: doc.id, email: doc.data().email };
}
