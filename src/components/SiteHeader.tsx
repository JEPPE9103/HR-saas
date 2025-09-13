"use client";

"use client";

import Link from "next/link";
import { useState } from "react";

import LanguageToggle from "@/components/LanguageToggle";
import { CheckCircle2 } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import { useI18n } from "@/providers/I18nProvider";

export function SiteHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="px-4 h-14 w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Noxheim" className="h-10 w-10 rounded-full object-contain" />
          <div className="text-lg font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">Noxheim</span>
          </div>
          <span className="ml-3 hidden sm:inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 bg-emerald-50 text-emerald-700 ring-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" /> EU Directive Ready
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-2 text-sm">
          <Link href="/" className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors duration-200">{t('nav.home')}</Link>
          <Link href="/overview" className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors duration-200">{t('nav.overview')}</Link>
          <Link href="/import" className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors duration-200">{t('nav.import')}</Link>
          <Link href="/contact" className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors duration-200">{t('nav.contact')}</Link>
          <Link href="/pricing" className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors duration-200">{t('nav.pricing')}</Link>
          <LanguageToggle />
          <UserMenu />
        </nav>
        <button
          aria-label="Open menu"
          className="md:hidden px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors duration-200"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-200/50 bg-white/95">
          <div className="px-4 py-3 flex flex-col gap-1">
            <Link href="/" className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50" onClick={()=>setOpen(false)}>{t('nav.home')}</Link>
            <Link href="/overview" className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50" onClick={()=>setOpen(false)}>{t('nav.overview')}</Link>
            <Link href="/import" className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50" onClick={()=>setOpen(false)}>{t('nav.import')}</Link>
            <Link href="/pricing" className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50" onClick={()=>setOpen(false)}>{t('nav.pricing')}</Link>
            <Link href="/contact" className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50" onClick={()=>setOpen(false)}>{t('nav.contact')}</Link>
          </div>
        </div>
      )}
    </header>
  );
}


