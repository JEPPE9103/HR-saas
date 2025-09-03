"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useI18n } from "@/providers/I18nProvider";

interface GapTrendData {
  month: string;
  gap_pct: number | string;
}

interface GapTrendChartProps {
  data: GapTrendData[];
}

export default function GapTrendChart({ data }: GapTrendChartProps) {
  const { t } = useI18n();

  const formatMonth = (month: string) => {
    const date = new Date(month);
    return date.toLocaleDateString('sv-SE', { month: 'short', year: '2-digit' });
  };

  const formatGap = (value: any) => {
    if (typeof value === 'number' && !isNaN(value)) {
      return `${value.toFixed(1)}%`;
    }
    // Handle cases where value might be a string or invalid
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return `${numValue.toFixed(1)}%`;
    }
    return '0.0%';
  };

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ring)" />
          <XAxis 
            dataKey="month" 
            tickFormatter={formatMonth}
            stroke="var(--text-muted)"
            fontSize={12}
          />
          <YAxis 
            tickFormatter={formatGap}
            stroke="var(--text-muted)"
            fontSize={12}
          />
          <Tooltip 
            formatter={(value: number) => [formatGap(value), t('overview.trend.gapPercentage')]}
            labelFormatter={formatMonth}
            contentStyle={{
              backgroundColor: 'var(--panel)',
              border: '1px solid var(--ring)',
              borderRadius: '8px',
              color: 'var(--text)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="gap_pct" 
            stroke="var(--accent)" 
            strokeWidth={2}
            dot={{ fill: 'var(--accent)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'var(--accent)', strokeWidth: 2 }}
          />
          {/* EU Target line */}
          <Line 
            type="monotone" 
            dataKey="eu_target" 
            stroke="var(--text-muted)" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="EU Target"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
