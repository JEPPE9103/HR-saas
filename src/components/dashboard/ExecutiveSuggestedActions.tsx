"use client";

import { TrendingUp, FileDown, ArrowRight } from "lucide-react";
import { useI18n } from "@/providers/I18nProvider";

interface Action {
  id: string;
  priority: "High" | "Medium" | "Low";
  title: string;
  description: string;
  impact: string;
  budget?: string;
}

const actions: Action[] = [
  {
    id: "1",
    priority: "High",
    title: "Reduce Engineering gap to <3%",
    description: "Targeted adjustments for IC2–IC4 levels",
    impact: "reduce gap by 5.2%",
    budget: "+€240k"
  },
  {
    id: "2",
    priority: "High",
    title: "Review outliers at H&M",
    description: "Cap salaries at P90 for IC levels",
    impact: "reduce variance by 2.1%",
    budget: "€0"
  },
  {
    id: "3",
    priority: "Medium",
    title: "Adjust PM IC3↔IC4 levels",
    description: "Audit leveling and pay bands",
    impact: "reduce gap by 1.8%",
    budget: "+€85k"
  },
  {
    id: "4",
    priority: "Low",
    title: "Monitor Sales trend",
    description: "Track performance over next quarter",
    impact: "maintain compliance",
    budget: "€0"
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "border-l-[var(--danger-500)]";
    case "Medium": return "border-l-[var(--warning-500)]";
    case "Low": return "border-l-[var(--success-500)]";
    default: return "border-l-[var(--ring)]";
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "High": return "🔴";
    case "Medium": return "🟠";
    case "Low": return "🟡";
    default: return "⚪";
  }
};

export default function ExecutiveSuggestedActions() {
  const { t } = useI18n();

  const handleGenerateBrief = () => {
    // Generate executive brief
    console.log("Generate executive brief");
  };

  const handleSimulate = (actionId: string) => {
    // Open simulation drawer
    console.log("Simulate action:", actionId);
  };

  return (
    <div className="h-full p-6 bg-[var(--card)] rounded-2xl shadow-md border border-[var(--ring)]">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--text)]">{t("dashboard.actions.title")}</h3>
        <p className="text-sm text-[var(--text-muted)]">{t("dashboard.actions.subtitle")}</p>
      </div>

      {/* Generate Exec Brief Button */}
      <div className="mb-6">
        <button
          onClick={handleGenerateBrief}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-white hover:bg-[var(--accent-strong)] transition font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <FileDown className="h-4 w-4" />
          {t("dashboard.actions.generateBrief")}
        </button>
      </div>

      {/* Actions List */}
      <div className="space-y-3">
        {actions.map((action) => (
          <div
            key={action.id}
            className={`p-4 rounded-xl border border-[var(--ring)] bg-[var(--panel)] ${getPriorityColor(action.priority)} border-l-4`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getPriorityIcon(action.priority)}</span>
                  <h4 className="font-semibold text-[var(--text)] leading-tight">
                    {action.title}
                  </h4>
                </div>
              </div>
              
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {action.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-[var(--success)]">
                    {t("dashboard.actions.impact")} {action.impact}
                  </div>
                  {action.budget && (
                    <div className="text-xs text-[var(--text-muted)]">
                      {t("dashboard.actions.budget")} {action.budget}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleSimulate(action.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ring)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:bg-[var(--neutral-soft-bg)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <TrendingUp className="h-3 w-3" />
                  {t("common.simulate")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Actions */}
      <div className="mt-6 pt-4 border-t border-[var(--ring)]">
        <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--ring)] px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--neutral-soft-bg)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
          {t("dashboard.actions.viewAll")}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
