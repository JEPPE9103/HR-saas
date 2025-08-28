"use client";

import { useI18n } from "@/providers/I18nProvider";

export default function LanguageToggle(){
  const { locale, setLocale } = useI18n();
  return (
    <div className="inline-flex rounded-lg border border-[var(--ring)] overflow-hidden">
      <button
        aria-pressed={locale==='sv'}
        onClick={()=>setLocale('sv')}
        className={`px-2 py-1 text-xs ${locale==='sv' ? 'bg-[var(--muted)] text-[var(--text)]' : 'text-[var(--text)]/70 hover:bg-slate-50'}`}
      >SE</button>
      <button
        aria-pressed={locale==='en'}
        onClick={()=>setLocale('en')}
        className={`px-2 py-1 text-xs border-l border-[var(--ring)] ${locale==='en' ? 'bg-[var(--muted)] text-[var(--text)]' : 'text-[var(--text)]/70 hover:bg-slate-50'}`}
      >EN</button>
    </div>
  );
}


