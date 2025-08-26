"use client";

import { useSimulationDrawer } from "@/store/ui";

type ActionItem = {
  id: string;
  title: string;
  recommendation: string;
  role?: string;
  percent?: number;
};

export default function ActionQueue({ items }: { items?: ActionItem[] }){
  const { setOpen, setDefaults } = useSimulationDrawer();
  const list: ActionItem[] = items ?? [
    { id: "1", title: "Reduce Eng gap to <3%", recommendation: "+5% raise for IC2–IC4 in SE", role: "Engineer", percent: 5 },
    { id: "2", title: "Review Berlin outliers", recommendation: "Cap exceptions at P90", role: "Engineer", percent: 0 },
    { id: "3", title: "Level PM IC3↔IC4", recommendation: "Audit leveling and pay bands", role: "PM", percent: 2 },
  ];
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-2 text-sm text-slate-600 dark:text-slate-400">Action Queue</div>
      <ul className="space-y-3">
        {list.map(a => (
          <li key={a.id} className="rounded-lg border p-3 dark:border-slate-700">
            <div className="font-medium text-slate-900 dark:text-slate-100">{a.title}</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{a.recommendation}</div>
            <div className="mt-2 flex items-center gap-2">
              <button className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50" onClick={()=>{ setDefaults({ role: a.role, percent: a.percent }); setOpen(true); }}>Simulate</button>
              <a className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50" href="/api/copilot/ask">Export</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


