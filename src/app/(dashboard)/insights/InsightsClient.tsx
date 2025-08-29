"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import InsightCard, { Insight } from "@/components/insights/InsightCard";
import SeverityBadge from "@/components/insights/SeverityBadge";
import { Bot, FileDown, Filter } from "lucide-react";
import { firebaseDb as dbFactory } from "@/lib/firebase/client";
import { getDocs, query, where } from "firebase/firestore";
import { insightsRef, metricsRef } from "@/lib/models";
import { useI18n } from "@/providers/I18nProvider";

const SAMPLE_KEYS = [
  { id:"1", severity:"High",   t:{ title:"insights.sample1.title", subtitle:"insights.sample1.subtitle", rec:"insights.sample1.rec" } },
  { id:"2", severity:"High",   t:{ title:"insights.sample2.title", subtitle:"insights.sample2.subtitle", rec:"insights.sample2.rec" } },
  { id:"3", severity:"Medium", t:{ title:"insights.sample3.title", subtitle:"insights.sample3.subtitle", rec:"insights.sample3.rec" } },
  { id:"4", severity:"Low",    t:{ title:"insights.sample4.title", subtitle:"insights.sample4.subtitle", rec: undefined } },
] as const;

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
  const { t } = useI18n();
  const db = dbFactory();
  const [severity, setSeverity] = useState<"All"|"High"|"Medium"|"Low">("All");
  const [queryText, setQueryText] = useState("");
  const [feedData, setFeedData] = useState<Insight[]>(SAMPLE_KEYS.map(s=>{
    const recKey = (s.t as { rec?: string }).rec;
    return { 
      id:s.id, 
      severity:s.severity as any, 
      title:t(s.t.title), 
      subtitle:t(s.t.subtitle), 
      recommendation: recKey ? t(recKey) : undefined 
    };
  }));
  const [tableData, setTableData] = useState(TABLE);
  const [loading, setLoading] = useState(false);
  const [isSample, setIsSample] = useState(true);
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
        if(list.length){
          setIsSample(false);
          setFeedData(list);
        } else {
          setIsSample(true);
          setFeedData(SAMPLE_KEYS.map(s=>{
            const recKey = (s.t as { rec?: string }).rec;
            return { 
              id:s.id, 
              severity:s.severity as any, 
              title:t(s.t.title), 
              subtitle:t(s.t.subtitle), 
              recommendation: recKey ? t(recKey) : undefined 
            };
          }));
        }
        setTableData(table);
      } finally {
        if(mounted) setLoading(false);
      }
    })();
    return ()=>{ mounted = false; };
  }, [datasetId]);

  // Recompute sample items on language change
  useEffect(()=>{
    if(isSample){
      setFeedData(SAMPLE_KEYS.map(s=>{
        const recKey = (s.t as { rec?: string }).rec;
        return { 
          id:s.id, 
          severity:s.severity as any, 
          title:t(s.t.title), 
          subtitle:t(s.t.subtitle), 
          recommendation: recKey ? t(recKey) : undefined 
        };
      }));
    }
  }, [t, isSample]);

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
          <h1 className="text-2xl font-semibold tracking-tight">{t("nav.insights")}</h1>
          <p className="text-sm text-muted-foreground">{t("insights.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 hover:bg-slate-50 border-[var(--ring)]">
            <FileDown className="h-4 w-4"/> {t("insights.exportBrief")}
          </button>
          <a href="/dashboard?open=copilot" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700">
            <Bot className="h-4 w-4" /> {t("insights.askCopilot")}
          </a>
        </div>
      </div>

      <div className="rounded-2xl border p-3 shadow-lg border-[var(--ring)] bg-[var(--panel)]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm border-[var(--ring)]"><Filter className="h-4 w-4"/> {t("insights.filters")}</div>
          <div className="flex items-center gap-1">
            {["All","High","Medium","Low"].map(s=> (
              <button key={s}
                onClick={()=>setSeverity(s as any)}
                className={`rounded-full px-3 py-1 text-sm ring-1 transition ${
                  severity===s ? "bg-indigo-600 text-white ring-indigo-600" : "text-[var(--text)] ring-[var(--ring)] hover:bg-slate-50"
                }`}>{t(`severity.${s}`)}</button>
            ))}
          </div>
          <div className="ml-auto">
            <input value={queryText} onChange={e=>setQueryText(e.target.value)} placeholder={t("insights.searchPlaceholder")}
              className="rounded-lg border px-3 py-1.5 text-sm border-[var(--ring)] bg-[var(--panel)] text-[var(--text)]"/>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {loading && (
          <div className="col-span-full text-sm text-muted-foreground">{t("insights.loading")}</div>
        )}
        {!loading && feed.map(i=> (
          <InsightCard key={i.id} i={i} onSimulate={simulate} onExport={exportOne} />
        ))}
        {feed.length===0 && (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="rounded-xl border p-8 text-center border-[var(--ring)] bg-[var(--panel)] max-w-md">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-[var(--text)] mb-2">No insights found</h3>
              <p className="text-sm text-[var(--text-muted)]">
                {t("insights.empty")}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border p-4 shadow-lg border-[var(--ring)] bg-[var(--panel)]">
        <div className="mb-3 text-sm text-muted-foreground">{t("insights.topGaps")}</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2">{t("insights.th.role")}</th>
                <th className="py-2">{t("insights.th.gap")}</th>
                <th className="py-2">{t("insights.th.n")} <span className="text-xs text-slate-400">({t("insights.groupSizeHint")})</span></th>
                <th className="py-2">{t("insights.th.severity")}</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.role} className="border-t last:border-b border-[var(--ring)]">
                  <td className="py-2">{r.role}</td>
                  <td className="py-2">{r.gap.toFixed(1)}%</td>
                  <td className="py-2">{r.n}</td>
                  <td className="py-2"><SeverityBadge level={r.severity} /></td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button className="rounded-md border px-2 py-1 hover:bg-slate-50 border-[var(--ring)]">{t("common.simulate")}</button>
                      <button className="rounded-md border px-2 py-1 hover:bg-slate-50 border-[var(--ring)]">{t("common.addToReport")}</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length===0 && (
                <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">{t("insights.noRows")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


