"use client";

import { ReactNode } from "react";

type KPIProps = {
  label: string;
  value: string | number;
  delta?: { value: number; positiveIsGood?: boolean };
  badge?: ReactNode;
};

export function KPI({ label, value, delta, badge }: KPIProps) {
  const deltaValue = typeof delta?.value === 'number' ? delta.value : null;
  const positiveIsGood = delta?.positiveIsGood ?? false;
  const isImproving = deltaValue !== null ? (positiveIsGood ? deltaValue > 0 : deltaValue < 0) : null;
  const deltaColor = isImproving === null ? 'bg-slate-100 text-slate-700' : isImproving ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700';

  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--brand-accent)]/20 to-[var(--brand-support)]/10 rounded-full blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 font-medium">{label}</div>
          {badge}
        </div>
        <div className="mt-3 text-4xl font-light text-slate-900">{typeof value === 'number' ? value.toLocaleString('sv-SE') : value}</div>
        {deltaValue !== null && (
          <div className={`mt-3 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${deltaColor}`}>
            {deltaValue > 0 ? '+' : ''}{deltaValue.toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}


