"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { useMemo } from "react";
import { useI18n } from "@/providers/I18nProvider";

export default function EnhancedHeroChart() {
  const { t } = useI18n();
  const data = useMemo(() => (
    [
      { m: "Aug", gap: 6.2 },
      { m: "Sep", gap: 5.9 },
      { m: "Oct", gap: 5.7 },
      { m: "Nov", gap: 5.4 },
      { m: "Dec", gap: 5.2 },
      { m: "Jan", gap: 5.1 },
      { m: "Feb", gap: 5.0 },
      { m: "Mar", gap: 5.3 },
      { m: "Apr", gap: 5.4 },
      { m: "May", gap: 5.5 },
      { m: "Jun", gap: 5.6 },
      { m: "Jul", gap: 5.6 },
    ]
  ), []);

  const currentGap = data[data.length - 1]?.gap || 0;

  return (
    <div className="relative h-96 w-full overflow-hidden md:h-[420px] p-6 bg-[var(--card)] rounded-2xl shadow-lg border border-[var(--ring)] hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
      {/* Title and current value badge */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)]">Your pay gap trend vs EU target</h3>
          <p className="text-sm text-[var(--text-muted)]">Monthly analysis</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[var(--accent-soft-bg)] text-[var(--accent-soft-fg)] ring-1 ring-[var(--accent-soft-ring)]">
          <span className="text-xs font-medium">Today</span>
          <span className="text-sm font-bold">{currentGap.toFixed(1)}%</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid vertical={false} stroke="var(--ring)" strokeOpacity={0.3} strokeDasharray="3 3" />
          <XAxis 
            dataKey="m" 
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
            tickLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
          />
          <YAxis 
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
            tickLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--ring)',
              borderRadius: '8px',
              color: 'var(--text)'
            }}
            formatter={(value: any, name: any) => [`${value}%`, 'Pay Gap']}
            labelFormatter={(label) => `${label} 2024`}
          />
          <Line 
            type="monotone" 
            dataKey="gap" 
            stroke="var(--accent)" 
            strokeWidth={3} 
            dot={{ fill: 'var(--accent)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'var(--accent)', strokeWidth: 2 }}
            isAnimationActive 
          />
          <ReferenceLine 
            y={2} 
            stroke="var(--text-muted)" 
            strokeDasharray="4 4" 
            strokeOpacity={0.6}
            label={{ 
              value: "EU Target", 
              fill: "var(--text-muted)", 
              position: "insideTopRight", 
              fontSize: 12 
            }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
