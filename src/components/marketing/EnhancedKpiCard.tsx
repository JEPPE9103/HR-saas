"use client";

import { ReactNode, useEffect, useState } from "react";

type Tone = "neutral" | "success" | "warning" | "danger";

interface EnhancedKpiCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  tone?: Tone;
  isHighlighted?: boolean;
}

export function EnhancedKpiCard({ title, value, icon, tone = "neutral", isHighlighted = false }: EnhancedKpiCardProps) {
  const [displayValue, setDisplayValue] = useState("0");
  
  const toneRing: Record<Tone, string> = {
    neutral: "ring-[var(--ring)]",
    success: "ring-[var(--success-soft-ring)]",
    warning: "ring-[var(--warning-soft-ring)]",
    danger: "ring-[var(--danger-soft-ring)]",
  };
  
  const toneBg: Record<Tone, string> = {
    neutral: "bg-[var(--panel)]",
    success: "bg-[var(--success-soft-bg)]/20",
    warning: "bg-[var(--warning-soft-bg)]/20",
    danger: "bg-[var(--danger-soft-bg)]/20",
  };
  
  const iconBg: Record<Tone, string> = {
    neutral: "bg-[var(--neutral-soft-bg)]",
    success: "bg-[var(--success-soft-bg)]",
    warning: "bg-[var(--warning-soft-bg)]",
    danger: "bg-[var(--danger-soft-bg)]",
  };

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
    <div className={`rounded-xl border p-4 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-[var(--ring)] ${toneBg[tone]} ${
      isHighlighted ? 'ring-2 ring-[var(--accent)] bg-gradient-to-br from-[var(--accent-soft-bg)] to-[var(--panel)]' : ''
    }`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`h-8 w-8 rounded-lg ${iconBg[tone]} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="text-xs font-medium text-[var(--text-muted)]">{title}</div>
      </div>
      <div className={`text-2xl font-bold text-[var(--text)] tracking-tight ${
        isHighlighted ? 'text-[var(--accent)]' : ''
      }`}>
        {displayValue}
      </div>
    </div>
  );
}
