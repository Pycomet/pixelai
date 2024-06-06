// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_FIREBASE_SENDER_ID,
    appId: process.env.NEXT_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_FIREBASE_MEASUREMENT_ID
};


console.log(process.env.NEXT_FIREBASE_API_KEY);
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth instance
export const auth = getAuth(app);
