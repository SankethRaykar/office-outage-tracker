const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
require('dotenv').config();

// TO DO: The user must replace these placeholder values with their real Firebase Config from the Google Firebase Console.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDisEtC8r_mJfky06XE9oJbfpAEbVxn6pA",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "netpulse-tracker.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "netpulse-tracker",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "netpulse-tracker.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "142690960045",
  appId: process.env.FIREBASE_APP_ID || "1:142690960045:web:fa7f08aac359ba037e3c24"
};

// Initialize Firebase only if API key is somewhat valid, else catch error to not crash the app entirely if unconfigured
let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (err) {
  console.warn("Firebase not properly configured. Data will not be uploaded.", err.message);
}

async function logStatus(data) {
  if (!db) return;
  try {
    const docRef = await addDoc(collection(db, 'logs'), {
      ...data,
      expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // TTL deletion after 24 hours
    });
    console.log('Status logged to Firebase with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding status log: ', e);
  }
}

async function logTicket(data) {
  if (!db) return;
  try {
    const docRef = await addDoc(collection(db, 'tickets'), {
      ...data,
      expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // TTL deletion after 24 hours
    });
    console.log('Ticket logged to Firebase with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding ticket: ', e);
  }
}

module.exports = { logStatus, logTicket, db };
