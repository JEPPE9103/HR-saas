"use client";

import { useEffect, useState } from "react";
import { Percent, ShieldAlert, Clock } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";
import { useI18n } from "@/providers/I18nProvider";

interface EnterpriseKpiCardProps {
  title: string;
  value: string;
  icon: "trending" | "shield" | "clock";
  isHighlighted?: boolean;
  yoyDelta?: number;
  sparklineData?: Array<{ value: number }>;
}

const icons = {
  trending: Percent,
  shield: ShieldAlert,
  clock: Clock,
};

export default function EnterpriseKpiCard({ 
  title, 
  value, 
  icon, 
  isHighlighted = false,
  yoyDelta,
  sparklineData 
}: EnterpriseKpiCardProps) {
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
    <div className={`p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] border border-[var(--ring)] bg-[var(--card)] group ${
      isHighlighted ? 'ring-1 ring-[var(--accent)]' : ''
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-1 rounded-full transition-colors ${
          isHighlighted ? 'bg-[var(--accent)] text-white' : 'bg-[var(--accent-soft-bg)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white'
        }`}>
          <IconComponent className="h-5 w-5" />
        </div>
        <div className="text-xs font-medium text-[var(--text-muted)]">{title}</div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <div className={`font-bold text-[var(--text)] ${
            isHighlighted ? 'text-2xl' : 'text-xl'
          }`}>
            {displayValue}
          </div>
          
          {/* Sparkline */}
          <div className="w-12 h-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkline}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isHighlighted ? "var(--accent)" : "var(--text-muted)"} 
                  strokeWidth={1.5} 
                  dot={false}
                  strokeOpacity={0.6}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* YoY Delta */}
        {yoyDelta !== undefined && (
          <div className={`text-xs font-medium ${
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
