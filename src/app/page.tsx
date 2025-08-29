"use client";

import { useI18n } from "@/providers/I18nProvider";
import { KpiCard } from "@/components/marketing/KpiCard";
import { MarketingFeatureCard } from "@/components/marketing/FeatureCard";
import { TrustLogos } from "@/components/marketing/TrustLogos";
import { FinalCtaSection } from "@/components/marketing/FinalCtaSection";
import HeroChart from "@/components/hero/HeroChart";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Timer, ShieldAlert, TrendingDown, Bot, ShieldCheck, BarChart3, FileSpreadsheet, Users, Lock, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function HomePage(){
  const { t } = useI18n();
  const [email, setEmail] = useState("");

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission - could redirect to signup with email pre-filled
    window.location.href = `/signup?email=${encodeURIComponent(email)}`;
  };

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

            {/* Title: mörk i light, gradient i dark */}
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

            {/* Enhanced subtitle with business value */}
            <p className="mt-3 max-w-lg text-zinc-800 dark:text-slate-400">
              Achieve EU Pay Transparency compliance, ensure GDPR safety, and drive ROI with AI-powered pay equity analysis. Export executive-ready reports in minutes.
            </p>

            {/* Enhanced CTA area with email form */}
            <div className="mt-6 space-y-4">
              <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" className="whitespace-nowrap">
                  {t("cta.getStarted")}
                </Button>
              </form>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/dashboard?datasetId=demo-se"
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-zinc-700 hover:bg-zinc-100 transition
                             dark:border-[var(--ring)] dark:text-zinc-200 dark:hover:bg-zinc-800
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  {t("cta.tryDemo")}
                </a>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  No credit card required • 14-day free trial
                </span>
              </div>
            </div>
          </div>

          {/* KPI cards */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <KpiCard title={t('metrics.avgGap')} value="5.6%" icon={<TrendingDown className="h-5 w-5 text-indigo-400"/>} tone="neutral" />
            <KpiCard title={t('metrics.sitesWithRisk')} value="2" icon={<ShieldAlert className="h-5 w-5 text-amber-400"/>} tone="warning" />
            <KpiCard title={t('metrics.timeToExport')} value="< 2 min" icon={<Timer className="h-5 w-5 text-emerald-400"/>} tone="success" />
          </div>
        </div>
        <HeroChart />
      </section>

      {/* TRUST */}
      <TrustLogos />

      {/* HOW IT WORKS */}
      <section className="mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-[var(--text)] mb-4">{t('home.howItWorks')}</h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            Get from raw data to actionable insights in three simple steps
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <MarketingFeatureCard icon={<FileSpreadsheet className="h-5 w-5 text-indigo-300" />} title={t('home.features.analyze.title')}>
            {t('home.features.analyze.body')}
          </MarketingFeatureCard>
          <MarketingFeatureCard icon={<Bot className="h-5 w-5 text-teal-300" />} title={t('home.features.copilot.title')}>
            {t('home.features.copilot.body')}
          </MarketingFeatureCard>
          <MarketingFeatureCard icon={<ShieldCheck className="h-5 w-5 text-emerald-300" />} title={t('home.features.compliance.title')}>
            {t('home.features.compliance.body')}
          </MarketingFeatureCard>
        </div>
      </section>

      {/* TRUST & COMPLIANCE */}
      <section className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">Trust & Compliance</h2>
          <p className="text-[var(--text-muted)]">Built for enterprise security and regulatory requirements</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border p-4 text-center border-[var(--ring)] bg-[var(--panel)] hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-medium text-sm text-[var(--text)] mb-1">EU Directive Ready</h3>
            <p className="text-xs text-[var(--text-muted)]">Full compliance with EU Pay Transparency Directive</p>
          </div>
          <div className="rounded-xl border p-4 text-center border-[var(--ring)] bg-[var(--panel)] hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
              <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-medium text-sm text-[var(--text)] mb-1">GDPR Safe</h3>
            <p className="text-xs text-[var(--text-muted)]">No PII stored, anonymized data processing</p>
          </div>
          <div className="rounded-xl border p-4 text-center border-[var(--ring)] bg-[var(--panel)] hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-medium text-sm text-[var(--text)] mb-1">Anonymization Built-in</h3>
            <p className="text-xs text-[var(--text-muted)]">Automatic data anonymization and privacy protection</p>
          </div>
          <div className="rounded-xl border p-4 text-center border-[var(--ring)] bg-[var(--panel)] hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-medium text-sm text-[var(--text)] mb-1">ISO 27001</h3>
            <p className="text-xs text-[var(--text-muted)]">Enterprise-grade security certification</p>
          </div>
        </div>
      </section>

      {/* STRONG CTA SECTION */}
      <section className="mt-16 rounded-3xl border p-8 text-center border-[var(--ring)] bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900/40 dark:to-cyan-900/30">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] mb-4">Ready to transform your pay equity strategy?</h2>
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
          Join leading companies achieving compliance and driving meaningful change. Book a personalized demo to see how we can help your organization.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="/contact" 
            className="rounded-xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 transition font-medium
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Book a Demo
          </a>
          <a 
            href="/dashboard?datasetId=demo-se" 
            className="rounded-xl border px-6 py-3 text-indigo-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 transition font-medium border-indigo-300 dark:border-[var(--ring)]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Try Demo Now
          </a>
        </div>
      </section>

      <footer className="mt-12 text-center text-xs text-indigo-600 dark:text-slate-400">
        © {new Date().getFullYear()} PayTransparency — {t('dashboard.euReady')}.
      </footer>
    </main>
  );
}
