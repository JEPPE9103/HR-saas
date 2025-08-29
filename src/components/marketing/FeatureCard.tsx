"use client";

import { ReactNode } from "react";

export function MarketingFeatureCard({ icon, title, children }:{ icon: ReactNode; title: string; children: ReactNode; }){
  return (
    <div className="rounded-2xl border p-5 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-[var(--ring)] bg-[var(--panel)] hover:border-indigo-300 dark:hover:border-indigo-600">
      <div className="mb-2 flex items-center gap-3 text-[var(--text)]">
        <div className="h-9 w-9 rounded-xl bg-indigo-100 dark:bg-slate-700/30 flex items-center justify-center">{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-slate-800 dark:text-slate-400">{children}</p>
    </div>
  );
}


