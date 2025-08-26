"use client";

import { useMemo, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
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
  const [mode, setMode] = useState<"list"|"matrix">("list");
  const roles = ["Engineer","PM","Sales","Design","Ops"]; // simple axis reference
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
          <button className={`px-2 py-1 text-xs ${mode==='list'?'bg-white/10 dark:bg-white/10':''}`} onClick={()=>setMode('list')}>List</button>
          <button className={`px-2 py-1 text-xs ${mode==='matrix'?'bg-white/10 dark:bg-white/10':''}`} onClick={()=>setMode('matrix')}>Matrix</button>
        </div>
      </div>

      {mode==='list' && (
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
      )}

      {mode==='matrix' && (() => {
        const points = data.map(d => ({
          x: roles.indexOf(d.role),
          y: sites.indexOf(d.site),
          role: d.role,
          site: d.site,
          gapPercent: d.gapPercent,
          n: d.n,
        })).filter(p => p.x >= 0 && p.y >= 0);
        const xDomain: [number, number] = [-0.5, roles.length - 0.5];
        const yDomain: [number, number] = [-0.5, sites.length - 0.5];
        return (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 24, left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" domain={xDomain} tick={{ fontSize: 10 }} tickFormatter={(v)=> roles[Math.max(0, Math.min(roles.length-1, Math.round(v)))]} interval={0} />
                <YAxis type="number" dataKey="y" domain={yDomain} tick={{ fontSize: 10 }} tickFormatter={(v)=> sites[Math.max(0, Math.min(sites.length-1, Math.round(v)))]} interval={0} />
                <ZAxis type="number" dataKey="gapPercent" range={[60, 160]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v, _name, p: any) => [`${p.payload.gapPercent}% (N=${p.payload.n})`, `${p.payload.site} • ${p.payload.role}`]} />
                <Scatter data={points} shape={(props:any)=>{
                  const fill = colorForGap(props.payload.gapPercent);
                  const r = Math.max(6, Math.min(14, 6 + props.payload.gapPercent));
                  return <circle cx={props.cx} cy={props.cy} r={r} fill={fill} onClick={()=>{ setDefaults({ role: props.payload.role, percent: 5 }); setOpen(true); }} />;
                }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );
      })()}
    </div>
  );
}


