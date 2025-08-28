"use client";

import { ReactNode } from "react";

export function MarketingFeatureCard({ icon, title, children }:{ icon: ReactNode; title: string; children: ReactNode; }){
  return (
    <div className="rounded-2xl border p-5 shadow-md hover:shadow-lg transition border-[var(--ring)] bg-[var(--panel)]">
      <div className="mb-2 flex items-center gap-3 text-[var(--text)]">
        <div className="h-9 w-9 rounded-xl bg-slate-500/20 flex items-center justify-center">{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-slate-600">{children}</p>
    </div>
  );
}


