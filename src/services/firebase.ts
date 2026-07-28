import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Optional Firebase initializer
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
export const googleProvider = new GoogleAuthProvider();

export { app, auth, db };
