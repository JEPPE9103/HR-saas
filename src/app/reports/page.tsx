"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useReportStore } from "@/store/report";
import { exportPdf, exportCsv } from "@/services/mockApi";
import { motion, AnimatePresence } from "framer-motion";
import { FileDown, PlusCircle } from "lucide-react";
import { firebaseDb as dbFactory } from "@/lib/firebase/client";
import { reportsRef } from "@/lib/models";
import { addDoc, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { useAuth } from "@/providers/AuthProvider";

type Block = { id: string; type: string; title: string };

export default function ReportsPage() {
  const blocks = useReportStore((s) => s.blocks);
  const addBlock = useReportStore((s) => s.addBlock);
  const removeBlock = useReportStore((s) => s.removeBlock);
  const { user } = useAuth();
  const [saved, setSaved] = useState<{ id:string; title:string; date:string }[]>([]);
  const hasBlocks = blocks.length > 0;

  function add(type: string, title: string) { addBlock({ type, title }); }
  async function loadReports(){
    if(!user) return setSaved([]);
    const q = query(reportsRef(db), where("uid","==", user.uid), orderBy("createdAt","desc"));
    const snap = await getDocs(q);
    setSaved(snap.docs.map(d=>({ id:d.id, title:(d.data() as any).title || "Untitled", date:new Date((d.data() as any).createdAt||Date.now()).toLocaleDateString() })));
  }
  useEffect(()=>{ loadReports(); }, [user]);

  async function saveCurrent(){
    if(!user) return;
    await addDoc(reportsRef(db), { uid:user.uid, title:"Report", blocks, createdAt: Date.now() });
    await loadReports();
  }
  async function removeReport(id:string){ await deleteDoc(doc(db, "reports", id)); await loadReports(); }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 grid gap-6 md:grid-cols-3">
      {/* Left rail */}
      <div className="space-y-4">
        {/* Saved Reports */}
        <Card className="rounded-2xl border border-white/10 bg-white/5 shadow-lg">
          <CardHeader><CardTitle className="text-slate-900 dark:text-slate-100">Saved Reports</CardTitle></CardHeader>
          <CardContent>
            {saved.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-slate-300">
                No saved reports yet.
                <div className="mt-2 text-slate-400">Build your first report using the blocks below.</div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                {saved.map(r => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border border-white/10 p-2">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">{r.title}</div>
                      <div className="text-xs text-slate-500">{r.date}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost">View</Button>
                      <Button variant="ghost">Export</Button>
                      <Button variant="ghost" onClick={()=>removeReport(r.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Block Library */}
        <Card className="rounded-2xl border border-white/10 bg-white/5 shadow-lg">
          <CardHeader><CardTitle className="text-slate-900 dark:text-slate-100">Block Library</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
            {[
              { t:"summary",  title:"Summary", desc:"Overview of key metrics." },
              { t:"kpi",      title:"KPI Snapshot", desc:"Highlight core numbers." },
              { t:"insights", title:"Top Insights", desc:"Curated findings from AI." },
              { t:"scenario", title:"Scenario", desc:"Before/after comparison." },
              { t:"appendix", title:"Appendix", desc:"Raw data and notes." },
            ].map(b => (
              <button key={b.t} onClick={()=>add(b.t, b.title)} className="flex items-center justify-between rounded-lg border border-white/10 p-3 text-left hover:bg-gray-50 dark:hover:bg-white/5">
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{b.title}</div>
                  <div className="text-xs text-slate-500">{b.desc}</div>
                </div>
                <PlusCircle className="h-4 w-4 text-slate-400"/>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Workspace */}
      <div className="md:col-span-2 space-y-4">
        <Card className="rounded-2xl border border-white/10 bg-white/5 shadow-lg">
          <CardHeader><CardTitle className="text-slate-900 dark:text-slate-100">Builder Workspace</CardTitle></CardHeader>
          <CardContent>
            {!hasBlocks && (
              <div className="rounded-lg border border-dashed border-white/10 p-10 text-center text-slate-300">Drop blocks here</div>
            )}
            <AnimatePresence>
              {blocks.map((b) => (
                <motion.div key={b.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }} transition={{ duration:0.25 }} className="mb-3 rounded-lg border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{b.title}</div>
                    <Button variant="ghost" onClick={() => removeBlock(b.id)}>Remove</Button>
                  </div>
                  {/* Mock previews per type */}
                  {b.type === "kpi" && (
                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      <div className="rounded-md border border-white/10 p-2 text-center">Gap 5.6%</div>
                      <div className="rounded-md border border-white/10 p-2 text-center">Roles 4</div>
                      <div className="rounded-md border border-white/10 p-2 text-center">Sites 2</div>
                    </div>
                  )}
                  {b.type === "insights" && (
                    <ul className="mt-3 list-disc pl-5 text-sm text-slate-300">
                      <li>Engineering gap 8.2% (High)</li>
                      <li>Berlin site has 2 outliers</li>
                      <li>Female % in leadership trending down</li>
                    </ul>
                  )}
                  {b.type === "scenario" && (
                    <div className="mt-3 text-sm text-slate-300">Scenario: +5% Engineers → new gap 2.1%, budget +€240k.</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Copilot suggestion */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm shadow-lg">
          <div className="font-medium text-slate-900 dark:text-slate-100">Copilot</div>
          <p className="mt-1 text-slate-300">Engineering gap is 8.2%. Should I add the latest simulation to your report?</p>
          <div className="mt-2 flex gap-2">
            <Button variant="ghost" onClick={()=>addBlock({ type:"scenario", title:"Scenario: +5% Engineers" })}>Yes</Button>
            <Button variant="ghost">No</Button>
          </div>
        </div>
      </div>

      {/* Sticky export footer */}
      <div className="fixed inset-x-0 bottom-0 z-10">
        <div className="mx-auto w-full max-w-6xl px-6 pb-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-lg backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-300">Export your report</div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={saveCurrent}>Save</Button>
                <Button onClick={async()=>{ const url = await exportPdf("demo-se"); const a=document.createElement("a"); a.href=url; a.download="report.pdf"; a.click(); }}><FileDown className="h-4 w-4 mr-1"/> Export PDF</Button>
                <Button variant="ghost" onClick={async()=>{ const url = await exportCsv("demo-se"); const a=document.createElement("a"); a.href=url; a.download="report.csv"; a.click(); }}>Export CSV</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


