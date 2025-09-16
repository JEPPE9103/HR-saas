"use client";

import { ReactNode } from "react";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

export function BadgeRow() {
  const item = (icon: ReactNode, label: string) => (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ring-1 ring-slate-200 bg-white text-slate-800">
      {icon}
      {label}
    </span>
  );
  return (
    <div className="flex flex-wrap items-center gap-2">
      {item(<CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />, 'EU Directive Ready')}
      {item(<Lock className="h-3.5 w-3.5 text-slate-600" />, 'GDPR Safe')}
      {item(<ShieldCheck className="h-3.5 w-3.5 text-slate-600" />, 'ISO/IEC 27001')}
    </div>
  );
}


