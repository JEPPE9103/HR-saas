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
    <div className="group relative overflow-hidden h-full bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-200/50 p-8 hover:border-slate-300/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-purple-300/10 rounded-full blur-2xl" />
      
      {/* Chart Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-light text-slate-800 tracking-tight">{t("hero.chart.title")}</h3>
          <div className={`text-sm font-medium px-3 py-1 rounded-full ${
            yoyDelta > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {yoyDelta > 0 ? '+' : ''}{yoyDelta.toFixed(1)} pp since last year
          </div>
        </div>
        <p className="text-slate-600 font-light leading-relaxed">{t("hero.chart.subtitle")}</p>
      </div>

      {/* Current value badge */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="inline-flex items-center gap-3 rounded-2xl px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 ring-1 ring-indigo-200/50">
          <span className="text-sm font-medium">{t("hero.chart.today")}</span>
          <span className="text-lg font-light">{currentGap.toFixed(1)}%</span>
        </div>
      </div>
      
      {/* Chart */}
      <div className="relative z-10 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeOpacity={0.4} strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0', strokeOpacity: 0.6 }}
              tickLine={{ stroke: '#e2e8f0', strokeOpacity: 0.6 }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0', strokeOpacity: 0.6 }}
              tickLine={{ stroke: '#e2e8f0', strokeOpacity: 0.6 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                color: '#334155',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                fontSize: '12px',
                padding: '12px 16px'
              }}
              formatter={(value: any) => [`${value}%`, 'Pay Gap']}
              labelFormatter={(label) => `${label} 2027`}
            />
            <Area 
              type="monotone" 
              dataKey="gap" 
              stroke="#6366f1" 
              fill="url(#colorGap)"
              strokeWidth={3}
            />
            <Line 
              type="monotone" 
              dataKey="gap" 
              stroke="#6366f1" 
              strokeWidth={3} 
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }}
            />
            <ReferenceLine 
              y={2} 
              stroke="#94a3b8" 
              strokeDasharray="4 4" 
              strokeOpacity={0.8}
              label={{ 
                value: t("hero.chart.euTarget"), 
                fill: "#64748b", 
                position: "insideTopRight", 
                fontSize: 11,
                fontWeight: 500
              }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
