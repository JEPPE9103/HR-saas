"use client";

import { useI18n } from "@/providers/I18nProvider";
import { KpiCard } from "@/components/marketing/KpiCard";
import { MarketingFeatureCard } from "@/components/marketing/FeatureCard";
import { TrustLogos } from "@/components/marketing/TrustLogos";
import { FinalCtaSection } from "@/components/marketing/FinalCtaSection";
import HeroChart from "@/components/hero/HeroChart";
import { Timer, ShieldAlert, TrendingDown, Bot, ShieldCheck, BarChart3 } from "lucide-react";

export default function HomePage(){
  const { t } = useI18n();
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      {/* HERO */}
      <section className="grid items-start gap-8 md:grid-cols-2">
        <div>
          {/* Hero content */}
          <div className="relative">
            {/* Glow: av i light, på i dark */}
            <div
              className="hidden dark:block pointer-events-none absolute -inset-x-4 -top-6 h-24
                         bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 blur-2xl"
              aria-hidden="true"
            />

            {/* Badges */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs
                               ring-1 ring-zinc-200 bg-white text-zinc-800
                               dark:ring-[var(--ring)] dark:bg-[var(--panel)] dark:text-[var(--text)]">
                <ShieldCheck className="h-3 w-3" /> {t("dashboard.euReady")}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs
                               ring-1 ring-zinc-200 bg-white text-zinc-800
                               dark:ring-[var(--ring)] dark:bg-[var(--panel)] dark:text-[var(--text)]">
                <ShieldCheck className="h-3 w-3" /> {t("upload.badge.gdpr")}
              </span>
            </div>

            {/* Titel: mörk i light, gradient i dark */}
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              {/* Light mode: tydlig mörk text */}
              <span className="inline dark:hidden text-zinc-900">
                {t("hero.title")}
              </span>
              {/* Dark mode: gradient */}
              <span className="hidden dark:inline bg-gradient-to-br from-indigo-300 via-indigo-200 to-emerald-200 bg-clip-text text-transparent drop-shadow-sm">
                {t("hero.title")}
              </span>
            </h1>

            {/* Subtitel */}
            <p className="mt-3 max-w-lg text-zinc-800 dark:text-slate-400">
              {t("hero.subtitle")}
            </p>

            {/* Knappar */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href="/import"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                {t("cta.getStarted")}
              </a>
              <a
                href="/dashboard?datasetId=demo-se"
                className="rounded-lg border border-zinc-200 px-4 py-2 text-zinc-700 hover:bg-zinc-100 transition
                           dark:border-[var(--ring)] dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {t("cta.tryDemo")}
              </a>
            </div>
          </div>

          {/* KPI cards */}
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <KpiCard title={t('metrics.avgGap')} value="5.6%" icon={<TrendingDown className="h-5 w-5 text-indigo-400"/>} tone="neutral" />
            <KpiCard title={t('metrics.sitesWithRisk')} value="2" icon={<ShieldAlert className="h-5 w-5 text-amber-400"/>} tone="warning" />
            <KpiCard title={t('metrics.timeToExport')} value="< 2 min" icon={<Timer className="h-5 w-5 text-emerald-400"/>} tone="success" />
          </div>
        </div>
        <HeroChart />
      </section>

      {/* TRUST */}
      <TrustLogos />

      {/* FEATURES */}
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <MarketingFeatureCard icon={<BarChart3 className="h-5 w-5 text-indigo-300" />} title={t('home.features.analyze.title')}>
          {t('home.features.analyze.body')}
        </MarketingFeatureCard>
        <MarketingFeatureCard icon={<Bot className="h-5 w-5 text-teal-300" />} title={t('home.features.copilot.title')}>
          {t('home.features.copilot.body')}
        </MarketingFeatureCard>
        <MarketingFeatureCard icon={<ShieldCheck className="h-5 w-5 text-emerald-300" />} title={t('home.features.compliance.title')}>
          {t('home.features.compliance.body')}
        </MarketingFeatureCard>
      </section>

      {/* HOW IT WORKS (compressed) */}
      <section className="mt-10 rounded-xl border p-5 border-[var(--ring)] bg-[var(--panel)]">
        <h2 className="text-lg font-semibold text-[var(--text)]">{t('home.howItWorks')}</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
          <li className="rounded-lg border p-4 border-indigo-200 dark:border-[var(--ring)] bg-indigo-50 dark:bg-[var(--panel)] text-slate-800 dark:text-slate-300">{t('home.step1')}</li>
          <li className="rounded-lg border p-4 border-indigo-200 dark:border-[var(--ring)] bg-indigo-50 dark:bg-[var(--panel)] text-slate-800 dark:text-slate-300">{t('home.step2')}</li>
          <li className="rounded-lg border p-4 border-indigo-200 dark:border-[var(--ring)] bg-indigo-50 dark:bg-[var(--panel)] text-slate-800 dark:text-slate-300">{t('home.step3')}</li>
        </ol>
        <div className="mt-5 flex gap-3">
          <a href="/dashboard?datasetId=demo-se" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">{t('cta.tryDemo')}</a>
          <a href="/import" className="rounded-lg border px-4 py-2 text-indigo-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 transition border-indigo-300 dark:border-[var(--ring)]">{t('dashboard.uploadData')}</a>
        </div>
      </section>

      <FinalCtaSection />

      <footer className="mt-12 text-center text-xs text-indigo-600 dark:text-slate-400">
        © {new Date().getFullYear()} PayTransparency — {t('dashboard.euReady')}.
      </footer>
    </main>
  );
}
