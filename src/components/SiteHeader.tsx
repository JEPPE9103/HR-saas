"use client";

import Link from "next/link";

import LanguageToggle from "@/components/LanguageToggle";
import { CheckCircle2 } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import { useI18n } from "@/providers/I18nProvider";

export function SiteHeader() {
  const { t } = useI18n();
  
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="px-4 h-14 w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium">+</div>
          <div className="text-lg font-semibold tracking-tight">
            <span className="text-slate-800">Pay</span>
            <span className="text-slate-600">Transparency</span>
          </div>
          <span className="ml-3 hidden sm:inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 bg-emerald-50 text-emerald-700 ring-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" /> EU Directive Ready
          </span>
        </div>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors duration-200">{t('nav.home')}</Link>
          <Link href="/overview" className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors duration-200">{t('nav.overview')}</Link>
          <Link href="/import" className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors duration-200">{t('nav.import')}</Link>
          <Link href="/pricing" className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors duration-200">{t('nav.pricing')}</Link>
          <LanguageToggle />
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}


