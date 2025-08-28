"use client";

import { useSimulationDrawer } from "@/store/ui";
import { exportCsv } from "@/services/mockApi";
import { useI18n } from "@/providers/I18nProvider";

type ActionItem = {
  id: string;
  title: string;
  recommendation: string;
  role?: string;
  percent?: number;
};

export default function ActionQueue({ items }: { items?: ActionItem[] }){
  const { t } = useI18n();
  const { setOpen, setDefaults } = useSimulationDrawer();
  const list: ActionItem[] = items ?? [
    { id: "1", title: t('dashboard.actions.sample1.title'), recommendation: t('dashboard.actions.sample1.rec'), role: "Engineer", percent: 5 },
    { id: "2", title: t('dashboard.actions.sample2.title'), recommendation: t('dashboard.actions.sample2.rec'), role: "Engineer", percent: 0 },
    { id: "3", title: t('dashboard.actions.sample3.title'), recommendation: t('dashboard.actions.sample3.rec'), role: "PM", percent: 2 },
  ];
  return (
    <div className="card-muted p-4 rounded-xl shadow-md">
      <div className="mb-2 text-sm subtle">{t("dashboard.actionQueue")}</div>
      <ul className="space-y-3">
        {list.map(a => (
          <li key={a.id} className="rounded-lg border p-3 border-[var(--ring)]">
            <div className="font-medium text-[var(--text)]">{a.title}</div>
            <div className="mt-1 text-sm subtle">{a.recommendation}</div>
            <div className="mt-2 flex items-center gap-2">
              <button className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-slate-50 border-[var(--ring)]" onClick={()=>{ setDefaults({ role: a.role, percent: a.percent }); setOpen(true); }}>{t("common.simulate")}</button>
              <button className="rounded-md border px-2.5 py-1.5 text-sm hover:bg-slate-50 border-[var(--ring)]" onClick={async()=>{ const url = await exportCsv('demo-se'); const link=document.createElement('a'); link.href=url; link.download='adjustments.csv'; link.click(); }}>{t("common.export")}</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


