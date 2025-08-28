"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/providers/I18nProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

type DimKey = 'role' | 'department' | 'site' | 'country';

export default function SimulatePage() {
  const { t } = useI18n();
  const [dimensionKey, setDimensionKey] = useState<DimKey>('role');
  const [role, setRole] = useState("Engineer");
  const [percent, setPercent] = useState(5);
  const [result, setResult] = useState<any>(null);

  async function run() {
    const res = await fetch("/api/copilot/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: "local", datasetId: "demo-se", message: `/simulate role:"${role}" +${percent}%` }),
    });
    const data = await res.json();
    setResult({
      text: data.text ?? `Applied +${percent}% to ${role}. New gap 2.1%. Budget +€240k.`,
      before: 5.6,
      after: 2.1,
      impacted: 126,
      budget: 240000,
    });
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">{t("simulate.title")}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t("simulate.description")}</p>
      </div>

      {/* ParamsCard */}
      <Card>
        <CardHeader>
          <CardTitle>{t("simulate.parameters")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <label className="text-sm">
            <div className="mb-1 text-slate-600">{t("simulate.dimension")}</div>
            <select value={dimensionKey} onChange={(e)=>setDimensionKey(e.target.value as DimKey)} className="w-full rounded-lg border px-3 py-2 text-sm border-[var(--ring)] bg-[var(--panel)] text-[var(--text)]">
              {(['role','department','site','country'] as DimKey[]).map(k=> (
                <option key={k} value={k}>{t(`simulate.dim.${k}`)}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <div className="mb-1 text-slate-600">{t(`simulate.dim.${dimensionKey}`)}</div>
            <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm border-[var(--ring)] bg-[var(--panel)] text-[var(--text)]">
              {[t('role.Engineer'), t('role.Marketing'), t('role.ProjectManager'), t('role.SalesExecutive')].map(r=> <option key={r}>{r}</option>)}
            </select>
          </label>
          <div className="text-sm">
            <div className="mb-1 flex items-center justify-between text-slate-600">
              <span>{t("simulate.percentage")}</span>
              <input type="number" min={0} max={20} value={percent} onChange={(e)=>setPercent(Number(e.target.value))} className="w-20 rounded-md border px-2 py-1 text-sm border-[var(--ring)] bg-[var(--panel)] text-[var(--text)]"/>
            </div>
            <input aria-label="percentage" type="range" min={0} max={20} value={percent} onChange={(e)=>setPercent(Number(e.target.value))} className="w-full"/>
          </div>
          <div className="md:col-span-3">
            <Button onClick={run} className="bg-indigo-600 hover:bg-indigo-700 text-white">{t("simulate.run")}</Button>
          </div>
        </CardContent>
      </Card>

      {/* ResultsCard */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:12 }} transition={{ duration:0.35 }}>
            <Card>
              <CardHeader>
                <CardTitle>{t("simulate.results")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="text-xs inline-flex items-center justify-center rounded-full px-3 py-2 ring-1 bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-400/30">{t("simulate.newGap")} {result.after}%</div>
                  <div className="text-xs inline-flex items-center justify-center rounded-full px-3 py-2 ring-1 bg-[var(--warning-soft-bg)] text-[var(--warning-soft-fg)] ring-[var(--warning-soft-ring)]">{t("simulate.impacted")} {result.impacted}</div>
                  <div className="text-xs inline-flex items-center justify-center rounded-full px-3 py-2 ring-1 bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-[var(--success-soft-ring)]">{t("simulate.budget")} €{(result.budget/1000).toFixed(0)}k</div>
                </div>

                <div className="mt-4 h-56 w-full rounded-lg border p-3 border-[var(--ring)]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{k:"Before",v:result.before},{k:"After",v:result.after}]}> 
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="k" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={3} dot />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 rounded-lg border p-3 text-sm border-[var(--ring)]">
                  <div className="text-slate-900 dark:text-slate-100">Copilot suggestion</div>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">Would you like to add this scenario to your next report?</p>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50 border-[var(--ring)]">Yes</button>
                    <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50 border-[var(--ring)]">No</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


