"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Upload, FileDown, RotateCcw, Bot } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import RiskPanel from "@/components/dashboard/RiskPanel";
import ActionQueue from "@/components/dashboard/ActionQueue";
import { SimulationDrawer } from "@/components/SimulationDrawer";
import SimulationStickyBar from "@/components/SimulationStickyBar";
import SimulationResultPanel from "@/components/SimulationResultPanel";
import { CopilotPanel } from "@/components/copilot/CopilotPanel";
import { useI18n } from "@/providers/I18nProvider";
import { useAppStore } from "@/store/app";

const kpis = [
  { label: "Gender pay gap", value: 5.6, delta: -0.8, suffix: "%" },
  { label: "High-variance roles", value: 4, delta: -1, suffix: "" },
  { label: "Compliance-risk sites", value: 2, delta: +1, suffix: "" },
  { label: "Employees analyzed", value: 523, delta: +23, suffix: "" },
];

const gapTrend = [
  { m: "Aug", gap: 6.2, bench: 5.5 },
  { m: "Sep", gap: 5.9, bench: 5.4 },
  { m: "Oct", gap: 5.7, bench: 5.3 },
  { m: "Nov", gap: 5.4, bench: 5.2 },
  { m: "Dec", gap: 5.2, bench: 5.2 },
  { m: "Jan", gap: 5.1, bench: 5.1 },
  { m: "Feb", gap: 5.0, bench: 5.1 },
  { m: "Mar", gap: 5.3, bench: 5.1 },
  { m: "Apr", gap: 5.4, bench: 5.0 },
  { m: "May", gap: 5.5, bench: 5.0 },
  { m: "Jun", gap: 5.6, bench: 5.0 },
  { m: "Jul", gap: 5.6, bench: 5.0 },
];

const insights = [
  { title: "Engineering gap 8.2% (High)", body: "Recommend +5% adj for IC2–IC4. Est. budget +€240k, new gap 2.1%." },
  { title: "H&M har 2 outliers >40% över median", body: "Se över undantag; tak vid P90 för IC-nivåer." },
  { title: "Female % in leadership trending down", body: "Set target P50 by Q4; simulate promotion uplift for top performers." },
];

export default function DashboardClient(){
  const { t } = useI18n();
  const sp = useSearchParams();
  const router = useRouter();
  const datasetId = sp.get("datasetId") || "demo-se";
  const [computedAt, setComputedAt] = useState<string>("23 Aug 2026");
  const setCopilotOpen = useAppStore((s) => s.setCopilotOpen);

  return (
    <div className="px-6 lg:px-10 py-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">{t("dashboard.title")}</h1>
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span>{t("dashboard.lastComputed")} {computedAt}</span>
            <button aria-label="Recompute dataset" onClick={async()=>{ const r = await fetch('/api/analyze',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ datasetId })}); const j = await r.json(); if(j?.computedAt){ setComputedAt(new Date(j.computedAt).toLocaleDateString()); } }} className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50"><RotateCcw className="h-3 w-3"/> {t("common.recompute")}</button>
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-[var(--success-soft-ring)]">{t("dashboard.euReady")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select aria-label="Select dataset" value={datasetId} onChange={(e)=>{ const v=e.target.value; router.push(`/dashboard?datasetId=${encodeURIComponent(v)}`); }} className="rounded-lg border px-3 py-2 text-[var(--text)] border-[var(--ring)] bg-[var(--panel)]">
            {['demo-se','demo-de','demo-uk'].map(ds => (<option key={ds} value={ds}>{ds}</option>))}
          </select>
          <button 
            onClick={() => setCopilotOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-white hover:bg-[var(--accent-strong)] transition font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <Bot className="h-4 w-4" /> Ask Copilot about this dataset
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-[var(--neutral-soft-bg)] border-[var(--ring)] text-[var(--text)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
            <Upload className="h-4 w-4" /> {t("dashboard.uploadData")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k, idx) => (
          <div key={k.label} className="card-muted p-4 shadow-md hover:shadow-lg rounded-xl transition-transform hover:-translate-y-0.5">
            <div className="text-sm text-slate-600 dark:text-slate-400">{
              [t('dashboard.kpi.gap'), t('dashboard.kpi.highVarianceRoles'), t('dashboard.kpi.riskSites'), t('dashboard.kpi.employees')][idx]
            }</div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-3xl font-semibold text-[var(--text)]">{k.value}{k.suffix}</div>
              <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 ${k.delta>=0 ? "bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-[var(--success-soft-ring)]" : "bg-[var(--danger-soft-bg)] text-[var(--danger-soft-fg)] ring-[var(--danger-soft-ring)]"}`}>
                {k.delta>=0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {k.delta>=0 ? "+" : ""}{k.delta}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-7 card-muted rounded-xl p-4 shadow-md">
          <div className="mb-2 text-sm text-slate-600 dark:text-slate-400">{t("dashboard.trend")}</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gapTrend}>
                <CartesianGrid vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="m" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="gap" stroke="#2563EB" strokeWidth={2} dot={false}/>
                <Line type="monotone" dataKey="bench" stroke="#14B8A6" strokeWidth={2} strokeDasharray="4 4" dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-5">
          <RiskPanel />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-7 card-muted rounded-xl p-4 shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm subtle">{t('dashboard.insightsCard.title')}</div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 hover:bg-slate-50 border-[var(--ring)]">
                <FileDown className="h-4 w-4" /> {t('insights.exportBrief')}
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { title: t('dashboard.insights.sample1.title'), body: t('dashboard.insights.sample1.body') },
              { title: t('dashboard.insights.sample2.title'), body: t('dashboard.insights.sample2.body') },
              { title: t('dashboard.insights.sample3.title'), body: t('dashboard.insights.sample3.body') },
            ].map((it, i)=>(
              <div key={i} className="rounded-lg border p-3 dark:border-slate-700">
                <div className="font-medium text-[var(--text)]">{it.title}</div>
                <p className="mt-1 text-sm subtle">{it.body}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50">{t('common.simulate')}</button>
                  <button className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50">{t('common.export')}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 xl:col-span-5">
          <ActionQueue />
        </div>
      </div>

      <SimulationDrawer />
      <SimulationStickyBar />
      <SimulationResultPanel />
      <CopilotPanel datasetId={datasetId} />
    </div>
  );
}


