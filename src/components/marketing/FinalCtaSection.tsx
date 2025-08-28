"use client";

import { useI18n } from "@/providers/I18nProvider";

export function FinalCtaSection(){
  const { t } = useI18n();
  return (
    <section className="mt-16 rounded-3xl border p-8 text-center border-[var(--ring)] bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900/40 dark:to-cyan-900/30">
      <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text)]">{t('home.finalCta.title')}</h2>
      <p className="mt-2 text-slate-700 dark:text-slate-300">{t('home.finalCta.subtitle')}</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <a href="/import" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700 transition">{t('cta.getStarted')}</a>
        <a href="/contact" className="rounded-xl border px-5 py-2.5 text-indigo-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 transition border-indigo-300 dark:border-[var(--ring)]">{t('home.finalCta.talkToSales')}</a>
      </div>
    </section>
  );
}


