"use client";

import { useEffect, useRef, useState } from 'react';
import { Brain, Loader2, Send, X } from 'lucide-react';
import { BadgeRow } from '@/components/ui/BadgeRow';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { InsightCard } from './InsightCard';
import { ActionPlan } from './ActionPlan';
import { ChartEmbed } from './ChartEmbed';
import { payGapTrend, roleCompare, departmentRiskGrid } from '@/lib/mockData';
import { usePathname } from 'next/navigation';

type Block =
  | { kind: 'insight'; title: string; summary: string; confidence?: number }
  | { kind: 'action'; steps: { title: string; owner?: string; due?: string }[] }
  | { kind: 'chart'; chart:
      | { type: 'trend'; data: { month: string; gap: number }[] }
      | { type: 'roleCompare'; data: { role: string; male: number; female: number }[] }
      | { type: 'heatmap'; data: { department: string; risk: number }[] }
    };

export function CopilotPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [messages, setMessages] = useState<{ role: 'user'|'assistant'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname?.() ?? '';

  useEffect(() => {
    function onOpen(e: Event){
      const ce = e as CustomEvent<{ message?: string; send?: boolean }>;
      setOpen(true);
      if (ce.detail?.message) setInput(ce.detail.message);
      if (ce.detail?.send) {
        setTimeout(() => handleSend(), 0);
      }
    }
    window.addEventListener('copilot:open', onOpen as EventListener);
    return () => window.removeEventListener('copilot:open', onOpen as EventListener);
  }, []);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  async function handleSend(){
    const q = input.trim();
    if (!q || isLoading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setIsLoading(true);
    try {
      const res = await fetch('/api/copilot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-locale': navigator.language?.startsWith('sv') ? 'sv' : 'en',
          'x-tenant-id': 'demo-se',
        },
        body: JSON.stringify({ sessionId: 'local', datasetId: 'demo-se', message: q })
      });
      const data = await res.json();
      if (Array.isArray(data?.blocks)) {
        setBlocks(data.blocks as Block[]);
        setMessages(prev => [...prev, { role: 'assistant', content: 'Added analysis blocks below.' }]);
      } else if (typeof data?.text === 'string') {
        setMessages(prev => [...prev, { role: 'assistant', content: sanitize(data.text) }]);
      } else if (typeof data?.error === 'string') {
        setMessages(prev => [...prev, { role: 'assistant', content: data.error }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'No result. Try /analyze, /trend or /simulate.' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }

  function sanitize(s: string){
    return s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`{1,3}([^`]+)`{1,3}/g, '$1');
  }

  return (
    <>
      {!open && pathname !== '/overview' && (
        <button aria-label="Open AI Copilot" onClick={() => setOpen(true)} className="fixed right-6 bottom-24 z-40 rounded-full p-4 text-white shadow-2xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-support)] hover:brightness-110">
          <Brain className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[460px] sm:rounded-l-2xl bg-white/95 backdrop-blur-md shadow-2xl border-l border-slate-200 flex flex-col" role="dialog" aria-label="AI Copilot" onKeyDown={(e)=>{ if(e.key==='Escape') setOpen(false); }}>
            <div className="p-4 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-support)] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">AI Copilot</div>
                  <div className="text-[11px] opacity-90">Pay equity assistant</div>
                </div>
              </div>
              <button aria-label="Close" onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={panelRef} className="flex-1 overflow-y-auto p-4 space-y-3 outline-none bg-slate-50/50" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.role==='user' ? 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-support)] text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-800 shadow-sm'}`}>{m.content}</div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-slate-600 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Thinking…</div>
              )}
              {blocks.length > 0 && (
                <div className="pt-2 text-[11px] uppercase tracking-wide text-slate-500">Results</div>
              )}
              {blocks.map((b, i) => (
                <div key={i}>
                  {b.kind === 'insight' && (
                    <InsightCard title={b.title} summary={b.summary} confidence={b.confidence} onInsert={() => window.dispatchEvent(new CustomEvent('report:add', { detail: { block: b } }))} />
                  )}
                  {b.kind === 'action' && (
                    <ActionPlan steps={b.steps} onCreate={() => window.location.assign('/report-builder')} />
                  )}
                  {b.kind === 'chart' && (
                    <ChartEmbed block={b.chart as any} />
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 p-3 bg-white">
              <div className="flex gap-2">
                <Input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Which departments have the largest gap?" onKeyDown={(e)=>{ if(e.key==='Enter') handleSend(); }} className="flex-1" />
                <Button onClick={handleSend} className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-support)] text-white"><Send className="h-4 w-4" /></Button>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {['/analyze','/recommend','/trend','/action','/simulate','/monitor','/report'].map(cmd => (
                  <button key={cmd} onClick={()=>setInput(cmd)} className="px-2 py-1 rounded-md text-xs bg-white ring-1 ring-slate-200 hover:bg-slate-50">{cmd}</button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}


