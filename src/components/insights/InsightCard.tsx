"use client";

import SeverityBadge from "./SeverityBadge";

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
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg">
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
        <button onClick={()=>onSimulate(i.id)} className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5">Simulate</button>
        <button onClick={()=>onExport(i.id)} className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5">Export</button>
      </div>
    </div>
  );
}


