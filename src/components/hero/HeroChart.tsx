"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { useMemo } from "react";
import { useI18n } from "@/providers/I18nProvider";

export default function HeroChart(){
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

  return (
    <div className="relative h-72 w-full overflow-hidden md:h-96 p-3 md:min-w-[520px] bg-[var(--panel)] rounded-2xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid vertical={false} stroke="var(--ring)" strokeOpacity={0.6} />
          <XAxis dataKey="m" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
          <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="gap" stroke="var(--accent)" strokeWidth={3} dot={false} isAnimationActive />
          <ReferenceLine y={2} stroke="var(--success)" strokeDasharray="3 3" label={{ value: t('home.chart.goal'), fill: "var(--success)", position: "insideTopRight", fontSize: 12 }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs text-[var(--text-muted)]">{t('dashboard.trend')}</div>
    </div>
  );
}


