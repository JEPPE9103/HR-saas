"use client";
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, indexedDBLocalPersistence, browserLocalPersistence, inMemoryPersistence, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

let app: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    const cfg = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    } as const;
    app = getApps().length ? getApps()[0]! : initializeApp(cfg);
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("[auth] authDomain:", cfg.authDomain, " host:", typeof window !== "undefined" ? window.location.hostname : "(ssr)");
    }
  }
  return app;
}

export const firebaseAuth = () => getAuth(getFirebaseApp());
export const firebaseDb = () => getFirestore(getFirebaseApp());
export const firebaseStorage = () => getStorage(getFirebaseApp());
let authSingleton: ReturnType<typeof getAuth> | undefined;
let persistenceSet = false;
export function getAuthClient(){
  if (!authSingleton) {
    authSingleton = firebaseAuth();
  }
  if (!persistenceSet && typeof window !== "undefined") {
    persistenceSet = true;
    (async () => {
      try {
        await setPersistence(authSingleton!, indexedDBLocalPersistence);
      } catch {
        try {
          await setPersistence(authSingleton!, browserLocalPersistence);
        } catch {
          await setPersistence(authSingleton!, inMemoryPersistence);
        }
      }
      authSingleton!.useDeviceLanguage();
    })();
  }
  return authSingleton!;
}

export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider("microsoft.com");
microsoftProvider.setCustomParameters({ prompt: "select_account" });


