"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";

interface PolishedPayGapTrendProps {
  data: Array<{ m: string; gap: number; bench: number }>;
}

export default function PolishedPayGapTrend({ data }: PolishedPayGapTrendProps) {
  const currentGap = data[data.length - 1]?.gap || 0;

  return (
    <div className="p-6 rounded-xl shadow-lg border border-[var(--ring)] bg-[var(--card)]">
      {/* Title and current value badge */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-[var(--text)]">Pay Gap over time vs EU target</h3>
          <p className="text-sm text-[var(--text-muted)]">Monthly trend analysis</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[var(--accent-soft-bg)] text-[var(--accent-soft-fg)] ring-1 ring-[var(--accent-soft-ring)]">
          <span className="text-xs font-medium">Today</span>
          <span className="text-sm font-bold">{currentGap.toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="h-80">
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
              labelFormatter={(label) => `${label} 2024`}
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
                value: "EU Target (2%)", 
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
