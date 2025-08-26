"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, googleProvider, microsoftProvider } from "@/lib/firebase";
import type { UserDoc } from "@/lib/models";

type Ctx = {
  user: User | null;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  signInMicrosoft: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<Ctx>({
  user: null,
  loading: true,
  signInGoogle: async () => {},
  signInMicrosoft: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        const now = Date.now();
        if (!snap.exists()) {
          const payload: UserDoc = {
            uid: u.uid,
            email: u.email ?? "",
            name: u.displayName ?? undefined,
            role: "owner",
            createdAt: now,
            lastLoginAt: now,
          };
          await setDoc(ref, payload);
        } else {
          await updateDoc(ref, { lastLoginAt: now });
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo<Ctx>(() => ({
    user,
    loading,
    signInGoogle: async () => { await signInWithPopup(auth, googleProvider); },
    signInMicrosoft: async () => { await signInWithPopup(auth, microsoftProvider); },
    signOut: async () => { await signOut(auth); },
  }), [user, loading]);

  return (<AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>);
}

export function useAuth(){ return useContext(AuthCtx); }


