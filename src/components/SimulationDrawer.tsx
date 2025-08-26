"use client";

import { useState } from "react";
import { useSimulationDrawer } from "@/store/ui";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function SimulationDrawer() {
  const { open, setOpen, defaults, setResultText, resultText } = useSimulationDrawer();
  const sp = useSearchParams();
  const datasetId = sp.get("datasetId") || "demo-se";
  const [role, setRole] = useState(defaults?.role ?? "Engineer");
  const [percent, setPercent] = useState(defaults?.percent ?? 5);
  const [result, setResult] = useState<any>(null);

  async function run() {
    const res = await fetch("/api/copilot/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: "local", datasetId, message: `/simulate role:"${role}" +${percent}%` }),
    });
    const data = await res.json();
    setResult(data);
    setResultText(data?.text as string | undefined);
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
        <div className="grid gap-3">
          <label className="text-sm subtle">Role</label>
          <Input value={role} onChange={(e) => setRole(e.target.value)} />
          <label className="text-sm subtle">Percentage</label>
          <Input type="number" value={percent} onChange={(e) => setPercent(Number(e.target.value))} />
          <Button onClick={run}>Run</Button>
        </div>
        {result && (
          <div className="text-sm subtle">{result.text}</div>
        )}
      </div>
    </div>
  );
}


