"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, CartesianGrid } from 'recharts';
import { EU_TARGET_GAP_PCT } from '@/lib/mockData';

type Point = { month: string; gap: number };

export function PayGapTrend({ data }: { data: Point[] }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
          <YAxis unit="%" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
          <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
          <ReferenceLine y={EU_TARGET_GAP_PCT} strokeDasharray="4 4" stroke="#94a3b8" label={{ value: 'EU target 3%', position: 'insideTopRight', fill: '#64748b' }} />
          <Line type="monotone" dataKey="gap" stroke="var(--brand-primary)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


