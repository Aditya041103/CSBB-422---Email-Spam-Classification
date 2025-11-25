/**
 * Minimal Spam Classifier UI (React + Tailwind)
 * Modular React component with separated concerns
 */

import React, { useEffect, useState } from "react";
import { Signup, SignIn, checkEmailExists } from "./Auth";
import { isValidEmail } from "./utils";
import { fetchEmailLists, classifyEmail, deliverEmail, moveEmail } from "./api";
import LeftNav from "./components/LeftNav";
import EmailList from "./components/EmailList";
import Viewer from "./components/Viewer";
import ComposeModal from "./components/ComposeModal";
import AuthPanel from "./components/AuthPanel";
import ClassificationModal from "./components/ClassificationModal";
import { Card } from "./components/ui/card";

export default function App() {
  // --- Auth (very minimal/simulated) ---
  const [user, setUser] = useState(null); // {email}
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Emails ---
  const [inbox, setInbox] = useState([]);
  const [spam, setSpam] = useState([]);
  const [selected, setSelected] = useState(null); // selected email object
  const [activeFolder, setActiveFolder] = useState("inbox");

  // --- Send email ---
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  // --- Classification Modal ---
  const [classificationModalOpen, setClassificationModalOpen] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);
  const [lastRecipientEmail, setLastRecipientEmail] = useState("");

  // --- Feedback / status ---
  const [statusMsg, setStatusMsg] = useState("");

  // --- Fetch lists from API ---
  useEffect(() => {
    if (!user) return;
    fetchLists();
    // poll every 6s for demo (you can remove in production)
    const t = setInterval(fetchLists, 6000);
    return () => clearInterval(t);
  }, [user]);

  async function fetchLists() {
    const data = await fetchEmailLists(user?.id);
    if (data) {
      setInbox(data.inbox);
      setSpam(data.spam);
    } else {
      setInbox([]);
      setSpam([]);
    }
  }

// Sign Up handler (uses Firestore to store text)
async function handleSignUp(e) {
  e && e.preventDefault();
  if (!authEmail || !authPassword) return setStatusMsg("Provide email & password");
  if (!isValidEmail(authEmail)) return setStatusMsg("Invalid email format");
  setLoading(true);
  try {
    const res = await Signup(authEmail, authPassword);
    setUser({ email: authEmail, id: res.id });
    setStatusMsg("Signed up successfully");
    setAuthEmail("");
    setAuthPassword("");
  } catch (err) {
    console.error("Signup failed", err);
    if (err.message === "EMAIL_EXISTS") {
      setStatusMsg("Email already registered. Please sign in.");
    } else {
      setStatusMsg("Signup failed — see console");
    }
  } finally {
    setLoading(false);
    setTimeout(() => setStatusMsg(""), 3000);
  }
}

