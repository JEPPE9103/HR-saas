import React from "react";
import { useI18n } from "@/providers/I18nProvider";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-slate-200/50 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Noxheim" className="h-8 w-8 rounded-full object-contain" />
          <span>© {new Date().getFullYear()} Noxheim</span>
        </div>
        <nav className="flex items-center gap-4">
          <a href="/privacy" className="hover:text-slate-800 hover:underline underline-offset-4">{t('nav.privacy') ?? 'Privacy'}</a>
          <a href="/terms" className="hover:text-slate-800 hover:underline underline-offset-4">{t('nav.terms') ?? 'Terms'}</a>
          <a href="/contact" className="hover:text-slate-800 hover:underline underline-offset-4">{t('nav.contact')}</a>
        </nav>
      </div>
    </footer>
  );
}


