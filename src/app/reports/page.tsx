"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/providers/I18nProvider";
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
  const { t } = useI18n();
  const blocks = useReportStore((s) => s.blocks);
  const addBlock = useReportStore((s) => s.addBlock);
  const removeBlock = useReportStore((s) => s.removeBlock);
  const { user } = useAuth();
  const db = dbFactory();
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
        <Card>
          <CardHeader><CardTitle className="text-[var(--text)]">{t("reports.savedReports")}</CardTitle></CardHeader>
          <CardContent>
            {saved.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-[var(--text)] border-[var(--ring)]">
                {t("reports.empty")}
                <div className="mt-2 subtle">{t("reports.emptyHint")}</div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                {saved.map(r => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border p-2 border-[var(--ring)]">
                    <div>
                      <div className="font-medium text-[var(--text)]">{r.title}</div>
                      <div className="text-xs subtle">{r.date}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost">{t("common.view")}</Button>
                      <Button variant="ghost">{t("common.export")}</Button>
                      <Button variant="ghost" onClick={()=>removeReport(r.id)}>{t("common.delete")}</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Block Library */}
        <Card>
          <CardHeader><CardTitle className="text-[var(--text)]">{t("reports.blockLibrary")}</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
            {[
              { t:"summary",  title:t("reports.block.summary"),  desc:t("reports.block.summaryDesc") },
              { t:"kpi",      title:t("reports.block.kpi"),      desc:t("reports.block.kpiDesc") },
              { t:"insights", title:t("reports.block.insights"), desc:t("reports.block.insightsDesc") },
              { t:"scenario", title:t("reports.block.scenario"), desc:t("reports.block.scenarioDesc") },
              { t:"appendix", title:t("reports.block.appendix"), desc:t("reports.block.appendixDesc") },
            ].map(b => (
              <button key={b.t} onClick={()=>add(b.t, b.title)} className="flex items-center justify-between rounded-lg border p-3 text-left hover:bg-slate-50 border-[var(--ring)]">
                <div>
                  <div className="font-medium text-[var(--text)]">{b.title}</div>
                  <div className="text-xs subtle">{b.desc}</div>
                </div>
                <PlusCircle className="h-4 w-4 text-slate-400"/>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Workspace */}
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-[var(--text)]">{t("reports.builder")}</CardTitle></CardHeader>
          <CardContent>
            {!hasBlocks && (
              <div className="rounded-lg border border-dashed p-10 text-center text-[var(--text)] border-[var(--ring)]">{t("reports.dropHere")}</div>
            )}
            <AnimatePresence>
              {blocks.map((b) => (
                <motion.div key={b.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }} transition={{ duration:0.25 }} className="mb-3 rounded-lg border p-4 border-[var(--ring)]">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-[var(--text)]">{b.title}</div>
                    <Button variant="ghost" onClick={() => removeBlock(b.id)}>{t("common.remove")}</Button>
                  </div>
                  {/* Mock previews per type */}
                  {b.type === "kpi" && (
                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      <div className="rounded-md border p-2 text-center border-[var(--ring)]">Gap 5.6%</div>
                      <div className="rounded-md border p-2 text-center border-[var(--ring)]">Roles 4</div>
                      <div className="rounded-md border p-2 text-center border-[var(--ring)]">Sites 2</div>
                    </div>
                  )}
                  {b.type === "insights" && (
                    <ul className="mt-3 list-disc pl-5 text-sm text-slate-600">
                      <li>Engineering gap 8.2% (High)</li>
                      <li>H&M har 2 outliers</li>
                      <li>Female % in leadership trending down</li>
                    </ul>
                  )}
                  {b.type === "scenario" && (
                    <div className="mt-3 text-sm text-slate-600">Scenario: +5% Engineers → new gap 2.1%, budget +€240k.</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Copilot suggestion */}
        <div className="rounded-2xl border p-4 text-sm shadow-lg border-[var(--ring)] bg-[var(--panel)]">
          <div className="font-medium text-[var(--text)]">{t("reports.copilot")}</div>
          <p className="mt-1 text-slate-600">{t("reports.copilotPrompt")}</p>
          <div className="mt-2 flex gap-2">
            <Button variant="ghost" onClick={()=>addBlock({ type:"scenario", title:"Scenario: +5% Engineers" })}>{t("common.yes")}</Button>
            <Button variant="ghost">{t("common.no")}</Button>
          </div>
        </div>
      </div>

      {/* Sticky export footer */}
      <div className="fixed inset-x-0 bottom-0 z-10">
        <div className="mx-auto w-full max-w-6xl px-6 pb-4">
          <div className="rounded-2xl border p-3 shadow-lg backdrop-blur border-[var(--ring)] bg-[var(--panel)]">
            <div className="flex items-center justify-between">
              <div className="text-sm subtle">{t("reports.exportFooter")}</div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={saveCurrent}>{t("common.save")}</Button>
                <Button onClick={async()=>{ const url = await exportPdf("demo-se"); const a=document.createElement("a"); a.href=url; a.download="report.pdf"; a.click(); }}><FileDown className="h-4 w-4 mr-1"/> {t("common.exportPdf")}</Button>
                <Button variant="ghost" onClick={async()=>{ const url = await exportCsv("demo-se"); const a=document.createElement("a"); a.href=url; a.download="report.csv"; a.click(); }}>{t("common.exportCsv")}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


