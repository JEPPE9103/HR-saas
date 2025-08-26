"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, BarChart, Bar, Tooltip, ReferenceLine, Cell } from "recharts";
import { useSimulationDrawer } from "@/store/ui";

type Item = { site: string; role: string; gapPercent: number; n: number };

function colorForGap(gap: number): string {
  if (gap >= 8) return "#ef4444"; // red
  if (gap >= 4) return "#f59e0b"; // amber
  if (gap >= 0) return "#22c55e"; // green
  return "#06b6d4"; // teal for negative
}

export default function RiskPanel({ items }: { items?: Item[] }){
  const { setOpen, setDefaults } = useSimulationDrawer();
  const [mode, setMode] = useState<"list"|"bars">("bars");
  const roles = ["Engineer","PM","Sales","Design","Ops"]; // for demo generation
  const sites = ["Berlin","Stockholm","Copenhagen","London","Paris"];

  const data: Item[] = useMemo(()=>{
    if(items) return items;
    const d: Item[] = [];
    for(const s of sites){
      for(const r of roles){
        d.push({ site:s, role:r, gapPercent: Number((Math.random()*10).toFixed(1)), n: 20+Math.floor(Math.random()*80)});
      }
    }
    return d;
  }, [items]);

  const top = useMemo(() => [...data].sort((a,b)=>b.gapPercent-a.gapPercent).slice(0,6), [data]);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-2 flex items-center justify-between text-sm">
        <div className="text-slate-600 dark:text-slate-400">Risk Panel</div>
        <div className="inline-flex rounded-md border dark:border-slate-700 overflow-hidden">
          <button className={`px-2 py-1 text-xs ${mode==='bars'?'bg-white/10 dark:bg-white/10':''}`} onClick={()=>setMode('bars')}>Bars</button>
          <button className={`px-2 py-1 text-xs ${mode==='list'?'bg-white/10 dark:bg-white/10':''}`} onClick={()=>setMode('list')}>List</button>
        </div>
      </div>

      {mode==='list' && (
        <div className="h-72">
          <div className="h-full overflow-auto">
            <ul className="space-y-3">
              {top.map((t,i)=> (
                <li key={`${t.site}-${t.role}`} className="flex items-center justify-between rounded-lg border p-3 dark:border-slate-700">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{t.site} • {t.role}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Gap {t.gapPercent}% • N={t.n}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs" style={{ background: colorForGap(t.gapPercent), color: '#0b1220' }}>{t.gapPercent}%</span>
                    <button className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50" onClick={()=>{ setDefaults({ role: t.role, percent: 5 }); setOpen(true);}}>Simulate</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {mode==='bars' && (() => {
        const rows = top.map(t => ({ name: `${t.site} • ${t.role}`, gap: t.gapPercent, role: t.role, site: t.site, n: t.n }));
        return (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} layout="vertical" margin={{ top: 10, right: 12, bottom: 10, left: 12 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <ReferenceLine x={2} stroke="#22c55e" strokeDasharray="3 3" label={{ value: "2% goal", fill: "#22c55e", position: "insideTopRight", fontSize: 12 }} />
                <Tooltip formatter={(v:any, _n, p:any)=> [`${v}% (N=${p.payload.n})`, p.payload.name]} />
                <Bar dataKey="gap" radius={6} onClick={(_, i)=>{ const r = rows[i]; setDefaults({ role: r.role, percent: 5 }); setOpen(true); }}>
                  {rows.map((r, i) => (
                    <Cell key={`cell-${i}`} fill={colorForGap(r.gap)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      })()}
    </div>
  );
}


