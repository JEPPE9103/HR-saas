"use client";

import { useI18n } from "@/providers/I18nProvider";
import EnterpriseHeroChart from "@/components/hero/EnterpriseHeroChart";
import { Bot, ShieldCheck, BarChart3, FileSpreadsheet, Lock, Zap, Percent, ShieldAlert, Clock } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState("");

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission - could redirect to signup with email pre-filled
    window.location.href = `/signup?email=${encodeURIComponent(email)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Elements - Light theme only */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100/30 to-slate-200/20" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-mint-200/40 to-teal-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-coral-200/30 to-rose-300/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center mb-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl mb-10 shadow-2xl">
              <ShieldCheck className="w-12 h-12 text-slate-700" />
            </div>
            
            {/* Typography Hierarchy */}
            <h1 className="text-6xl font-light text-slate-800 mb-8 leading-tight tracking-tight">
              {t("hero.title")}
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              {t("hero.subtitle")}
            </p>
            
            {/* Modern CTA Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <a href="/import" className="group relative px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white rounded-2xl font-medium transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <span className="relative z-10">{t("hero.cta.primary")}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              
              <a href="/overview?datasetId=demo-se" className="group px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
                  <span>{t("hero.cta.secondary")}</span>
                </div>
              </a>
            </div>
            
            {/* Modern Compliance Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-emerald-700">{t('home.compliance.euCompatible')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">{t('home.compliance.gdprSafe')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">{t('home.compliance.iso27001')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid items-start gap-16 lg:grid-cols-2 mb-16">
          {/* Left side: Content */}
          <div className="space-y-8">
            {/* KPI Cards - 2026 Modern Design */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-mint-200/20 to-teal-300/10 rounded-full blur-2xl" />
                <div className="relative z-10 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-mint-100 to-teal-200 flex items-center justify-center mx-auto mb-4">
                    <Percent className="h-8 w-8 text-teal-700" />
                  </div>
                  <h3 className="font-light text-base text-slate-800 mb-2">{t("metrics.avgGap")}</h3>
                  <p className="text-2xl font-light text-slate-800">5.6%</p>
                  <p className="text-sm text-slate-600 mt-1 font-light">-0.8% {t('home.kpi.fromLastYear')}</p>
                </div>
              </div>
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-coral-200/20 to-rose-300/10 rounded-full blur-2xl" />
                <div className="relative z-10 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-coral-100 to-rose-200 flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="h-8 w-8 text-rose-700" />
                  </div>
                  <h3 className="font-light text-base text-slate-800 mb-2">{t("metrics.sitesWithRisk")}</h3>
                  <p className="text-2xl font-light text-slate-800">2</p>
                  <p className="text-sm text-slate-600 mt-1 font-light">-1 {t('home.kpi.fromLastYear')}</p>
                </div>
              </div>
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sage-200/20 to-emerald-300/10 rounded-full blur-2xl" />
                <div className="relative z-10 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sage-100 to-emerald-200 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-emerald-700" />
                  </div>
                  <h3 className="text-xl font-light text-slate-800 mb-2">{t("metrics.timeToExport")}</h3>
                  <p className="text-2xl font-light text-slate-800">&lt; 2 min</p>
                  <p className="text-sm text-slate-600 mt-1 font-light">{t('home.kpi.quickExport')}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side: Chart */}
          <div className="h-[500px]">
            <EnterpriseHeroChart />
          </div>
        </div>

        {/* HOW IT WORKS - 2026 Modern Design */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-light text-slate-800 mb-6 tracking-tight">{t('home.howItWorks')}</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed mb-16">
            {t('home.howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-20">
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mint-200/20 to-teal-300/10 rounded-full blur-2xl" />
            <div className="relative z-10 text-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-mint-100 to-teal-200 flex items-center justify-center mx-auto mb-6">
                <FileSpreadsheet className="h-10 w-10 text-teal-700" />
              </div>
              <h3 className="text-xl font-light text-slate-800 mb-4">{t('home.features.analyze.title')}</h3>
              <p className="text-slate-600 font-light leading-relaxed">{t('home.features.analyze.body')}</p>
            </div>
          </div>
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-coral-200/20 to-rose-300/10 rounded-full blur-2xl" />
            <div className="relative z-10 text-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-coral-100 to-rose-200 flex items-center justify-center mx-auto mb-6">
                <Bot className="h-10 w-10 text-rose-700" />
              </div>
              <h3 className="text-xl font-light text-slate-800 mb-4">{t('home.features.copilot.title')}</h3>
              <p className="text-slate-600 font-light leading-relaxed">{t('home.features.copilot.body')}</p>
            </div>
          </div>
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage-200/20 to-emerald-300/10 rounded-full blur-2xl" />
            <div className="relative z-10 text-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-sage-100 to-emerald-200 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-10 w-10 text-emerald-700" />
              </div>
              <h3 className="text-xl font-light text-slate-800 mb-4">{t('home.features.compliance.title')}</h3>
              <p className="text-slate-600 font-light leading-relaxed">{t('home.features.compliance.body')}</p>
            </div>
          </div>
        </div>

        {/* Trust & Compliance - 2026 Modern Design */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-slate-800 mb-4 tracking-tight">{t("home.trust.title")}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">{t("home.trust.subtitle")}</p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Speed Card */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-mint-50 to-teal-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mint-200/20 to-teal-300/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mint-200 to-teal-200 flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="text-2xl font-light text-slate-800 mb-4">{t("home.trust.speed.title")}</h3>
                <p className="text-slate-600 leading-relaxed font-light">{t("home.trust.speed.body")}</p>
              </div>
            </div>
            
            {/* Security Card */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-sage-50 to-emerald-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage-200/20 to-emerald-300/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sage-200 to-emerald-200 flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8 text-sage-700" />
                </div>
                <h3 className="text-2xl font-light text-slate-800 mb-4">{t("home.trust.security.title")}</h3>
                <p className="text-slate-600 leading-relaxed font-light">{t("home.trust.security.body")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* STRONG CTA SECTION - 2026 Modern Design */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-light text-slate-800 mb-6 tracking-tight">{t('home.finalCta.title')}</h2>
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
            {t('home.finalCta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="/contact" 
              className="group px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white rounded-2xl font-medium transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              {t('home.finalCta.bookDemo')}
            </a>
            <a 
              href="/overview?datasetId=demo-se" 
              className="group px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t('home.finalCta.tryDemo')}
            </a>
          </div>
        </div>

        <footer className="text-center text-sm text-slate-500 font-light">
          © {new Date().getFullYear()} Noxheim — {t('dashboard.euReady')}.
        </footer>
      </div>
    </div>
  );
}
