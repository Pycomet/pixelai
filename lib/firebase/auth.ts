// auth.ts
import { auth, db } from "@/lib/firebase/firebaseConfig"; // Adjust the path to your config file
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged as _onAuthStateChanged,
} from "firebase/auth";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Type for the callback function used in onAuthStateChanged
type AuthStateChangedCallback = (user: User | null) => void;

export async function createNewUser(
  email: string,
  password: string,
  displayName: string,
  isSubscribed: boolean
): Promise<User | null> {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user: User = response.user;

    // Add diplay name
    await updateProfile(user, { displayName });

    // Other parameters
    await setDoc(doc(db, "users", user.uid), {
      displayName,
      email,
      isSubscribed,
    });

    console.log("Successfully created a new user:", response.user);
    return user;
  } catch (error) {
    console.error("Error creating user", error);
    return null;
  }
}

export function onAuthStateChanged(cb: AuthStateChangedCallback): () => void {
  return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);

    // TODO: Add User Data To Database For Reference
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signInWithGithub(): Promise<void> {
  const provider = new GithubAuthProvider();

  try {
    await signInWithPopup(auth, provider);

    // TODO: Add User Data To Database For Reference
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export const signInWithPassword = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);

    if (response.user) {
      console.log("Successfully signed in with password:", response.user);
      return response.user;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error signing in with Google", error);
    return null;
  }
};

export async function signOut(): Promise<void> {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
