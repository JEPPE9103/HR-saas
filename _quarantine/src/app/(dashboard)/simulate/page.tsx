"use client";

import { useI18n } from "@/providers/I18nProvider";

export default function SimulatePage() {
  const { t } = useI18n();

  return (
    <div className="px-6 lg:px-10 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] mb-4">
          Simulate (Moved to Quarantine)
        </h1>
        <p className="text-[var(--text-muted)]">
          This page has been moved to quarantine. Please use the Overview page instead.
        </p>
        <a 
          href="/overview" 
          className="mt-4 inline-block rounded-lg bg-[var(--accent)] px-4 py-2 text-white hover:bg-[var(--accent-strong)]"
        >
          Go to Overview
        </a>
      </div>
    </div>
  );
}


