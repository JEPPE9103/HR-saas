"use client";

import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { BarChart3, List } from "lucide-react";
import { useI18n } from "@/providers/I18nProvider";

const data = [
  { dept: "Stockholm • Sales", gap: 9.2, severity: "high" },
  { dept: "Uppsala • Ops", gap: 8.7, severity: "high" },
  { dept: "Uppsala • Engineer", gap: 8.1, severity: "high" },
  { dept: "Stockholm • Ops", gap: 7.9, severity: "high" },
  { dept: "Malmö • Sales", gap: 7.3, severity: "high" },
  { dept: "Västerås • Ops", gap: 6.8, severity: "medium" },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high": return "var(--danger)";
    case "medium": return "var(--warning)";
    case "low": return "var(--caution)";
    default: return "var(--text-muted)";
  }
};

const getSeverityPillColor = (severity: string) => {
  switch (severity) {
    case "high": return "bg-[var(--danger-soft-bg)] text-[var(--danger-soft-fg)] ring-[var(--danger-soft-ring)]";
    case "medium": return "bg-[var(--warning-soft-bg)] text-[var(--warning-soft-fg)] ring-[var(--warning-soft-ring)]";
    case "low": return "bg-[var(--caution-soft-bg)] text-[var(--caution-soft-fg)] ring-[var(--caution-soft-ring)]";
    default: return "bg-[var(--neutral-soft-bg)] text-[var(--neutral-soft-fg)] ring-[var(--neutral-soft-ring)]";
  }
};

export default function ExecutiveRiskPanel() {
  const { t } = useI18n();
  const [mode, setMode] = useState<'bars' | 'list'>('bars');

  return (
    <div className="h-full p-6 bg-[var(--card)] rounded-2xl shadow-md border border-[var(--ring)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)]">{t("dashboard.riskPanel.title")}</h3>
          <p className="text-sm text-[var(--text-muted)]">{t("dashboard.riskPanel.subtitle")}</p>
        </div>
        
        {/* Toggle */}
        <div className="flex items-center gap-1 rounded-full border border-[var(--ring)] p-1 bg-[var(--panel)]">
          <button
            onClick={() => setMode('bars')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              mode === 'bars' 
                ? 'bg-[var(--accent)] text-white shadow-sm' 
                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--neutral-soft-bg)]'
            }`}
          >
            <BarChart3 className="h-3 w-3" />
          </button>
          <button
            onClick={() => setMode('list')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              mode === 'list' 
                ? 'bg-[var(--accent)] text-white shadow-sm' 
                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--neutral-soft-bg)]'
            }`}
          >
            <List className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      {mode === 'bars' ? (
        <div className="h-64 overflow-y-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 40, left: 0, bottom: 0 }}
              barGap={12}
            >
              <CartesianGrid 
                horizontal 
                stroke="var(--ring)" 
                strokeOpacity={0.2} 
                strokeDasharray="3 3" 
              />
              <XAxis 
                dataKey="dept" 
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
                tickLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
                textAnchor="start"
                angle={0}
                dx={0}
                dy={8}
              />
              <YAxis 
                domain={[0, 12]}
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
                tickLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--ring)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any) => [`${value}%`, t("common.gap")]}
                labelFormatter={(label) => label}
              />
              <Bar 
                dataKey="gap" 
                fill="var(--accent)" 
                radius={[2, 2, 0, 0]}
                barSize={6}
                className="hover:opacity-80 transition-opacity"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getSeverityColor(entry.severity)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Value labels */}
          <div className="flex justify-between mt-3 px-1">
            {data.map((item, index) => (
              <div key={index} className="text-xs font-medium text-[var(--text)] text-center" style={{ width: '16.66%' }}>
                {item.gap}%
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-64 overflow-y-auto space-y-2">
          {data.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg border border-[var(--ring)] bg-[var(--panel)] hover:bg-[var(--neutral-soft-bg)] transition-colors duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-sm font-medium text-[var(--text-muted)] w-6 text-center">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--text)] text-sm truncate">
                    {item.dept}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ${getSeverityPillColor(item.severity)}`}>
                  {t(`common.${item.severity}`)}
                </span>
                <span className="text-sm font-semibold text-[var(--text)]">
                  {item.gap}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Cell component for Bar chart
const Cell = ({ fill }: { fill: string }) => <rect fill={fill} />;
