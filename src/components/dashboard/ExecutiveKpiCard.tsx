"use client";

import { useEffect, useState } from "react";
import { TrendingDown, Users, ShieldAlert, UserCheck } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";
import { useI18n } from "@/providers/I18nProvider";

interface ExecutiveKpiCardProps {
  title: string;
  value: string;
  icon: "trending" | "users" | "shield" | "people";
  isHighlighted?: boolean;
  yoyDelta?: number;
  sparklineData?: Array<{ value: number }>;
}

const icons = {
  trending: TrendingDown,
  users: Users,
  shield: ShieldAlert,
  people: UserCheck,
};

export default function ExecutiveKpiCard({ 
  title, 
  value, 
  icon, 
  isHighlighted = false,
  yoyDelta,
  sparklineData 
}: ExecutiveKpiCardProps) {
  const { t } = useI18n();
  const [displayValue, setDisplayValue] = useState("0");
  const IconComponent = icons[icon];

  // Generate sparkline data if not provided
  const sparkline = sparklineData || Array.from({ length: 8 }, (_, i) => ({
    value: parseFloat(value.replace(/[^0-9.]/g, '')) + (Math.random() - 0.5) * 2
  }));

  // Animate counting for numeric values
  useEffect(() => {
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    const duration = 1000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        const suffix = value.replace(/[0-9.]/g, '');
        setDisplayValue(current.toFixed(1) + suffix);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={`p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border border-[var(--ring)] bg-[var(--card)] ${
      isHighlighted ? 'ring-1 ring-[var(--accent)]' : ''
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-lg ${
          isHighlighted ? 'bg-[var(--accent)] text-white' : 'bg-[var(--neutral-soft-bg)] text-[var(--text-muted)]'
        }`}>
          <IconComponent className="h-5 w-5" />
        </div>
        <div className="text-sm font-medium text-[var(--text-muted)]">{title}</div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div className={`text-3xl font-bold text-[var(--text)] ${
            isHighlighted ? 'text-[var(--accent)]' : ''
          }`}>
            {displayValue}
          </div>
          
          {/* Sparkline */}
          <div className="w-16 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkline}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isHighlighted ? "var(--accent)" : "var(--text-muted)"} 
                  strokeWidth={2} 
                  dot={false}
                  strokeOpacity={0.6}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* YoY Delta */}
        {yoyDelta !== undefined && (
          <div className={`text-sm font-medium ${
            yoyDelta > 0 
              ? 'text-[var(--success)]' 
              : yoyDelta < 0 
                ? 'text-[var(--danger)]' 
                : 'text-[var(--text-muted)]'
          }`}>
            {yoyDelta > 0 ? '+' : ''}{yoyDelta.toFixed(1)} {t("common.pp")} {t("common.yoy")}
          </div>
        )}
      </div>
    </div>
  );
}
