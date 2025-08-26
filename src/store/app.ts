"use client";

import { create } from "zustand";

type Org = { id: string; name: string; country: string; currency: string };

type AppState = {
  org: Org | null;
  currentSnapshotId: string | null;
  isCopilotOpen: boolean;
  setOrg: (o: Org | null) => void;
  setSnapshotId: (id: string | null) => void;
  setCopilotOpen: (v: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  org: { id: "demo-org", name: "Demo Co.", country: "SE", currency: "SEK" },
  currentSnapshotId: "demo-se",
  isCopilotOpen: false,
  setOrg: (o) => set({ org: o }),
  setSnapshotId: (id) => set({ currentSnapshotId: id }),
  setCopilotOpen: (v) => set({ isCopilotOpen: v }),
}));


