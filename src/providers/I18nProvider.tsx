"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { sv } from "@/i18n/sv";
import { en } from "@/i18n/en";

type Locale = "sv" | "en";
type Messages = Record<string, string>;

const LOCALE_STORAGE_KEY = "pt_locale";

const registry: Record<Locale, Messages> = { sv, en };

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }){
  const [locale, setLocaleState] = useState<Locale>("sv");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null)) || null;
    if (saved && (saved === "sv" || saved === "en")) {
      setLocaleState(saved);
      return;
    }
    const nav = typeof navigator !== "undefined" ? navigator.language : "en";
    const auto: Locale = nav?.toLowerCase().startsWith("sv") ? "sv" : "en";
    setLocaleState(auto);
  }, []);

  function setLocale(l: Locale){
    setLocaleState(l);
    try{ localStorage.setItem(LOCALE_STORAGE_KEY, l); } catch {}
  }

  const t = useMemo(() => {
    const dict = registry[locale] || registry.sv;
    return (key: string) => dict[key] ?? key;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(){
  const ctx = useContext(I18nContext);
  if(!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}


