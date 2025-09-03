"use client";

import { useI18n } from "@/providers/I18nProvider";

export default function LanguageToggle(){
  const { locale, setLocale } = useI18n();
  return (
    <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
      <button
        aria-pressed={locale==='sv'}
        onClick={()=>setLocale('sv')}
        className={`px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${locale==='sv' ? 'bg-slate-100 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
      >SE</button>
      <button
        aria-pressed={locale==='en'}
        onClick={()=>setLocale('en')}
        className={`px-3 py-1.5 text-xs font-medium border-l border-slate-200 transition-colors duration-200 ${locale==='en' ? 'bg-slate-100 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
      >EN</button>
    </div>
  );
}


