import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const API_BASE = "https://localhost:6754";

/**
 * Fetch inbox and spam emails from Firebase for a specific user
 */
export async function fetchEmailLists(userId) {
  if (!userId) return null;

  try {
    const inboxRef = collection(db, `users/${userId}/inbox`);
    const spamRef = collection(db, `users/${userId}/spam`);

    const [inboxSnap, spamSnap] = await Promise.all([
      getDocs(inboxRef),
      getDocs(spamRef),
    ]);

    const inbox = inboxSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const spam = spamSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return { inbox, spam };
  } catch (e) {
    console.error("Fetch lists failed:", e);
    return null;
  }
}

/**
 * Move email from inbox to spam or vice versa
 */
export async function moveEmail(userId, email, targetFolder) {
  if (!userId || !email) return false;

  try {
    // Determine source folder based on current email location
    const sourceFolder = email.label === "spam" ? "spam" : "inbox";

    // Delete from source folder first
    const sourceDocRef = doc(db, `users/${userId}/${sourceFolder}/${email.id}`);
    await deleteDoc(sourceDocRef);

    // Add to target folder
    const targetRef = collection(db, `users/${userId}/${targetFolder}`);
    await addDoc(targetRef, {
      from: email.from,
      to: email.to,
      subject: email.subject,
      body: email.body,
      label: targetFolder === "spam" ? "spam" : "not_spam",
      ts: email.ts || Date.now(),
    });

    return true;
  } catch (e) {
    console.error("Move email failed:", e);
    return false;
  }
}

/**
 * Classify email text as spam or not_spam using localhost API
 */
export async function classifyEmail(emailBody) {
  try {
    const resp = await fetch("https://d6661e4629dd.ngrok-free.app/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: emailBody }),
    });

    if (!resp.ok) {
      console.error("Classification API failed");
      return null;
    }

    const result = await resp.json();
    // Return the full result object with all details
    return result;
  } catch (err) {
    console.error("Classification error:", err);
    return null;
  }
}

/**
 * Deliver email to recipient's inbox or spam folder based on classification
 */
export async function deliverEmail(recipientUserId, emailData, classification) {
  if (!recipientUserId || !emailData) return false;

  try {
    const folder = classification === "spam" ? "spam" : "inbox";
    const folderRef = collection(db, `users/${recipientUserId}/${folder}`);

    await addDoc(folderRef, {
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      body: emailData.body,
      label: classification,
      ts: emailData.ts || Date.now(),
    });

    return true;
  } catch (e) {
    console.error("Email delivery failed:", e);
    return false;
  }
}
