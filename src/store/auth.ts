"use client";

import { create } from "zustand";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";

type AuthState = {
  user: User | null;
  loading: boolean;
  error?: string;
  init: () => void;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  init: () => {
    const auth = firebaseAuth();
    onAuthStateChanged(auth, (u) => set({ user: u, loading: false }));
  },
  signInGoogle: async () => {
    const auth = firebaseAuth();
    await signInWithPopup(auth, new GoogleAuthProvider());
  },
  signOut: async () => {
    await firebaseAuth().signOut();
  },
}));


