"use client";

import { ReactNode } from "react";

export function MarketingFeatureCard({ icon, title, children }:{ icon: ReactNode; title: string; children: ReactNode; }){
  return (
    <div className="rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 border-slate-200 bg-white hover:border-slate-400">
      <div className="mb-2 flex items-center gap-3 text-slate-800">
        <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center">{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-slate-600">{children}</p>
    </div>
  );
}


