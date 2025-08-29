"use client";

import { MoreHorizontal, TrendingUp, FileDown } from "lucide-react";
import { useI18n } from "@/providers/I18nProvider";
import { useAppStore } from "@/store/app";

interface Insight {
  id: string;
  severity: "High" | "Medium" | "Low";
  title: string;
  recommendation: string;
}

const insights: Insight[] = [
  {
    id: "1",
    severity: "High",
    title: "Engineering gap 8.2% (Role variance high)",
    recommendation: "Recommend +5% raise for IC2–IC4 in SE. Est. budget +€240k, new gap 2.1%."
  },
  {
    id: "2",
    severity: "High",
    title: "H&M has 2 outliers >40% above median",
    recommendation: "Review exceptions; cap at P90 for IC levels."
  },
  {
    id: "3",
    severity: "Medium",
    title: "Project Manager variance trending ↑",
    recommendation: "Audit leveling IC3↔IC4 before Q4 cycle."
  },
  {
    id: "4",
    severity: "Low",
    title: "Sales gap 3.1% (within guardrail)",
    recommendation: "Monitor trend; consider targeted adjustments for top performers."
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "High": return "bg-[var(--danger-soft-bg)] text-[var(--danger-soft-fg)] ring-[var(--danger-soft-ring)]";
    case "Medium": return "bg-[var(--warning-soft-bg)] text-[var(--warning-soft-fg)] ring-[var(--warning-soft-ring)]";
    case "Low": return "bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-[var(--success-soft-ring)]";
    default: return "bg-[var(--neutral-soft-bg)] text-[var(--neutral-soft-fg)] ring-[var(--neutral-soft-ring)]";
  }
};

export default function ExecutiveInsightsFeed() {
  const { t } = useI18n();
  const setCopilotOpen = useAppStore((s) => s.setCopilotOpen);

  const handleInsightClick = (insight: Insight) => {
    // Open Copilot with context
    setCopilotOpen(true);
    // Could also set context: setCopilotContext(insight);
  };

  const handleSimulate = (e: React.MouseEvent, insightId: string) => {
    e.stopPropagation();
    // Open simulation drawer
    console.log("Simulate insight:", insightId);
  };

  const handleExport = (e: React.MouseEvent, insightId: string) => {
    e.stopPropagation();
    // Export insight
    console.log("Export insight:", insightId);
  };

  return (
    <div className="h-full p-6 bg-[var(--card)] rounded-2xl shadow-md border border-[var(--ring)]">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--text)]">{t("dashboard.insights.title")}</h3>
        <p className="text-sm text-[var(--text-muted)]">{t("dashboard.insights.subtitle")}</p>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            onClick={() => handleInsightClick(insight)}
            className="p-4 rounded-xl border border-[var(--ring)] bg-[var(--panel)] hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ${getSeverityColor(insight.severity)}`}>
                    {t(`common.${insight.severity.toLowerCase()}`)}
                  </span>
                </div>
                <h4 className="font-semibold text-[var(--text)] leading-tight">
                  {insight.title}
                </h4>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {insight.recommendation}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Primary action for High severity */}
                {insight.severity === "High" && (
                  <button
                    onClick={(e) => handleSimulate(e, insight.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-strong)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <TrendingUp className="h-3 w-3" />
                    {t("common.simulate")}
                  </button>
                )}
                
                {/* Kebab menu for Medium/Low severity or secondary actions */}
                <div className="relative">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--neutral-soft-bg)] transition opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  
                  {/* Dropdown menu would go here */}
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-[var(--ring)] bg-[var(--card)] shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-10">
                    <div className="py-1">
                      <button
                        onClick={(e) => handleSimulate(e, insight.id)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--neutral-soft-bg)] transition"
                      >
                        <TrendingUp className="h-4 w-4" />
                        {t("common.simulate")}
                      </button>
                      <button
                        onClick={(e) => handleExport(e, insight.id)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--neutral-soft-bg)] transition"
                      >
                        <FileDown className="h-4 w-4" />
                        {t("common.export")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
