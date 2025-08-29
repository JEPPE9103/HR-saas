"use client";

import { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ChevronDown } from "lucide-react";

interface PayGapTrendProps {
  data: Array<{ m: string; gap: number; bench: number }>;
}

export default function PayGapTrend({ data }: PayGapTrendProps) {
  const [viewMode, setViewMode] = useState<"company" | "department" | "country">("company");
  const currentGap = data[data.length - 1]?.gap || 0;

  return (
    <div className="p-6 rounded-xl shadow-md border border-[var(--ring)] bg-[var(--card)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)]">Pay Gap over time vs EU target</h3>
          <p className="text-sm text-[var(--text-muted)]">Monthly trend analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              className="appearance-none rounded-lg border px-4 py-2 pr-8 text-sm border-[var(--ring)] bg-[var(--panel)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="company">Company</option>
              <option value="department">By Department</option>
              <option value="country">By Country</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[var(--accent-soft-bg)] text-[var(--accent-soft-fg)] ring-1 ring-[var(--accent-soft-ring)]">
            <span className="text-xs font-medium">Current</span>
            <span className="text-sm font-bold">{currentGap.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid vertical={false} stroke="var(--ring)" strokeDasharray="3 3" />
            <XAxis 
              dataKey="m" 
              tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
              axisLine={{ stroke: 'var(--ring)' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
              axisLine={{ stroke: 'var(--ring)' }}
              tickLine={{ stroke: 'var(--ring)' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--ring)',
                borderRadius: '8px',
                color: 'var(--text)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="gap" 
              stroke="var(--accent)" 
              strokeWidth={3} 
              dot={{ fill: 'var(--accent)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--accent)', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="bench" 
              stroke="var(--success)" 
              strokeWidth={2} 
              strokeDasharray="4 4" 
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
