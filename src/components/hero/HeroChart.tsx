"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from "recharts";
import { useMemo } from "react";

export default function HeroChart(){
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

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-2xl ring-1 ring-white/10 md:h-96 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid vertical={false} stroke="#334155" strokeOpacity={0.3} />
          <XAxis dataKey="m" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="gap" stroke="#2563EB" strokeWidth={3} dot={false} isAnimationActive />
        </LineChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs text-slate-300">Gender Pay Gap Trend</div>
    </div>
  );
}


