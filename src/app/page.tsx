"use client";

import { useI18n } from "@/providers/I18nProvider";
import { MarketingFeatureCard } from "@/components/marketing/FeatureCard";
import { FinalCtaSection } from "@/components/marketing/FinalCtaSection";
import EnterpriseHeroChart from "@/components/hero/EnterpriseHeroChart";
import EnterpriseKpiCard from "@/components/marketing/EnterpriseKpiCard";
import { TrustLogos } from "@/components/marketing/TrustLogos";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowRight, Bot, ShieldCheck, BarChart3, FileSpreadsheet, Users, Lock, CheckCircle, Award, Zap, Check } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission - could redirect to signup with email pre-filled
    window.location.href = `/signup?email=${encodeURIComponent(email)}`;
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12">
      {/* HERO SECTION */}
      <section className="grid items-start gap-12 md:grid-cols-2 mb-24">
        {/* Left side: Content */}
        <div className="space-y-8">
          {/* Badges */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs
                             ring-1 ring-[var(--ring)] bg-[var(--panel)] text-[var(--text)]">
              <ShieldCheck className="h-3 w-3" /> {t("dashboard.euReady")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs
                             ring-1 ring-[var(--ring)] bg-[var(--panel)] text-[var(--text)]">
              <ShieldCheck className="h-3 w-3" /> {t("upload.badge.gdpr")}
            </span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl mb-6">
              <span className="text-[var(--text)]">{t("hero.title").split('.')[0]}.</span>{" "}
              <span className="text-[var(--text)] relative">
                {t("hero.title").split('.')[1]}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[var(--accent)] rounded-full"></span>
              </span>
            </h1>
            <p className="text-xl text-[var(--text-muted)] max-w-lg">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* CTA Form */}
          <div className="space-y-4">
            <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder={t("hero.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 text-base py-4"
              />
              <Button type="submit" className="whitespace-nowrap py-4 px-8 text-base font-medium bg-[var(--accent)] hover:bg-[var(--accent-strong)]">
                {t("cta.getStarted")} <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/dashboard?datasetId=demo-se"
                className="rounded-lg border border-[var(--ring)] px-6 py-3 text-[var(--text)] hover:bg-[var(--neutral-soft-bg)] transition font-medium
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {t("cta.tryDemo")}
              </a>
              <span className="text-sm text-[var(--text-muted)] flex items-center gap-1">
                <Check className="h-3 w-3" />
                {t("hero.noCreditCard")}
              </span>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <EnterpriseKpiCard 
              title={t("metrics.avgGap")} 
              value="5.6%" 
              icon="trending" 
              isHighlighted={true}
              yoyDelta={-0.8}
            />
            <EnterpriseKpiCard 
              title={t("metrics.sitesWithRisk")} 
              value="2" 
              icon="shield" 
              yoyDelta={-1}
            />
            <EnterpriseKpiCard 
              title={t("metrics.timeToExport")} 
              value="< 2 min" 
              icon="clock" 
            />
          </div>
        </div>
        
        {/* Right side: Chart */}
        <div className="h-[500px]">
          <EnterpriseHeroChart />
        </div>
      </section>

      {/* Trust Logos */}
      <TrustLogos />

      {/* Divider */}
      <div className="h-px bg-[var(--ring)] opacity-30 my-16"></div>

      {/* HOW IT WORKS */}
      <section className="mt-24 mb-24 bg-white rounded-3xl p-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[var(--text)] mb-4">{t('home.howItWorks')}</h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            {t('home.howItWorksSubtitle')}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <MarketingFeatureCard icon={<FileSpreadsheet className="h-8 w-8 text-[var(--accent)]" />} title={t('home.features.analyze.title')}>
            {t('home.features.analyze.body')}
          </MarketingFeatureCard>
          <MarketingFeatureCard icon={<Bot className="h-8 w-8 text-[var(--accent)]" />} title={t('home.features.copilot.title')}>
            {t('home.features.copilot.body')}
          </MarketingFeatureCard>
          <MarketingFeatureCard icon={<ShieldCheck className="h-8 w-8 text-[var(--success)]" />} title={t('home.features.compliance.title')}>
            {t('home.features.compliance.body')}
          </MarketingFeatureCard>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-[var(--ring)] opacity-30 my-16"></div>

      {/* TRUST & COMPLIANCE */}
      <section className="mt-24 mb-24 bg-white rounded-3xl p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text)] mb-4">{t('home.trust.title')}</h2>
          <p className="text-lg text-[var(--text-muted)]">{t('home.trust.subtitle')}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border p-6 text-center border-[var(--ring)] bg-[var(--card)] hover:border-[var(--success)] hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-[var(--success-soft-bg)] flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-[var(--success)]" />
            </div>
            <h3 className="font-semibold text-base text-[var(--text)] mb-2">{t('home.trust.iso27001.title')}</h3>
            <p className="text-sm text-[var(--text-muted)]">{t('home.trust.iso27001.body')}</p>
          </div>
          <div className="rounded-xl border p-6 text-center border-[var(--ring)] bg-[var(--card)] hover:border-[var(--accent)] hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-[var(--accent-soft-bg)] flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-[var(--accent)]" />
            </div>
            <h3 className="font-semibold text-base text-[var(--text)] mb-2">{t('home.trust.soc2.title')}</h3>
            <p className="text-sm text-[var(--text-muted)]">{t('home.trust.soc2.body')}</p>
          </div>
          <div className="rounded-xl border p-6 text-center border-[var(--ring)] bg-[var(--card)] hover:border-[var(--accent)] hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-[var(--accent-soft-bg)] flex items-center justify-center mx-auto mb-4">
              <Lock className="h-6 w-6 text-[var(--accent)]" />
            </div>
            <h3 className="font-semibold text-base text-[var(--text)] mb-2">{t('home.trust.gdpr.title')}</h3>
            <p className="text-sm text-[var(--text-muted)]">{t('home.trust.gdpr.body')}</p>
          </div>
          <div className="rounded-xl border p-6 text-center border-[var(--ring)] bg-[var(--card)] hover:border-[var(--success)] hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-[var(--success-soft-bg)] flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-[var(--success)]" />
            </div>
            <h3 className="font-semibold text-base text-[var(--text)] mb-2">{t('home.trust.euDirective.title')}</h3>
            <p className="text-sm text-[var(--text-muted)]">{t('home.trust.euDirective.body')}</p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-[var(--ring)] opacity-30 my-16"></div>

      {/* STRONG CTA SECTION */}
      <section className="mt-24 rounded-3xl border p-12 text-center border-[var(--ring)] bg-[var(--card)] hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] mb-6">{t('home.finalCta.title')}</h2>
        <p className="text-xl text-[var(--text-muted)] mb-8 max-w-3xl mx-auto">
          {t('home.finalCta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="/contact" 
            className="rounded-xl bg-[var(--accent)] px-8 py-4 text-white hover:bg-[var(--accent-strong)] transition font-semibold text-lg
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {t('home.finalCta.bookDemo')}
          </a>
          <a 
            href="/dashboard?datasetId=demo-se" 
            className="rounded-xl border px-8 py-4 text-[var(--text)] hover:bg-[var(--neutral-soft-bg)] transition font-semibold text-lg border-[var(--ring)]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {t('home.finalCta.tryDemo')}
          </a>
        </div>
      </section>

      <footer className="mt-16 text-center text-sm text-[var(--text-muted)]">
        © {new Date().getFullYear()} PayTransparency — {t('dashboard.euReady')}.
      </footer>
    </main>
  );
}
