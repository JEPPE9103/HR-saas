"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Upload, FileDown, RotateCcw } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import RiskPanel from "@/components/dashboard/RiskPanel";
import ActionQueue from "@/components/dashboard/ActionQueue";
import { SimulationDrawer } from "@/components/SimulationDrawer";
import SimulationStickyBar from "@/components/SimulationStickyBar";
import SimulationResultPanel from "@/components/SimulationResultPanel";

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

const roles = [
  { role: "Software Engineer", varx: 0.34 },
  { role: "Project Manager", varx: 0.28 },
  { role: "Data Analyst", varx: 0.25 },
  { role: "Sales Executive", varx: 0.22 },
];

const sites = [
  { site: "Berlin", severity: "High", score: 0.82 },
  { site: "Stockholm", severity: "Medium", score: 0.55 },
  { site: "Copenhagen", severity: "Low", score: 0.28 },
];

const insights = [
  {
    title: "Engineering gap 8.2% (High)",
    body: "Recommend +5% adj for IC2–IC4. Est. budget +€240k, new gap 2.1%.",
  },
  {
    title: "Berlin site has 2 outliers >40% above median",
    body: "Review comp policy exceptions; cap at P90 for IC levels.",
  },
  {
    title: "Female % in leadership trending down",
    body: "Set target P50 by Q4; simulate promotion uplift for top performers.",
  },
];

export default function DashboardPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const datasetId = sp.get("datasetId") || "demo-se";
  const [computedAt, setComputedAt] = useState<string>("23 Aug 2026");

  return (
    <div className="px-6 lg:px-10 py-6 space-y-6">
      {/* Topbar actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span>Last computed: {computedAt}</span>
            <button aria-label="Recompute dataset" onClick={async()=>{ const r = await fetch('/api/analyze',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ datasetId })}); const j = await r.json(); if(j?.computedAt){ setComputedAt(new Date(j.computedAt).toLocaleDateString()); } }} className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50"><RotateCcw className="h-3 w-3"/> Recompute</button>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-800">EU directive ready</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select aria-label="Select dataset" value={datasetId} onChange={(e)=>{ const v=e.target.value; router.push(`/dashboard?datasetId=${encodeURIComponent(v)}`); }} className="rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-slate-100">
            {['demo-se','demo-de','demo-uk'].map(ds => (<option key={ds} value={ds}>{ds}</option>))}
          </select>
          <button className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-teal-700 hover:bg-teal-100 dark:border-teal-700 dark:bg-teal-900/30 dark:text-teal-200 dark:hover:bg-teal-900/50">
            <Upload className="h-4 w-4" /> Upload data
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="text-sm text-slate-600 dark:text-slate-400">{k.label}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{k.value}{k.suffix}</div>
              <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 ${k.delta>=0 ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800" : "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-200 dark:ring-rose-800"}`}>
                {k.delta>=0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {k.delta>=0 ? "+" : ""}{k.delta}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Trend + Heatmap */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-7 rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-2 text-sm text-slate-600 dark:text-slate-400">Gender Pay Gap Trend</div>
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

      {/* Row 3: Insights + Action Queue */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-7 rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400">Insights</div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50">
                <FileDown className="h-4 w-4" /> Export brief
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {insights.map((it, i)=>(
              <div key={i} className="rounded-lg border p-3 dark:border-slate-700">
                <div className="font-medium text-slate-900 dark:text-slate-100">{it.title}</div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{it.body}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50">Simulate</button>
                  <button className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50">Export</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 xl:col-span-5">
          <ActionQueue />
        </div>
      </div>

      {/* Right-side Simulation Drawer */}
      <SimulationDrawer />
      <SimulationStickyBar />
      <SimulationResultPanel />
    </div>
  );
}

