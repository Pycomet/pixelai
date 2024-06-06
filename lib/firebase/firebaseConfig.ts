// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBBwJjHU-K_9npDMNRz0r6IuCePCyWtBxE",
    authDomain: "pixelai-30f7a.firebaseapp.com",
    projectId: "pixelai-30f7a",
    storageBucket: "pixelai-30f7a.appspot.com",
    messagingSenderId: "516882609154",
    appId: "1:516882609154:web:7c372f7e429ef3df99a31b",
    measurementId: "G-QZMR3JSGBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth instance
export const auth = getAuth(app);
