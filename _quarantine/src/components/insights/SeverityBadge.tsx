"use client";

import { useI18n } from "@/providers/I18nProvider";

export default function SeverityBadge({ level }: { level: "High"|"Medium"|"Low" }) {
  const { t } = useI18n();
  const map: any = {
    High:   "bg-[var(--danger-soft-bg)] text-[var(--danger-soft-fg)] ring-[var(--danger-soft-ring)]",
    Medium: "bg-[var(--warning-soft-bg)] text-[var(--warning-soft-fg)] ring-[var(--warning-soft-ring)]",
    Low:    "bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-[var(--success-soft-ring)]",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs ring-1 ${map[level]}`}>{t(`severity.${level}`)}</span>;
}


