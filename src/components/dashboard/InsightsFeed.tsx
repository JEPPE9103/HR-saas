"use client";

import { MoreVertical, TrendingUp, FileDown } from "lucide-react";
import { useAppStore } from "@/store/app";
import { useSimulationDrawer } from "@/store/ui";
import { useI18n } from "@/providers/I18nProvider";

interface Insight {
  id: string;
  title: string;
  body: string;
  severity: "High" | "Medium" | "Low";
}

interface InsightsFeedProps {
  insights: Insight[];
}

function getSeverityEmoji(severity: string): string {
  switch (severity) {
    case "High": return "🔴";
    case "Medium": return "🟠";
    case "Low": return "🟡";
    default: return "⚪";
  }
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case "High": return "var(--danger-soft-bg)";
    case "Medium": return "var(--warning-soft-bg)";
    case "Low": return "var(--success-soft-bg)";
    default: return "var(--neutral-soft-bg)";
  }
}

function getSeverityTextColor(severity: string): string {
  switch (severity) {
    case "High": return "var(--danger-soft-fg)";
    case "Medium": return "var(--warning-soft-fg)";
    case "Low": return "var(--success-soft-fg)";
    default: return "var(--text-muted)";
  }
}

export default function InsightsFeed({ insights }: InsightsFeedProps) {
  const { t } = useI18n();
  const setCopilotOpen = useAppStore((s) => s.setCopilotOpen);
  const { setOpen, setDefaults } = useSimulationDrawer();

  const handleInsightClick = (insight: Insight) => {
    // Open Copilot with preloaded context
    setCopilotOpen(true);
    // You could also set a message in the Copilot context here
  };

  const handleSimulate = (insight: Insight) => {
    // Extract role from insight title if possible
    const roleMatch = insight.title.match(/(Engineer|PM|Sales|Design|Ops)/i);
    const role = roleMatch ? roleMatch[1] : "Engineer";
    setDefaults({ role, percent: 5 });
    setOpen(true);
  };

  const handleExport = (insight: Insight) => {
    // Export functionality
    const a = document.createElement("a");
    a.href = `/exports/insight-${insight.id}.pdf`;
    a.download = `insight-${insight.id}.pdf`;
    a.click();
  };

  return (
    <div className="p-6 rounded-xl shadow-md border border-[var(--ring)] bg-[var(--card)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)]">Key Insights</h3>
          <p className="text-sm text-[var(--text-muted)]">AI-powered recommendations</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-[var(--neutral-soft-bg)] border-[var(--ring)] text-[var(--text)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
          <FileDown className="h-4 w-4" /> {t('insights.exportBrief')}
        </button>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className="group relative rounded-lg border border-[var(--ring)] p-4 hover:bg-[var(--neutral-soft-bg)] transition cursor-pointer"
            onClick={() => handleInsightClick(insight)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getSeverityEmoji(insight.severity)}</span>
                  <span 
                    className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                    style={{
                      background: getSeverityColor(insight.severity),
                      color: getSeverityTextColor(insight.severity),
                    }}
                  >
                    {insight.severity}
                  </span>
                </div>
                <h4 className="font-medium text-[var(--text)] mb-2">{insight.title}</h4>
                <p className="text-sm text-[var(--text-muted)]">{insight.body}</p>
              </div>
              
              <div className="relative">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute right-0 top-0 z-10 bg-[var(--card)] border border-[var(--ring)] rounded-lg shadow-lg p-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSimulate(insight);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--neutral-soft-bg)] rounded transition"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Simulate
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExport(insight);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--neutral-soft-bg)] rounded transition"
                    >
                      <FileDown className="h-4 w-4" />
                      Export
                    </button>
                  </div>
                </div>
                <MoreVertical className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--text)] transition" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
