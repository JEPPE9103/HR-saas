"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export default function SimulatePage() {
  const [dimension, setDimension] = useState("Role");
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
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Simulate Adjustment</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Run a what-if scenario. Adjust pay levels and instantly see impact on gap, cost, and compliance risk.</p>
      </div>

      {/* ParamsCard */}
      <Card className="rounded-2xl border border-white/10 bg-white/5 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-200">Parameters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <label className="text-sm">
            <div className="mb-1 text-slate-300">Dimension</div>
            <select value={dimension} onChange={(e)=>setDimension(e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-slate-200">
              {['Role','Department','Site','Country'].map(d=> <option key={d}>{d}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <div className="mb-1 text-slate-300">{dimension}</div>
            <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-slate-200">
              {['Engineer','Marketing','Project Manager','Sales Executive'].map(r=> <option key={r}>{r}</option>)}
            </select>
          </label>
          <div className="text-sm">
            <div className="mb-1 flex items-center justify-between text-slate-300">
              <span>Percentage</span>
              <input type="number" min={0} max={20} value={percent} onChange={(e)=>setPercent(Number(e.target.value))} className="w-20 rounded-md border border-white/10 bg-slate-900/50 px-2 py-1 text-sm text-slate-200"/>
            </div>
            <input aria-label="percentage" type="range" min={0} max={20} value={percent} onChange={(e)=>setPercent(Number(e.target.value))} className="w-full"/>
          </div>
          <div className="md:col-span-3">
            <Button onClick={run} className="bg-indigo-600 hover:bg-indigo-700 text-white">Run Simulation</Button>
          </div>
        </CardContent>
      </Card>

      {/* ResultsCard */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:12 }} transition={{ duration:0.35 }}>
            <Card className="rounded-2xl border border-white/10 bg-white/5 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-200">Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="text-xs inline-flex items-center justify-center rounded-full px-3 py-2 ring-1 bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-400/30">New gap {result.after}%</div>
                  <div className="text-xs inline-flex items-center justify-center rounded-full px-3 py-2 ring-1 bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-500/10 dark:text-teal-200 dark:ring-teal-400/30">Impacted {result.impacted}</div>
                  <div className="text-xs inline-flex items-center justify-center rounded-full px-3 py-2 ring-1 bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-400/30">Budget €{(result.budget/1000).toFixed(0)}k</div>
                </div>

                <div className="mt-4 h-56 w-full rounded-lg border p-3 dark:border-white/10">
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

                <div className="mt-4 rounded-lg border p-3 text-sm dark:border-white/10">
                  <div className="text-slate-900 dark:text-slate-100">Copilot suggestion</div>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">Would you like to add this scenario to your next report?</p>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5">Yes</button>
                    <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5">No</button>
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


