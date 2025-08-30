"use client";

import { useState } from "react";
import { TrendingUp, FileDown, ArrowRight, CheckCircle, Info } from "lucide-react";
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
    title: "Address Engineering pay gap",
    description: "Implement targeted adjustments for IC2–IC4 levels to achieve compliance",
    impact: "reduce gap by 5.2%",
    budget: "+€240k"
  },
  {
    id: "2",
    priority: "High",
    title: "Standardize H&M compensation",
    description: "Review and cap outlier salaries at P90 benchmarks for IC levels",
    impact: "reduce variance by 2.1%",
    budget: "€0"
  },
  {
    id: "3",
    priority: "Medium",
    title: "Review Project Manager leveling",
    description: "Audit IC3↔IC4 leveling criteria and adjust pay bands accordingly",
    impact: "reduce gap by 1.8%",
    budget: "+€85k"
  },
  {
    id: "4",
    priority: "Low",
    title: "Monitor Sales team trends",
    description: "Continue tracking performance metrics and consider targeted adjustments",
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerateBrief = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    setIsGenerated(true);
    
    // Reset after 3 seconds
    setTimeout(() => setIsGenerated(false), 3000);
  };

  const handleSimulate = (actionId: string) => {
    // Open simulation drawer
    console.log("Simulate action:", actionId);
  };

  return (
    <div className="h-full p-6 bg-[var(--card)] rounded-2xl shadow-md border border-[var(--ring)]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-[var(--text)]">Next Steps to Close the Gap</h3>
          <div className="group relative">
            <Info className="h-4 w-4 text-[var(--text-muted)] cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs bg-[var(--card)] border border-[var(--ring)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              Prioritized actions to achieve pay equity compliance
            </div>
          </div>
        </div>
        <p className="text-sm text-[var(--text-muted)]">Strategic recommendations ranked by impact and urgency</p>
      </div>

      {/* Generate Exec Brief Button */}
      <div className="mb-6">
        <button
          onClick={handleGenerateBrief}
          disabled={isGenerating}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
            isGenerated 
              ? 'bg-[var(--success)] text-white' 
              : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating Executive Brief...
            </>
          ) : isGenerated ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Executive Brief Ready
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4" />
              Generate Executive Brief
            </>
          )}
        </button>
      </div>

      {/* Actions List */}
      <div className="space-y-3">
        {actions.map((action) => (
          <div
            key={action.id}
            className={`p-4 rounded-xl border border-[var(--ring)] bg-[var(--panel)] ${getPriorityColor(action.priority)} border-l-4 hover:shadow-sm transition-all duration-200`}
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
                    Impact: {action.impact}
                  </div>
                  {action.budget && (
                    <div className="text-xs text-[var(--text-muted)]">
                      Budget: {action.budget}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleSimulate(action.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ring)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:bg-[var(--neutral-soft-bg)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <TrendingUp className="h-3 w-3" />
                  Simulate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Actions */}
      <div className="mt-6 pt-4 border-t border-[var(--ring)]">
        <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--ring)] px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--neutral-soft-bg)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
          View all recommendations
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
