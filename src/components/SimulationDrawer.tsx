"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useSimulationDrawer } from "@/store/ui";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TrendingUp, Zap, Target } from "lucide-react";

export function SimulationDrawer() {
  const { open, setOpen, defaults, setResultText, setResult, setResultOpen } = useSimulationDrawer();
  const sp = useSearchParams();
  const datasetId = sp.get("datasetId") || "demo-se";
  const [role, setRole] = useState(defaults?.role ?? "Engineer");
  const [percent, setPercent] = useState(defaults?.percent ?? 5);
  
  // Preset scenarios for quick access
  const presetScenarios = [
    {
      name: "Engineering Gap Fix",
      description: "+3% adjustment for Software Engineers",
      role: "Software Engineer",
      percent: 3,
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      name: "Leadership Boost",
      description: "+5% adjustment for Project Managers",
      role: "Project Manager", 
      percent: 5,
      icon: <Target className="h-4 w-4" />
    },
    {
      name: "Sales Team Adjustment",
      description: "+4% adjustment for Sales Executives",
      role: "Sales Executive",
      percent: 4,
      icon: <Zap className="h-4 w-4" />
    }
  ];

  async function run() {
    const res = await fetch("/api/copilot/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: "local", datasetId, message: `/simulate role:"${role}" +${percent}%` }),
    });
    const data = await res.json();
    setResultText(data?.text as string | undefined);
    const m = /new gap\s(\d+\.\d+)/.exec(data?.text || "");
    const gapPercent = m ? Number(m[1]) : 0;
    const impacted = /Impacted\s(\d+)/i.exec(data?.text || "")?.[1];
    const budget = /\+(\d+)\sSEK/i.exec(data?.text || "")?.[1];
    setResult({ gapPercent, impacted: impacted ? Number(impacted) : 0, budgetAnnual: budget ? Number(budget) : 0 });
    setResultOpen(true);
  }

  function applyPreset(preset: typeof presetScenarios[0]) {
    setRole(preset.role);
    setPercent(preset.percent);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-full max-w-[480px] bg-[var(--card)] border-l border-[var(--ring)] shadow-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--text)]">Simulation</h2>
          <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
        </div>
        
        {/* Preset Scenarios */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-[var(--text)]">Quick Scenarios</h3>
          <div className="grid gap-2">
            {presetScenarios.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyPreset(preset)}
                className="flex items-center gap-3 p-3 rounded-lg border border-[var(--ring)] bg-[var(--panel)] hover:bg-[var(--neutral-soft-bg)] transition text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <div className="text-[var(--accent)]">{preset.icon}</div>
                <div>
                  <div className="text-sm font-medium text-[var(--text)]">{preset.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">{preset.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--ring)] pt-3">
          <h3 className="text-sm font-medium text-[var(--text)] mb-3">Custom Simulation</h3>
          <div className="grid gap-3">
            <label className="text-sm text-[var(--text-muted)]">Role</label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} />
            <label className="text-sm text-[var(--text-muted)]">Percentage</label>
            <Input type="number" value={percent} onChange={(e) => setPercent(Number(e.target.value))} />
            <Button onClick={run} className="bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white">Run Simulation</Button>
          </div>
        </div>
        {/* Result text rendered in sticky bar / result panel */}
      </div>
    </div>
  );
}


