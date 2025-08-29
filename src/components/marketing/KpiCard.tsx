"use client";

import { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger";

export function KpiCard({ title, value, icon, tone = "neutral" }: {
  title: string;
  value: string;
  icon: ReactNode;
  tone?: Tone;
}){
  const toneRing: Record<Tone, string> = {
    neutral: "ring-[var(--ring)]",
    success: "ring-[var(--success-soft-ring)]",
    warning: "ring-[var(--warning-soft-ring)]",
    danger:  "ring-[var(--danger-soft-ring)]",
  };
  const toneBg: Record<Tone, string> = {
    neutral: "bg-[var(--panel)]",
    success: "bg-[var(--success-soft-bg)]/20",
    warning: "bg-[var(--warning-soft-bg)]/20",
    danger:  "bg-[var(--danger-soft-bg)]/20",
  };
  const iconBg: Record<Tone, string> = {
    neutral: "bg-slate-500/20",
    success: "bg-emerald-500/20",
    warning: "bg-amber-500/20",
    danger:  "bg-rose-500/20",
  };

  return (
    <div className={`rounded-2xl border p-4 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${toneRing[tone]} border-[var(--ring)] ${toneBg[tone]}`}>
      <div className="flex items-center gap-3">
        <div className={`h-9 w-9 rounded-xl ${iconBg[tone]} flex items-center justify-center`}>{icon}</div>
        <div className="text-xs subtle">{title}</div>
      </div>
      <div className="mt-2 text-2xl font-semibold text-[var(--text)] tracking-tight">{value}</div>
    </div>
  );
}


