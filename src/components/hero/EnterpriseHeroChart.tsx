"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Area, AreaChart } from "recharts";
import { useMemo } from "react";
import { TrendingDown } from "lucide-react";
import { useI18n } from "@/providers/I18nProvider";

export default function EnterpriseHeroChart() {
  const { t } = useI18n();
  
  const data = useMemo(() => (
    [
      { m: "Aug", gap: 6.2, bench: 2.0 },
      { m: "Sep", gap: 5.9, bench: 2.0 },
      { m: "Oct", gap: 5.7, bench: 2.0 },
      { m: "Nov", gap: 5.4, bench: 2.0 },
      { m: "Dec", gap: 5.2, bench: 2.0 },
      { m: "Jan", gap: 5.1, bench: 2.0 },
      { m: "Feb", gap: 5.0, bench: 2.0 },
      { m: "Mar", gap: 5.3, bench: 2.0 },
      { m: "Apr", gap: 5.4, bench: 2.0 },
      { m: "May", gap: 5.5, bench: 2.0 },
      { m: "Jun", gap: 5.6, bench: 2.0 },
      { m: "Jul", gap: 5.6, bench: 2.0 },
    ]
  ), []);

  const currentGap = data[data.length - 1]?.gap || 0;
  const lastYearGap = 6.4; // Mock data for comparison
  const improvement = lastYearGap - currentGap;

  return (
    <div className="h-full p-6 bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--ring)]">
      {/* Chart Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[var(--text)] mb-1">{t("home.chart.title")}</h3>
        <p className="text-sm text-[var(--text-muted)] mb-3">{t("home.chart.subtitle")}</p>
        
        {/* Improvement indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-1 ring-[var(--success-soft-ring)]">
            <TrendingDown className="h-3 w-3" />
            {improvement.toFixed(1)}% {t("home.chart.sinceLastYear")}
          </div>
        </div>
      </div>

      {/* Current value badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[var(--accent-soft-bg)] text-[var(--accent-soft-fg)] ring-1 ring-[var(--accent-soft-ring)]">
          <span className="text-xs font-medium">{t("home.chart.today")}</span>
          <span className="text-sm font-bold">{currentGap.toFixed(1)}%</span>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid vertical={false} stroke="var(--ring)" strokeOpacity={0.2} strokeDasharray="3 3" />
            <XAxis 
              dataKey="m" 
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
              formatter={(value: any, name: any) => [`${value}%`, name === 'gap' ? 'Pay Gap' : 'EU Target']}
              labelFormatter={(label) => `${label} 2027`}
            />
            <Line 
              type="monotone" 
              dataKey="gap" 
              stroke="var(--accent)" 
              strokeWidth={3} 
              dot={{ fill: 'var(--accent)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--accent)', strokeWidth: 2 }}
              name="gap"
            />
            <ReferenceLine 
              y={2} 
              stroke="var(--text-muted)" 
              strokeDasharray="4 4" 
              strokeOpacity={0.6}
              label={{ 
                value: t("home.chart.euTarget"), 
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
