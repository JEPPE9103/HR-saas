"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { useMemo } from "react";
import { useI18n } from "@/providers/I18nProvider";

export default function ExecutivePayGapTrend() {
  const { t } = useI18n();
  
  const data = useMemo(() => (
    [
      { month: "Aug", gap: 6.2 },
      { month: "Sep", gap: 5.9 },
      { month: "Oct", gap: 5.7 },
      { month: "Nov", gap: 5.4 },
      { month: "Dec", gap: 5.2 },
      { month: "Jan", gap: 5.1 },
      { month: "Feb", gap: 5.0 },
      { month: "Mar", gap: 5.3 },
      { month: "Apr", gap: 5.4 },
      { month: "May", gap: 5.5 },
      { month: "Jun", gap: 5.6 },
      { month: "Jul", gap: 5.6 },
    ]
  ), []);

  const currentGap = data[data.length - 1]?.gap || 0;
  const lastYearGap = 6.4; // Mock data for comparison
  const yoyDelta = lastYearGap - currentGap;

  return (
    <div className="h-full p-6 bg-[var(--card)] rounded-2xl shadow-md border border-[var(--ring)]">
      {/* Chart Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-[var(--text)]">{t("dashboard.trend")}</h3>
          <div className={`text-sm font-medium ${
            yoyDelta > 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'
          }`}>
            {yoyDelta > 0 ? '+' : ''}{yoyDelta.toFixed(1)} {t("common.pp")} {t("common.yoy")}
          </div>
        </div>
        <p className="text-sm text-[var(--text-muted)]">{t("dashboard.trend.subtitle")}</p>
      </div>

      {/* Current value badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[var(--accent-soft-bg)] text-[var(--accent-soft-fg)] ring-1 ring-[var(--accent-soft-ring)]">
          <span className="text-xs font-medium">{t("dashboard.trend.today")}</span>
          <span className="text-sm font-bold">{currentGap.toFixed(1)}%</span>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--ring)" strokeOpacity={0.2} strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
              axisLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
              tickLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
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
              labelFormatter={(label) => `${label} 2027`}
            />
            <Line 
              type="monotone" 
              dataKey="gap" 
              stroke="var(--accent)" 
              strokeWidth={3} 
              dot={{ fill: 'var(--accent)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--accent)', strokeWidth: 2 }}
            />
            <ReferenceLine 
              y={2} 
              stroke="var(--text-muted)" 
              strokeDasharray="4 4" 
              strokeOpacity={0.6}
              label={{ 
                value: t("dashboard.trend.euTarget"), 
                fill: "var(--text-muted)", 
                position: "insideTopRight", 
                fontSize: 12 
              }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
