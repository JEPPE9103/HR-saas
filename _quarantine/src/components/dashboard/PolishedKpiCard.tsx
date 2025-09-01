"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Scale, Users, MapPin, UserCheck } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";

interface PolishedKpiCardProps {
  label: string;
  value: number;
  delta: number;
  suffix: string;
  icon: "scale" | "users" | "mapPin" | "userCheck";
  isHighlighted?: boolean;
  sparklineData?: Array<{ value: number }>;
}

const icons = {
  scale: Scale,
  users: Users,
  mapPin: MapPin,
  userCheck: UserCheck,
};

export default function PolishedKpiCard({ 
  label, 
  value, 
  delta, 
  suffix, 
  icon, 
  isHighlighted = false,
  sparklineData 
}: PolishedKpiCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const IconComponent = icons[icon];

  // Generate sparkline data if not provided
  const sparkline = sparklineData || Array.from({ length: 8 }, (_, i) => ({
    value: value + (Math.random() - 0.5) * 2
  }));

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-[var(--ring)] bg-[var(--card)] ${
      isHighlighted ? 'ring-2 ring-[var(--accent)] bg-gradient-to-br from-[var(--accent-soft-bg)] to-[var(--card)] scale-105' : ''
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isHighlighted ? 'bg-[var(--accent)] text-white' : 'bg-[var(--neutral-soft-bg)] text-[var(--text-muted)]'
          }`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="text-sm font-medium text-[var(--text-muted)]">{label}</div>
        </div>
        <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
          delta >= 0 
            ? "bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-1 ring-[var(--success-soft-ring)]" 
            : "bg-[var(--danger-soft-bg)] text-[var(--danger-soft-fg)] ring-1 ring-[var(--danger-soft-ring)]"
        }`}>
          {delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {delta >= 0 ? "+" : ""}{delta}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div className={`text-3xl font-bold text-[var(--text)] ${
          isHighlighted ? 'text-[var(--accent)]' : ''
        }`}>
          {displayValue}{suffix}
        </div>
        
        {/* Sparkline for non-employee cards */}
        {icon !== "userCheck" && (
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
        )}
      </div>
    </div>
  );
}
