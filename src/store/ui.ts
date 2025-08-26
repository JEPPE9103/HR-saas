"use client";

import { create } from "zustand";

type SimulationDrawerState = {
  open: boolean;
  setOpen: (v: boolean) => void;
  defaults?: { role?: string; percent?: number };
  setDefaults: (d?: { role?: string; percent?: number }) => void;
};

export const useSimulationDrawer = create<SimulationDrawerState>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
  defaults: undefined,
  setDefaults: (d) => set({ defaults: d }),
}));


