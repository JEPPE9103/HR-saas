import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

let app: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    // Client SDK only used in the browser for this app
    throw new Error("getFirebaseApp should be called on the client");
  }
  if (!app) {
    const cfg = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    };
    app = getApps().length ? getApps()[0]! : initializeApp(cfg);
  }
  return app;
}

export const firebaseAuth = () => getAuth(getFirebaseApp());
export const firebaseDb = () => getFirestore(getFirebaseApp());
export const firebaseStorage = () => getStorage(getFirebaseApp());


