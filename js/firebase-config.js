// ============================================================
// js/firebase-config.js — Firebase Project Configuration
// ============================================================
//
// HOW TO FILL THIS IN (takes ~5 minutes):
//
//  1. Go to https://console.firebase.google.com
//  2. Click "Add project" → name it (e.g. "harshraj-portfolio") → Create
//  3. In the left sidebar click "Firestore Database" → "Create database"
//     → choose "Start in test mode" → select a region → Enable
//  4. In the left sidebar click the ⚙️ gear → "Project settings"
//  5. Scroll down to "Your apps" → click the </> Web icon → Register app
//     → name it anything (e.g. "portfolio-web") → click "Register app"
//  6. Copy the firebaseConfig object shown and PASTE it below,
//     replacing the placeholder values.
//  7. Save this file and redeploy to Netlify.
//
// ⚠️  This file is safe to commit to GitHub — these keys are
//     public-facing API keys, NOT secret keys. Firebase security
//     rules control what can be read/written.
// ============================================================

// ▼▼▼ PASTE YOUR CONFIG HERE ▼▼▼
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAtO5eKCrnTH_t_qAlAqiycXJ_6TJ-UBFg",
  authDomain: "portfolio-6001a.firebaseapp.com",
  projectId: "portfolio-6001a",
  storageBucket: "portfolio-6001a.firebasestorage.app",
  messagingSenderId: "37145328081",
  appId: "1:37145328081:web:abe44e0b60ad2c41e248f0",
  measurementId: "G-T4MXZKH05B"
};
// ▲▲▲ END OF CONFIG ▲▲▲

// ============================================================
// Firestore Document Path
// Collection: "portfolio"  →  Document: "data"
// ============================================================
const FIRESTORE_COLLECTION = "portfolio";
const FIRESTORE_DOCUMENT = "data";