// Sign In handler (reads Firestore and compares text)
async function handleSignIn(e) {
  e && e.preventDefault();
  if (!authEmail || !authPassword) return setStatusMsg("Provide email & password");
  if (!isValidEmail(authEmail)) return setStatusMsg("Invalid email format");
  setLoading(true);
  try {
    const userDoc = await SignIn(authEmail, authPassword);
    if (!userDoc) {
      setStatusMsg("Sign-in failed (wrong credentials)");
    } else {
      setUser({ email: authEmail, id: userDoc.id });
      setStatusMsg("Signed in successfully");
      // after sign-in, fetch mailbox lists if your UI expects it
      fetchLists();
    }
    setAuthEmail("");
    setAuthPassword("");
  } catch (err) {
    console.error("Sign-in error", err);
    setStatusMsg("Sign-in failed — see console");
  } finally {
    setLoading(false);
    setTimeout(() => setStatusMsg(""), 2000);
  }
}

  function handleSignOut() {
    setUser(null);
    setInbox([]);
    setSpam([]);
    setSelected(null);
    setStatusMsg("Signed out");
    setTimeout(() => setStatusMsg(""), 1500);
  }

  // --- Compose / send email (3-step process) ---
  async function handleSendEmail(e) {
    e && e.preventDefault();
    
    // Validation
    if (!composeTo) return setStatusMsg("Please enter recipient email");
    if (!isValidEmail(composeTo)) return setStatusMsg("Invalid recipient email format");
    if (!composeBody) return setStatusMsg("Please write a message");
    
    setLoading(true);
    
    try {
      // STEP 1: Check if recipient email exists in database
      setStatusMsg("Checking recipient...");
      const recipient = await checkEmailExists(composeTo);
      
      if (!recipient) {
        setComposeOpen(false);
        setStatusMsg("Recipient email not found in system");
        setLoading(false);
        setTimeout(() => setStatusMsg(""), 3000);
        return;
      }
      
      // STEP 2: Classify email using API
      setStatusMsg("Classifying email...");
      const classificationResponse = await classifyEmail(composeBody);
      
      if (!classificationResponse) {
        setComposeOpen(false);
        setStatusMsg("Failed to classify email - API unavailable");
        setLoading(false);
        setTimeout(() => setStatusMsg(""), 3000);
        return;
      }
      
      // STEP 3: Deliver email to recipient's inbox or spam folder
      setStatusMsg("Delivering email...");
      const emailData = {
        from: user?.email,
        to: composeTo,
        subject: composeSubject || "(no subject)",
        body: composeBody,
        ts: Date.now(),
      };
      
      const delivered = await deliverEmail(recipient.id, emailData, classificationResponse.label);
      
      if (!delivered) {
        setComposeOpen(false);
        setStatusMsg("Failed to deliver email");
        setLoading(false);
        setTimeout(() => setStatusMsg(""), 3000);
        return;
      }
      
      // Success! Close compose modal and show classification results
      setComposeOpen(false);
      setLoading(false);
      
      // Store classification data and show modal
      setClassificationResult(classificationResponse);
      setLastRecipientEmail(composeTo);
      setClassificationModalOpen(true);
      
      // Clear form
      setComposeBody("");
      setComposeSubject("");
      setComposeTo("");
      
      setStatusMsg(
        `Email sent successfully! Classified as ${
          classificationResponse.label === "spam" ? "Spam 🗑️" : "Safe ✓"
        }`
      );
      setTimeout(() => setStatusMsg(""), 3000);
      
    } catch (err) {
      console.error("Send email error:", err);
      setStatusMsg("Failed to send email - see console");
      setLoading(false);
      setTimeout(() => setStatusMsg(""), 3000);
    }
  }

  // --- Open email and mark as read ---
  function openEmail(email) {
    setSelected(email);
  }

  // --- Feedback actions (Mark as Spam / Not Spam) ---
  async function sendFeedback(email, correctedLabel) {
    // correctedLabel: "spam" or "not_spam"
    setStatusMsg("Moving email...");
    
    const targetFolder = correctedLabel === "spam" ? "spam" : "inbox";
    const success = await moveEmail(user?.id, email, targetFolder);
    
    if (success) {
      // Update UI immediately
      if (correctedLabel === "spam") {
        setInbox((old) => old.filter((m) => m.id !== email.id));
        setSpam((old) => [{ ...email, label: "spam" }, ...old]);
      } else {
        setSpam((old) => old.filter((m) => m.id !== email.id));
        setInbox((old) => [{ ...email, label: "not_spam" }, ...old]);
      }
      setStatusMsg(`Moved to ${targetFolder === "spam" ? "Spam" : "Inbox"}`);
    } else {
      setStatusMsg("Failed to move email");
    }
    
    setTimeout(() => setStatusMsg(""), 2500);
    setSelected(null);
  }

  // --- Small SignIn/SignUp panel ---
  if (!user) {
    return (
      <AuthPanel
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        handleSignIn={handleSignIn}
        handleSignUp={handleSignUp}
        statusMsg={statusMsg}
      />
    );
  }

  // --- Signed-in UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        <Card className="shadow-2xl overflow-hidden border-blue-200 bg-white">
          <div className="flex h-[calc(100vh-4rem)]">
            <LeftNav
              user={user}
              inbox={inbox}
              spam={spam}
              activeFolder={activeFolder}
              setActiveFolder={setActiveFolder}
              setComposeOpen={setComposeOpen}
              handleSignOut={handleSignOut}
            />

            <div className="flex-1 grid grid-cols-5">
              <div className="col-span-2 border-r p-4 overflow-auto bg-blue-50/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-blue-900">
                    {activeFolder === "inbox" ? "📥 Inbox" : "🗑️ Spam"}
                  </h3>
                  <span className="text-xs text-blue-600 font-medium">
                    {activeFolder === "inbox" ? inbox.length : spam.length} emails
                  </span>
                </div>
                <EmailList items={activeFolder === "inbox" ? inbox : spam} openEmail={openEmail} />
              </div>

              <div className="col-span-3 flex flex-col bg-white">
                {statusMsg && (
                  <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
                    <p className="text-sm text-blue-700 text-center font-medium">{statusMsg}</p>
                  </div>
                )}

                <div className="flex-1 overflow-auto">
                  <Viewer selected={selected} setSelected={setSelected} sendFeedback={sendFeedback} activeFolder={activeFolder} />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <ComposeModal
        composeOpen={composeOpen}
        setComposeOpen={setComposeOpen}
        composeTo={composeTo}
        setComposeTo={setComposeTo}
        composeSubject={composeSubject}
        setComposeSubject={setComposeSubject}
        composeBody={composeBody}
        setComposeBody={setComposeBody}
        handleSendEmail={handleSendEmail}
        loading={loading}
      />

      <ClassificationModal
        isOpen={classificationModalOpen}
        onClose={() => setClassificationModalOpen(false)}
        classificationResult={classificationResult}
        recipientEmail={lastRecipientEmail}
      />
    </div>
  );
}
