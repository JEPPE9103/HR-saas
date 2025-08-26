"use client";

import { create } from "zustand";

export type ReportBlock = { id: string; type: string; title: string; payload?: any };

type ReportState = {
  blocks: ReportBlock[];
  addBlock: (b: Omit<ReportBlock, "id">) => void;
  removeBlock: (id: string) => void;
  clear: () => void;
};

export const useReportStore = create<ReportState>((set) => ({
  blocks: [],
  addBlock: (b) => set((s) => ({ blocks: [...s.blocks, { id: Math.random().toString(36).slice(2), ...b }] })),
  removeBlock: (id) => set((s) => ({ blocks: s.blocks.filter((x) => x.id !== id) })),
  clear: () => set({ blocks: [] }),
}));


