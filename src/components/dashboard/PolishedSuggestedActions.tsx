"use client";

import { useSimulationDrawer } from "@/store/ui";
import { exportCsv } from "@/services/mockApi";
import { useI18n } from "@/providers/I18nProvider";
import { TrendingUp, FileText, AlertTriangle, CheckCircle, Target } from "lucide-react";

type ActionItem = {
  id: string;
  title: string;
  recommendation: string;
  priority: "High" | "Medium" | "Low";
  role?: string;
  percent?: number;
  impact?: string;
};

function getPriorityIcon(priority: string) {
  switch (priority) {
    case "High": return <AlertTriangle className="h-4 w-4 text-[var(--danger)]" />;
    case "Medium": return <Target className="h-4 w-4 text-[var(--warning)]" />;
    case "Low": return <CheckCircle className="h-4 w-4 text-[var(--success)]" />;
    default: return <FileText className="h-4 w-4 text-[var(--text-muted)]" />;
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "High": return "var(--danger-soft-bg)";
    case "Medium": return "var(--warning-soft-bg)";
    case "Low": return "var(--success-soft-bg)";
    default: return "var(--neutral-soft-bg)";
  }
}

function getPriorityTextColor(priority: string) {
  switch (priority) {
    case "High": return "var(--danger-soft-fg)";
    case "Medium": return "var(--warning-soft-fg)";
    case "Low": return "var(--success-soft-fg)";
    default: return "var(--text-muted)";
  }
}

function getPriorityBorderColor(priority: string) {
  switch (priority) {
    case "High": return "border-l-[var(--danger)]";
    case "Medium": return "border-l-[var(--warning)]";
    case "Low": return "border-l-[var(--success)]";
    default: return "border-l-[var(--ring)]";
  }
}

export default function PolishedSuggestedActions({ items }: { items?: ActionItem[] }) {
  const { t } = useI18n();
  const { setOpen, setDefaults } = useSimulationDrawer();
  
  const list: ActionItem[] = items ?? [
    { 
      id: "1", 
      title: t('dashboard.actions.sample1.title'), 
      recommendation: t('dashboard.actions.sample1.rec'), 
      priority: "High",
      role: "Engineer", 
      percent: 5,
      impact: "Reduce gap by 3.2%"
    },
    { 
      id: "2", 
      title: t('dashboard.actions.sample2.title'), 
      recommendation: t('dashboard.actions.sample2.rec'), 
      priority: "Medium",
      role: "Engineer", 
      percent: 0,
      impact: "Improve compliance score"
    },
    { 
      id: "3", 
      title: t('dashboard.actions.sample3.title'), 
      recommendation: t('dashboard.actions.sample3.rec'), 
      priority: "Low",
      role: "PM", 
      percent: 2,
      impact: "Minor optimization"
    },
  ];

  return (
    <div className="p-6 rounded-xl shadow-lg border border-[var(--ring)] bg-[var(--card)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-[var(--text)]">Suggested Actions</h3>
          <p className="text-sm text-[var(--text-muted)]">Priority-ranked recommendations</p>
        </div>
        <button 
          onClick={async() => { 
            const url = await exportCsv('demo-se'); 
            const link = document.createElement('a'); 
            link.href = url; 
            link.download = 'executive-brief.pdf'; 
            link.click(); 
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm text-white hover:bg-[var(--accent-strong)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <FileText className="h-4 w-4" /> Generate Exec Brief
        </button>
      </div>
      
      <ul className="space-y-4">
        {list.map(a => (
          <li key={a.id} className={`rounded-lg border border-[var(--ring)] p-4 hover:bg-[var(--neutral-soft-bg)] transition ${getPriorityBorderColor(a.priority)} border-l-4`}>
            <div className="flex items-start gap-3 mb-3">
              {getPriorityIcon(a.priority)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-[var(--text)]">{a.title}</h4>
                  <span 
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      background: getPriorityColor(a.priority),
                      color: getPriorityTextColor(a.priority),
                    }}
                  >
                    {a.priority}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-2">{a.recommendation}</p>
                {a.impact && (
                  <p className="text-xs text-[var(--text-muted)] font-medium bg-[var(--neutral-soft-bg)] px-2 py-1 rounded inline-block">
                    Impact: {a.impact}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setDefaults({ role: a.role, percent: a.percent }); setOpen(true); }}
                className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-[var(--text)] hover:bg-[var(--neutral-soft-bg)] border-[var(--ring)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <TrendingUp className="h-4 w-4" />
                Simulate
              </button>
              <button 
                onClick={async() => { const url = await exportCsv('demo-se'); const link = document.createElement('a'); link.href = url; link.download = 'adjustments.csv'; link.click(); }}
                className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-[var(--text)] hover:bg-[var(--neutral-soft-bg)] border-[var(--ring)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <FileText className="h-4 w-4" />
                Export
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
