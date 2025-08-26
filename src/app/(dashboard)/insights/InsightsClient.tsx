"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import InsightCard, { Insight } from "@/components/insights/InsightCard";
import SeverityBadge from "@/components/insights/SeverityBadge";
import { Bot, FileDown, Filter } from "lucide-react";
import { firebaseDb as dbFactory } from "@/lib/firebase/client";
import { getDocs, query, where } from "firebase/firestore";
import { insightsRef, metricsRef } from "@/lib/models";

const SAMPLE: Insight[] = [
  { id:"1", severity:"High",   title:"Engineering gap 8.2% (Role variance high)", subtitle:"Q2 2026 • Role: Engineer • N=124", recommendation:"Recommend +5% raise for IC2–IC4 in SE. Est. budget +€240k, new gap 2.1%." },
  { id:"2", severity:"High",   title:"Berlin site has 2 outliers >40% above median", subtitle:"Site: Berlin • N=312", recommendation:"Review exception policy; cap at P90 for IC levels." },
  { id:"3", severity:"Medium", title:"Project Manager variance trending ↑", subtitle:"Dept: Delivery • N=86", recommendation:"Audit leveling IC3↔IC4 before Q4 cycle." },
  { id:"4", severity:"Low",    title:"Sales gap 3.1% (within guardrail)", subtitle:"Region: Nordics • N=210" },
];

type Row = { role:string; gap:number; n:number; severity:"High"|"Medium"|"Low" };
const TABLE: Row[] = [
  { role:"Software Engineer", gap:9.3, n:124, severity:"High" },
  { role:"Tech Lead",         gap:8.2, n:38,  severity:"High" },
  { role:"Marketing Manager", gap:6.0, n:22,  severity:"Medium" },
  { role:"Sales Manager",     gap:5.2, n:64,  severity:"Medium" },
  { role:"Account Executive", gap:5.2, n:41,  severity:"Medium" },
  { role:"Finance Manager",   gap:5.1, n:30,  severity:"Medium" },
  { role:"Product Designer",  gap:4.7, n:19,  severity:"Low" },
  { role:"Financial Analyst", gap:4.1, n:33,  severity:"Low" },
];

export default function InsightsClient(){
  const db = dbFactory();
  const [severity, setSeverity] = useState<"All"|"High"|"Medium"|"Low">("All");
  const [queryText, setQueryText] = useState("");
  const [feedData, setFeedData] = useState<Insight[]>(SAMPLE);
  const [tableData, setTableData] = useState(TABLE);
  const [loading, setLoading] = useState(false);
  const sp = useSearchParams();
  const datasetId = sp.get("datasetId") || "demo-se";

  useEffect(()=>{
    let mounted = true;
    (async () => {
      try{
        setLoading(true);
        const iq = query(insightsRef(db), where("datasetId","==", datasetId));
        const snap = await getDocs(iq);
        const list: Insight[] = snap.docs.map(d => {
          const x:any = d.data();
          return {
            id: d.id,
            severity: (x.severity as any) ?? "Medium",
            title: x.title ?? x.dimension ?? "Insight",
            subtitle: x.subtitle ?? x.metricName ? `${x.metricName}: ${x.metricValue}` : undefined,
            recommendation: x.recommendedAction,
          };
        });
        const mdoc = await getDocs(query(metricsRef(db), where("datasetId","==", datasetId)));
        const m = mdoc.docs[0]?.data() as any;
        const table = Array.isArray(m?.gapsByRole) ? m.gapsByRole.slice(0, 50).map((r:any)=>({
          role: r.role,
          gap: Number(r.gapPercent) || 0,
          n: Number(r.n) || 0,
          severity: (r.gapPercent ?? 0) >= 8 ? "High" : (r.gapPercent ?? 0) >= 4 ? "Medium" : "Low",
        })) : TABLE;
        if(!mounted) return;
        setFeedData(list.length ? list : SAMPLE);
        setTableData(table);
      } finally {
        if(mounted) setLoading(false);
      }
    })();
    return ()=>{ mounted = false; };
  }, [datasetId]);

  const feed = useMemo(()=>{
    return feedData
      .filter(i => severity==="All" ? true : i.severity===severity)
      .filter(i => (i.title + (i.subtitle||"")).toLowerCase().includes(queryText.toLowerCase()));
  }, [feedData, severity, queryText]);

  const rows = useMemo(()=>{
    return tableData
      .filter(r => severity==="All" ? true : r.severity===severity)
      .filter(r => r.role.toLowerCase().includes(queryText.toLowerCase()));
  }, [tableData, severity, queryText]);

  function simulate(id:string){ /* open modal, pass id */ }
  function exportOne(id:string){
    const a = document.createElement("a");
    a.href = "/exports/insight-" + id + ".pdf";
    a.download = "insight.pdf";
    a.click();
  }

  return (
    <div className="px-6 lg:px-10 py-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
          <p className="text-sm text-muted-foreground">AI‑prioritized findings. Take action or export a brief.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/5">
            <FileDown className="h-4 w-4"/> Export brief
          </button>
          <a href="/dashboard?open=copilot" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700">
            <Bot className="h-4 w-4" /> Ask Copilot
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm dark:border-white/10"><Filter className="h-4 w-4"/> Filters</div>
          <div className="flex items-center gap-1">
            {["All","High","Medium","Low"].map(s=> (
              <button key={s}
                onClick={()=>setSeverity(s as any)}
                className={`rounded-full px-3 py-1 text-sm ring-1 transition ${
                  severity===s ? "bg-indigo-600 text-white ring-indigo-600" : "text-slate-600 ring-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-white/5"
                }`}>{s}</button>
            ))}
          </div>
          <div className="ml-auto">
            <input value={queryText} onChange={e=>setQueryText(e.target.value)} placeholder="Search role, site, dept…"
              className="rounded-lg border px-3 py-1.5 text-sm dark:bg-slate-900/50 dark:border-white/10"/>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {loading && (
          <div className="col-span-full text-sm text-muted-foreground">Loading insights…</div>
        )}
        {!loading && feed.map(i=> (
          <InsightCard key={i.id} i={i} onSimulate={simulate} onExport={exportOne} />
        ))}
        {feed.length===0 && (
          <div className="col-span-full rounded-xl border bg-white p-6 text-center text-sm text-muted-foreground dark:bg-slate-900/50 dark:border-white/10">
            No insights match your filters. Try “All” or remove search.
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg">
        <div className="mb-3 text-sm text-muted-foreground">Top gender pay gaps (by role)</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 dark:text-slate-300">
              <tr>
                <th className="py-2">Role</th>
                <th className="py-2">Gap %</th>
                <th className="py-2">N <span className="text-xs text-slate-400">(group size)</span></th>
                <th className="py-2">Severity</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.role} className="border-t last:border-b dark:border-white/10">
                  <td className="py-2">{r.role}</td>
                  <td className="py-2">{r.gap.toFixed(1)}%</td>
                  <td className="py-2">{r.n}</td>
                  <td className="py-2"><SeverityBadge level={r.severity} /></td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button className="rounded-md border px-2 py-1 hover:bg-gray-50 dark:hover:bg-white/5">Simulate</button>
                      <button className="rounded-md border px-2 py-1 hover:bg-gray-50 dark:hover:bg-white/5">Add to report</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length===0 && (
                <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No rows.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


