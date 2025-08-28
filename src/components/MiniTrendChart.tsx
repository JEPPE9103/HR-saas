"use client";

import { ResponsiveContainer, LineChart, Line, Area, Tooltip } from "recharts";

const demo = [
  { m: "Jan", v: 8.9 },
  { m: "Feb", v: 8.2 },
  { m: "Mar", v: 7.6 },
  { m: "Apr", v: 7.2 },
  { m: "May", v: 7.0 },
  { m: "Jun", v: 6.7 },
];

export function MiniTrendChart(){
  const last = demo[demo.length - 1]?.v ?? 0;
  const prev = demo[demo.length - 2]?.v ?? last;
  const delta = last - prev;
  const deltaText = `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}pp`;
  const badgeClass = delta < 0
    ? "bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-[var(--success-soft-ring)]"
    : "bg-[var(--danger-soft-bg)] text-[var(--danger-soft-fg)] ring-[var(--danger-soft-ring)]";

  return (
    <div className="relative h-28 w-full rounded-xl bg-transparent">
      <div className={`absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${badgeClass}`}>
        {last.toFixed(1)}% ({deltaText})
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={demo} margin={{ top: 14, right: 8, bottom: 6, left: 8 }} style={{ background: "transparent" }}>
          <defs>
            <linearGradient id="miniTrend" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip formatter={(v:number)=>`${v.toFixed(1)}%`} labelFormatter={(l)=>l as string} cursor={{ stroke: "#94a3b8", strokeDasharray: 3 }} />
          <Area type="monotone" dataKey="v" stroke="none" fill="url(#miniTrend)" />
          <Line type="monotone" dataKey="v" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


