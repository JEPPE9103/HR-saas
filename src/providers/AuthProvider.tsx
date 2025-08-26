"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getAuthClient, firebaseDb as dbFactory } from "@/lib/firebase/client";
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
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const db = dbFactory();
  const auth = getAuthClient();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u ?? null);
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
    user: user ?? null,
    loading,
    signInGoogle: async () => {},
    signInMicrosoft: async () => {},
    signOut: async () => { await signOut(auth); },
  }), [user, loading]);

  if (user === undefined) return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;
  return (<AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>);
}

export function useAuth(){ return useContext(AuthCtx); }


