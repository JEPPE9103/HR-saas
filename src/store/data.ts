"use client";

import { create } from "zustand";
import { Employee } from "@/types";

const STORAGE_KEY = "transpara:data";
const THEME_KEY = "transpara:theme";

export interface DataState {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  clearEmployees: () => void;
  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;
  setThemePreference: (theme: "light" | "dark") => void;
  getThemePreference: () => "light" | "dark" | undefined;
}

export const useDataStore = create<DataState>((set, get) => ({
  employees: [],
  setEmployees: (employees) => set({ employees }),
  clearEmployees: () => set({ employees: [] }),
  loadFromLocalStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { employees?: Employee[] };
      if (Array.isArray(parsed?.employees)) {
        set({ employees: parsed.employees });
      }
    } catch {
      // ignore
    }
  },
  saveToLocalStorage: () => {
    if (typeof window === "undefined") return;
    const { employees } = get();
    const payload = JSON.stringify({ employees });
    window.localStorage.setItem(STORAGE_KEY, payload);
  },
  setThemePreference: (theme) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(THEME_KEY, theme);
  },
  getThemePreference: () => {
    if (typeof window === "undefined") return undefined;
    const t = window.localStorage.getItem(THEME_KEY);
    if (t === "dark" || t === "light") return t;
    return undefined;
  },
}));


