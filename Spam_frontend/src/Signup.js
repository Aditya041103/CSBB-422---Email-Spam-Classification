// src/Signup.js
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * WARNING: This stores password in text in Firestore. Insecure.
 * Use only for throwaway demos.
 */
export async function Signup(email, password) {
  // collection "users"
  const col = collection(db, "users");
  const docRef = await addDoc(col, {
    email,
    password,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id };
}
