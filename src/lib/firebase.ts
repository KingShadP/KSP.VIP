import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Inject API key from environment variables to prevent hardcoding secrets
const config = {
  ...firebaseConfig,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY
};

const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp };
