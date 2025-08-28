"use client";

import SeverityBadge from "./SeverityBadge";
import { useI18n } from "@/providers/I18nProvider";

export type Insight = {
  id: string;
  severity: "High"|"Medium"|"Low";
  title: string;
  subtitle?: string;
  recommendation?: string;
};

export default function InsightCard({ i, onSimulate, onExport }:{
  i: Insight;
  onSimulate: (id:string)=>void;
  onExport: (id:string)=>void;
}){
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border p-4 shadow-lg border-[var(--ring)] bg-[var(--panel)] text-[var(--text)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <SeverityBadge level={i.severity} />
            <h3 className="font-medium">{i.title}</h3>
          </div>
          {i.subtitle && <p className="mt-1 text-sm text-muted-foreground">{i.subtitle}</p>}
        </div>
      </div>
      {i.recommendation && <p className="mt-3 text-sm">{i.recommendation}</p>}
      <div className="mt-3 flex items-center gap-2">
        <button onClick={()=>onSimulate(i.id)} className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-slate-50 border-[var(--ring)]">{t("common.simulate")}</button>
        <button onClick={()=>onExport(i.id)} className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-slate-50 border-[var(--ring)]">{t("common.export")}</button>
      </div>
    </div>
  );
}


