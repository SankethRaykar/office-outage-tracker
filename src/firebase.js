import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TO DO: The user must replace these placeholder values with their real Firebase Config from the Google Firebase Console.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDisEtC8r_mJfky06XE9oJbfpAEbVxn6pA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "netpulse-tracker.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "netpulse-tracker",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "netpulse-tracker.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "142690960045",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:142690960045:web:fa7f08aac359ba037e3c24"
};

let db = null;
let auth = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (err) {
  console.warn("Firebase not configured for Dashboard yet.", err);
}

export { db, auth };
