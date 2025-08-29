"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Area, AreaChart } from "recharts";
import { useMemo } from "react";
import { useI18n } from "@/providers/I18nProvider";

export default function EnterpriseHeroChart() {
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
    <div className="h-full p-6 bg-[var(--card)] rounded-2xl shadow-sm border border-[var(--ring)]">
      {/* Chart Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-[var(--text)]">{t("hero.chart.title")}</h3>
          <div className={`text-sm font-medium ${
            yoyDelta > 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'
          }`}>
            {t("hero.chart.yoyDelta")}
          </div>
        </div>
        <p className="text-sm text-[var(--text-muted)]">{t("hero.chart.subtitle")}</p>
      </div>

      {/* Current value badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[var(--accent-soft-bg)] text-[var(--accent-soft-fg)] ring-1 ring-[var(--accent-soft-ring)]">
          <span className="text-xs font-medium">{t("hero.chart.today")}</span>
          <span className="text-sm font-bold">{currentGap.toFixed(1)}%</span>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
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
                borderRadius: '12px',
                color: 'var(--text)',
                boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }}
              formatter={(value: any) => [`${value}%`, 'Pay Gap']}
              labelFormatter={(label) => `${label} 2027`}
            />
            <Area 
              type="monotone" 
              dataKey="gap" 
              stroke="var(--accent)" 
              fill="url(#colorGap)"
              strokeWidth={3}
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
                value: t("hero.chart.euTarget"), 
                fill: "var(--text-muted)", 
                position: "insideTopRight", 
                fontSize: 11 
              }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
