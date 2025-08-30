"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import InsightCard, { Insight } from "@/components/insights/InsightCard";
import SeverityBadge from "@/components/insights/SeverityBadge";
import { FileDown, Filter, TrendingUp, AlertTriangle, Users, Clock, TrendingDown, FileSpreadsheet, UploadCloud } from "lucide-react";
import { firebaseDb as dbFactory } from "@/lib/firebase/client";
import { getDocs, query, where } from "firebase/firestore";
import { insightsRef, metricsRef } from "@/lib/models";
import { useI18n } from "@/providers/I18nProvider";
import { useSimulationDrawer } from "@/store/ui";
import { SimulationDrawer } from "@/components/SimulationDrawer";
import { CopilotPanel } from "@/components/copilot/CopilotPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";

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
  const setSimulationOpen = useSimulationDrawer((s) => s.setOpen);

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

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const highRisk = tableData.filter(r => r.severity === "High").length;
    const avgGap = tableData.reduce((sum, r) => sum + r.gap, 0) / tableData.length;
    return { highRisk, avgGap: avgGap.toFixed(1) };
  }, [tableData]);

  // Count insights by severity
  const severityCounts = useMemo(() => {
    const counts = { All: feedData.length, High: 0, Medium: 0, Low: 0 };
    feedData.forEach(item => {
      counts[item.severity as keyof typeof counts]++;
    });
    return counts;
  }, [feedData]);

  function simulate(id:string){ /* open modal, pass id */ }
  function exportOne(id:string){
    const a = document.createElement("a");
    a.href = "/exports/insight-" + id + ".pdf";
    a.download = "insight.pdf";
    a.click();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] mb-2">{t("nav.insights")}</h1>
          <p className="text-lg text-[var(--text-muted)]">{t("insights.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="flex items-center gap-2">
            <FileDown className="h-4 w-4"/> {t("insights.exportBrief")}
          </Button>
          <Button 
            onClick={() => setSimulationOpen(true)}
            className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white"
          >
            <TrendingUp className="h-4 w-4" /> Simulate adjustments
          </Button>
        </div>
      </div>

      {/* Summary Banner */}
      <Card className="rounded-2xl shadow-sm border-[var(--ring)] bg-[var(--card)]">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[var(--danger-soft-bg)] text-[var(--danger)]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{summaryStats.highRisk}</div>
                <div className="text-sm text-[var(--text-muted)]">High-risk roles detected</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[var(--accent-soft-bg)] text-[var(--accent)]">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">{summaryStats.avgGap}%</div>
                <div className="text-sm text-[var(--text-muted)]">Average pay gap</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[var(--success-soft-bg)] text-[var(--success)]">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">Aug 2026</div>
                <div className="text-sm text-[var(--text-muted)]">Last updated</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[var(--text-muted)]" />
          <span className="text-sm font-medium text-[var(--text)]">Filter insights</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {(["All", "High", "Medium", "Low"] as const).map(s => {
            const count = severityCounts[s];
            const colors = {
              All: "bg-[var(--neutral-soft-bg)] text-[var(--text-muted)] border-[var(--ring)]",
              High: "bg-[var(--danger-soft-bg)] text-[var(--danger)] border-[var(--danger-soft-ring)]",
              Medium: "bg-[var(--warning-soft-bg)] text-[var(--warning)] border-[var(--warning-soft-ring)]",
              Low: "bg-[var(--success-soft-bg)] text-[var(--success)] border-[var(--success-soft-ring)]"
            };
            return (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                className={`rounded-full px-4 py-2 text-sm font-medium border transition-all ${
                  severity === s 
                    ? "ring-2 ring-[var(--accent)] ring-offset-2" 
                    : "hover:scale-105"
                } ${colors[s]}`}
              >
                {t(`severity.${s}`)} ({count})
              </button>
            );
          })}
          <div className="ml-auto">
            <input 
              value={queryText} 
              onChange={e => setQueryText(e.target.value)} 
              placeholder={t("insights.searchPlaceholder")}
              className="rounded-xl border px-4 py-2 text-sm border-[var(--ring)] bg-[var(--card)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Insight Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">AI-Powered Insights</h2>
            {loading && (
              <div className="text-sm text-[var(--text-muted)]">{t("insights.loading")}</div>
            )}
            {!loading && feed.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {feed.map(i => (
                  <InsightCard key={i.id} i={i} onSimulate={simulate} onExport={exportOne} />
                ))}
              </div>
            )}
            {!loading && feed.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="rounded-2xl border p-8 text-center border-[var(--ring)] bg-[var(--card)] max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--neutral-soft-bg)] flex items-center justify-center">
                    <FileSpreadsheet className="h-8 w-8 text-[var(--text-muted)]" />
                  </div>
                  <h3 className="text-lg font-medium text-[var(--text)] mb-2">No insights yet</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-4">
                    Upload your compensation data to get AI-powered insights and recommendations
                  </p>
                  <button className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm text-white hover:bg-[var(--accent-strong)] transition">
                    <UploadCloud className="h-4 w-4" />
                    Upload Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Table */}
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm border-[var(--ring)] bg-[var(--card)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-[var(--text)]">
                Top Gender Pay Gaps
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-[var(--ring)]">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium text-[var(--text-muted)]">{t("insights.th.role")}</th>
                      <th className="py-3 px-4 text-left font-medium text-[var(--text-muted)]">{t("insights.th.gap")}</th>
                      <th className="py-3 px-4 text-left font-medium text-[var(--text-muted)]">{t("insights.th.n")}</th>
                      <th className="py-3 px-4 text-left font-medium text-[var(--text-muted)]">{t("insights.th.severity")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 8).map((r, index) => (
                      <tr 
                        key={r.role} 
                        className="border-b border-[var(--ring)] hover:bg-[var(--neutral-soft-bg)] transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-[var(--text)]">{r.role}</td>
                        <td className="py-3 px-4 text-[var(--text)]">{r.gap.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-[var(--text-muted)]">{r.n}</td>
                        <td className="py-3 px-4">
                          <SeverityBadge level={r.severity} />
                        </td>
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-[var(--text-muted)]">
                          {t("insights.noRows")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {rows.length > 8 && (
                <div className="p-4 border-t border-[var(--ring)]">
                  <Button variant="ghost" className="w-full text-sm">
                    View all {rows.length} roles
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <SimulationDrawer />
      <CopilotPanel datasetId={datasetId} />
    </div>
  );
}


