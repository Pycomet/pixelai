// auth.ts
import { auth } from "@/lib/firebase/firebaseConfig"; // Adjust the path to your config file
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged as _onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";

// Type for the callback function used in onAuthStateChanged
type AuthStateChangedCallback = (user: User | null) => void;

export function onAuthStateChanged(cb: AuthStateChangedCallback): () => void {
    return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();

    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error signing in with Google", error);
    }
}

export async function signOut(): Promise<void> {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Error signing out with Google", error);
    }
}
