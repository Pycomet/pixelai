// firebaseConfig.ts
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_FIREBASE_API_KEY || "demo-key",
  authDomain:
    process.env.NEXT_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket:
    process.env.NEXT_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_FIREBASE_SENDER_ID || "123456789",
  appId: process.env.NEXT_FIREBASE_APP_ID || "1:123456789:web:abcdef",
  measurementId: process.env.NEXT_FIREBASE_MEASUREMENT_ID || "G-ABCDEF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth instance
export const auth = getAuth(app);
export const db = getFirestore(app);
