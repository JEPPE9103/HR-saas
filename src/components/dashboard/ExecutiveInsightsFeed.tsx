"use client";

import { MoreHorizontal, TrendingUp, FileDown, Lightbulb, Info } from "lucide-react";
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
    title: "Engineering pay gap requires immediate attention",
    recommendation: "Consider targeted raises for IC2–IC4 levels in Software Engineering. Estimated budget impact: €240k, projected gap reduction to 2.1%."
  },
  {
    id: "2",
    severity: "High",
    title: "Outlier compensation detected in H&M department",
    recommendation: "Review and standardize compensation for roles exceeding P90 benchmarks to ensure fair pay practices."
  },
  {
    id: "3",
    severity: "Medium",
    title: "Project Manager leveling needs review",
    recommendation: "Audit IC3↔IC4 leveling criteria before Q4 compensation cycle to reduce variance."
  },
  {
    id: "4",
    severity: "Low",
    title: "Sales team pay equity within acceptable range",
    recommendation: "Continue monitoring trends and consider targeted adjustments for high performers to maintain motivation."
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
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-[var(--text)]">AI-Powered Insights</h3>
          <div className="group relative">
            <Info className="h-4 w-4 text-[var(--text-muted)] cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs bg-[var(--card)] border border-[var(--ring)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              AI analyzes your data to identify pay equity opportunities
            </div>
          </div>
        </div>
        <p className="text-sm text-[var(--text-muted)]">Prioritized recommendations to close your pay gap</p>
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
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ${getSeverityColor(insight.severity)}`}>
                    {t(`common.${insight.severity.toLowerCase()}`)}
                  </span>
                </div>
                <h4 className="font-semibold text-[var(--text)] leading-tight">
                  {insight.title}
                </h4>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--neutral-soft-bg)] border border-[var(--ring)]">
                  <Lightbulb className="h-4 w-4 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[var(--text)] leading-relaxed">
                    {insight.recommendation}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Primary action for High severity */}
                {insight.severity === "High" && (
                  <button
                    onClick={(e) => handleSimulate(e, insight.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-strong)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <TrendingUp className="h-3 w-3" />
                    Simulate Adjustment
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
                        Simulate Adjustment
                      </button>
                      <button
                        onClick={(e) => handleExport(e, insight.id)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--neutral-soft-bg)] transition"
                      >
                        <FileDown className="h-4 w-4" />
                        Export to Report
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
