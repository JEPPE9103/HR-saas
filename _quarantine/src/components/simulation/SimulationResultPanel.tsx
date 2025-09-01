"use client";
export const dynamic = "force-dynamic";

import { useSimulationDrawer } from "@/store/ui";
import { useSearchParams } from "next/navigation";
import { exportCsv, exportPdf } from "@/services/mockApi";

function MiniHistogram(){
  return (
    <div className="h-20 w-full rounded-md bg-gradient-to-t from-slate-800 to-slate-700 flex items-end gap-1 p-2">
      {[4,8,12,16,10,6,3,2,1].map((h,i)=>(
        <div key={i} style={{ height: `${h*4}px`}} className="w-3 rounded bg-indigo-500/70" />
      ))}
    </div>
  );
}

export default function SimulationResultPanel(){
  const { resultOpen, setResultOpen, result, resultText } = useSimulationDrawer();
  const sp = useSearchParams();
  const datasetId = sp.get("datasetId") || "demo-se";
  if(!resultOpen) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/30" onClick={()=>setResultOpen(false)} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-[480px] bg-[var(--card)] border-l border-[var(--ring)] shadow-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--text)]">Simulation result</h2>
          <button className="text-sm subtle" onClick={()=>setResultOpen(false)}>Close</button>
        </div>
        <div className="grid gap-3 text-sm">
          <div className="rounded-lg border p-3">
            <div className="text-xs subtle">New gender gap</div>
            <div className="text-2xl font-semibold">{result?.gapPercent?.toFixed?.(1) ?? "–"}%</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <div className="text-xs subtle">Impacted employees</div>
              <div className="text-lg font-semibold">{result?.impacted ?? "–"}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs subtle">Annual budget delta</div>
              <div className="text-lg font-semibold">+{result?.budgetAnnual?.toFixed?.(0) ?? "–"} SEK</div>
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs subtle">Compliance guardrail</div>
            <div className="mt-1 inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs ring-1 bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-[var(--success-soft-ring)]">N≥10 enforced</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs subtle mb-2">Distribution (demo)</div>
            <MiniHistogram />
          </div>
          {resultText && <div className="rounded-lg border p-3 text-xs subtle">{resultText}</div>}
        </div>
        <div className="mt-auto flex gap-2">
          <button className="rounded-md border px-3 py-1.5 text-sm" onClick={async()=>{ const url = await exportCsv(datasetId); const a=document.createElement('a'); a.href=url; a.download='adjustments.csv'; a.click(); }}>Export CSV</button>
          <button className="rounded-md border px-3 py-1.5 text-sm" onClick={async()=>{ const url = await exportPdf(datasetId); const a=document.createElement('a'); a.href=url; a.download='report.pdf'; a.click(); }}>Add to report</button>
          <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-white" onClick={()=>{ navigator.clipboard.writeText(resultText || 'Simulation result'); }}>Copy summary</button>
        </div>
      </aside>
    </div>
  );
}


