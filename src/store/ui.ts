"use client";

import { create } from "zustand";

type SimulationDrawerState = {
  open: boolean;
  setOpen: (v: boolean) => void;
  defaults?: { role?: string; percent?: number };
  setDefaults: (d?: { role?: string; percent?: number }) => void;
  resultText?: string;
  setResultText: (t?: string) => void;
  result?: { gapPercent: number; impacted: number; budgetAnnual: number };
  setResult: (r?: { gapPercent: number; impacted: number; budgetAnnual: number }) => void;
  resultOpen: boolean;
  setResultOpen: (v: boolean) => void;
};

export const useSimulationDrawer = create<SimulationDrawerState>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
  defaults: undefined,
  setDefaults: (d) => set({ defaults: d }),
  resultText: undefined,
  setResultText: (t) => set({ resultText: t }),
  result: undefined,
  setResult: (r) => set({ result: r }),
  resultOpen: false,
  setResultOpen: (v) => set({ resultOpen: v }),
}));


