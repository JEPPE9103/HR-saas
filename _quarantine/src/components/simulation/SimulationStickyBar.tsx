"use client";
export const dynamic = "force-dynamic";

import { useSimulationDrawer } from "@/store/ui";
import { exportPdf, exportCsv } from "@/services/mockApi";
import { useSearchParams } from "next/navigation";

export default function SimulationStickyBar(){
  const { resultText } = useSimulationDrawer();
  const sp = useSearchParams();
  const datasetId = sp.get("datasetId") || "demo-se";
  if(!resultText) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-xl border bg-white/95 backdrop-blur p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900/95 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-700 dark:text-slate-300 truncate">{resultText}</div>
          <div className="flex items-center gap-2">
            <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-white">Save scenario</button>
            <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50" onClick={async()=>{ const url = await exportPdf(datasetId); const a=document.createElement('a'); a.href=url; a.download='report.pdf'; a.click(); }}>Export PDF</button>
            <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50" onClick={async()=>{ const url = await exportCsv(datasetId); const a=document.createElement('a'); a.href=url; a.download='adjustments.csv'; a.click(); }}>Export CSV</button>
          </div>
        </div>
      </div>
    </div>
  );
}


