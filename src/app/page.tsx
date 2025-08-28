"use client";

import TrustStrip from "@/components/TrustStrip";
import FeatureCard from "@/components/FeatureCard";
import HeroSection from "@/components/hero/HeroSection";
import { Bot, ShieldCheck, BarChart3 } from "lucide-react";
import { useI18n } from "@/providers/I18nProvider";

export default function HomePage(){
  const { t } = useI18n();
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <HeroSection />

      {/* TRUST */}
      <section className="mt-10">
        <TrustStrip />
      </section>

      {/* FEATURES */}
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <FeatureCard icon={<BarChart3 className="h-4 w-4 text-indigo-300" />} title={t('home.features.analyze.title')}>
          {t('home.features.analyze.body')}
        </FeatureCard>
        <FeatureCard icon={<Bot className="h-4 w-4 text-teal-300" />} title={t('home.features.copilot.title')}>
          {t('home.features.copilot.body')}
        </FeatureCard>
        <FeatureCard icon={<ShieldCheck className="h-4 w-4 text-emerald-300" />} title={t('home.features.compliance.title')}>
          {t('home.features.compliance.body')}
        </FeatureCard>
      </section>

      {/* HOW IT WORKS (compressed) */}
      <section className="mt-10 rounded-xl border p-5 border-[var(--ring)] bg-[var(--panel)]">
        <h2 className="text-lg font-semibold text-[var(--text)]">{t('home.howItWorks')}</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
          <li className="rounded-lg border p-4 border-[var(--ring)] bg-[var(--panel)]">{t('home.step1')}</li>
          <li className="rounded-lg border p-4 border-[var(--ring)] bg-[var(--panel)]">{t('home.step2')}</li>
          <li className="rounded-lg border p-4 border-[var(--ring)] bg-[var(--panel)]">{t('home.step3')}</li>
        </ol>
        <div className="mt-5 flex gap-3">
          <a href="/dashboard?datasetId=demo-se" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">{t('cta.tryDemo')}</a>
          <a href="/import" className="rounded-lg border px-4 py-2 hover:bg-slate-50 border-[var(--ring)]">{t('dashboard.uploadData')}</a>
        </div>
      </section>

      <footer className="mt-12 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} PayTransparency — {t('dashboard.euReady')}.
      </footer>
    </main>
  );
}
