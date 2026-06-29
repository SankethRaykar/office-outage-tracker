const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
require('dotenv').config();

// TO DO: The user must replace these placeholder values with their real Firebase Config from the Google Firebase Console.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Initialize Firebase only if API key is somewhat valid, else catch error to not crash the app entirely if unconfigured
let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (err) {
  console.warn("Firebase not properly configured. Data will not be uploaded.", err.message);
}

async function logStatus(statusData) {
  if (!db) return;
  try {
    const docRef = await addDoc(collection(db, "logs"), statusData);
    console.log("Status logged to Firebase with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding status log: ", e);
  }
}

async function logTicket(ticketData) {
  if (!db) return;
  try {
    const docRef = await addDoc(collection(db, "tickets"), ticketData);
    console.log("Ticket generated in Firebase with ID: ", docRef.id);
  } catch (e) {
    console.error("Error generating ticket: ", e);
  }
}

module.exports = { logStatus, logTicket, db };
