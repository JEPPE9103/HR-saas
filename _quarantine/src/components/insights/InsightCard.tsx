"use client";

import SeverityBadge from "./SeverityBadge";
import { useI18n } from "@/providers/I18nProvider";
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Play, Download } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/Button";

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

  // Generate sparkline data based on severity
  const sparklineData = [
    { value: i.severity === "High" ? 8.5 : i.severity === "Medium" ? 6.2 : 4.1 },
    { value: i.severity === "High" ? 8.8 : i.severity === "Medium" ? 6.0 : 4.3 },
    { value: i.severity === "High" ? 9.1 : i.severity === "Medium" ? 5.8 : 4.0 },
    { value: i.severity === "High" ? 8.9 : i.severity === "Medium" ? 6.1 : 4.2 },
    { value: i.severity === "High" ? 9.3 : i.severity === "Medium" ? 6.0 : 4.1 },
  ];

  const severityColors = {
    High: "var(--danger)",
    Medium: "var(--warning)", 
    Low: "var(--success)"
  };

  const severityIcons = {
    High: AlertTriangle,
    Medium: TrendingUp,
    Low: TrendingDown
  };

  const IconComponent = severityIcons[i.severity];

  return (
    <div className="rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 border-[var(--ring)] bg-[var(--card)] text-[var(--text)] group">
      {/* Header with severity and icon */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            i.severity === "High" ? "bg-[var(--danger-soft-bg)] text-[var(--danger)]" :
            i.severity === "Medium" ? "bg-[var(--warning-soft-bg)] text-[var(--warning)]" :
            "bg-[var(--success-soft-bg)] text-[var(--success)]"
          }`}>
            <IconComponent className="h-4 w-4" />
          </div>
          <div>
            <SeverityBadge level={i.severity} />
          </div>
        </div>
        
        {/* Sparkline */}
        <div className="w-16 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={severityColors[i.severity]}
                strokeWidth={2}
                dot={false}
                strokeOpacity={0.8}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-[var(--text)] text-base leading-tight">{i.title}</h3>
          {i.subtitle && (
            <p className="mt-1 text-sm text-[var(--text-muted)]">{i.subtitle}</p>
          )}
        </div>

        {i.recommendation && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--neutral-soft-bg)] border border-[var(--ring)]">
            <Lightbulb className="h-4 w-4 text-[var(--accent)] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[var(--text)] leading-relaxed">{i.recommendation}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <Button 
          onClick={() => onSimulate(i.id)} 
          className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white px-3 py-2 text-sm"
        >
          <Play className="h-3 w-3" />
          {t("common.simulate")}
        </Button>
        <Button 
          onClick={() => onExport(i.id)} 
          variant="secondary"
          className="flex items-center gap-2 px-3 py-2 text-sm"
        >
          <Download className="h-3 w-3" />
          {t("common.export")}
        </Button>
      </div>
    </div>
  );
}


