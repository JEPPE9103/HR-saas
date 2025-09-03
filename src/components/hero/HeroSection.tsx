"use client";

import CopilotDemo from "./CopilotDemo";
import { useI18n } from "@/providers/I18nProvider";
import HeroChart from "./HeroChart";
import { ShieldCheck } from "lucide-react";

export default function HeroSection() {
  const { t } = useI18n();
  return (
    <section className="grid items-start gap-8 md:grid-cols-2">
      <div className="relative">


        {/* Badges */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs
                           ring-1 ring-zinc-200 bg-white text-zinc-800">
            <ShieldCheck className="h-3 w-3" /> {t("dashboard.euReady")}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs
                           ring-1 ring-zinc-200 bg-white text-zinc-800">
            <ShieldCheck className="h-3 w-3" /> {t("upload.badge.gdpr")}
          </span>
        </div>

        {/* Titel */}
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl text-zinc-900">
          {t("hero.title")}
        </h1>

        {/* Subtitel */}
        <p className="mt-3 max-w-lg text-zinc-800">
          {t("hero.subtitle")}
        </p>

        {/* KPI-rad */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="card-muted rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-xs text-zinc-500">{t("metrics.avgGap")}</div>
            <div className="text-2xl font-semibold text-zinc-900">5.6%</div>
          </div>
          <div className="card-muted rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-xs text-zinc-500">{t("metrics.sitesWithRisk")}</div>
            <div className="text-2xl font-semibold text-zinc-900">2</div>
          </div>
          <div className="card-muted rounded-xl border border-zinc-200 bg-white p-0.5 hover:shadow-md">
            <div className="text-xs text-zinc-500">{t("metrics.timeToExport")}</div>
            <div className="text-2xl font-semibold text-zinc-900">&lt; 2 min</div>
          </div>
        </div>

        {/* Knappar */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href="/import"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            {t("cta.getStarted")}
          </a>
          <a
            href="/overview?datasetId=demo-se"
            className="rounded-lg border border-zinc-200 px-4 py-2 text-zinc-900 hover:bg-zinc-100"
          >
            {t("cta.tryDemo")}
          </a>
          <div className="ml-2 hidden md:block">
            <CopilotDemo />
          </div>
        </div>
      </div>

      <HeroChart />
    </section>
  );
}
