"use client";

import { useEffect, useMemo, useState } from 'react';
import { InsightCard } from '@/components/copilot/InsightCard';
import { ActionPlan } from '@/components/copilot/ActionPlan';
import { ChartEmbed } from '@/components/copilot/ChartEmbed';
import { ExportButtons } from '@/components/reports/ExportButtons';

type InsightBlock = { kind: 'insight'; title: string; summary: string; confidence?: number };
type ActionBlock = { kind: 'action'; steps: { title: string; owner?: string; due?: string }[] };
type ChartBlock = { kind: 'chart'; chart: { type: 'trend'|'roleCompare'|'heatmap'; data: any[] } };
type Block = InsightBlock | ActionBlock | ChartBlock;

const STORAGE_KEY = 'report_builder_blocks_v1';

export default function ReportBuilderPage(){
  const [blocks, setBlocks] = useState<Block[]>([]);

  // Load persisted
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setBlocks(JSON.parse(raw));
    } catch {}
  }, []);

  // Listen for Copilot inserts
  useEffect(() => {
    function onAdd(e: Event){
      const ce = e as CustomEvent<{ block: Block }>;
      if (!ce.detail?.block) return;
      setBlocks(prev => [...prev, ce.detail.block]);
    }
    window.addEventListener('report:add', onAdd as EventListener);
    return () => window.removeEventListener('report:add', onAdd as EventListener);
  }, []);

  // Persist
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(blocks)); } catch {}
  }, [blocks]);

  const csv = useMemo(() => {
    const rows: string[] = [];
    rows.push('type,title,summary');
    for (const b of blocks){
      if (b.kind === 'insight') rows.push(`insight,${escapeCsv(b.title)},${escapeCsv(b.summary)}`);
      if (b.kind === 'action') rows.push(`action,Steps,${escapeCsv(b.steps.map(s=>s.title).join(' | '))}`);
      if (b.kind === 'chart') rows.push(`chart,${b.chart.type},(data)`);
    }
    return rows.join('\n');
  }, [blocks]);

  function escapeCsv(s: string){
    const v = String(s ?? '');
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g,'""') + '"' : v;
  }

  function exportPdf(){
    window.print();
  }
  function exportCsv(){
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'noxheim-report.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  function shareLink(){
    try {
      const payload = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(blocks)))));
      const url = `${location.origin}/report-builder?d=${payload}`;
      navigator.clipboard?.writeText(url);
      alert('Share link copied');
    } catch {
      alert('Could not create link');
    }
  }

  // Support opening via shared link
  useEffect(() => {
    try {
      const d = new URLSearchParams(location.search).get('d');
      if (d) {
        const parsed = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(d)))));
        if (Array.isArray(parsed)) setBlocks(parsed);
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-[60vh]">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Report Builder</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="btn btn-ghost" onClick={() => setBlocks([])}>Clear</button>
          <ExportButtons onExportPdf={exportPdf} onExportCsv={exportCsv} onShare={shareLink} />
        </div>
      </div>
      <p className="text-slate-600 mb-6">Blocks inserted from Copilot will appear below. Use Export to save or share.</p>
      <div className="space-y-4">
        {blocks.length === 0 && (
          <div className="rounded-xl border border-slate-200 p-6 bg-white text-slate-600">
            No blocks yet. Open the Copilot and use /analyze, /trend or /simulate. Then click “Insert into Report” on any insight or chart.
          </div>
        )}
        {blocks.map((b, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
            {b.kind === 'insight' && (
              <InsightCard title={b.title} summary={(b as InsightBlock).summary} confidence={(b as InsightBlock).confidence} />
            )}
            {b.kind === 'action' && (
              <ActionPlan steps={(b as ActionBlock).steps} />
            )}
            {b.kind === 'chart' && (
              <ChartEmbed block={(b as ChartBlock).chart as any} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


