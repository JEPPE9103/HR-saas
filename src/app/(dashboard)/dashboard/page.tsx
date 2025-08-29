"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SimulationDrawer } from "@/components/SimulationDrawer";
import SimulationStickyBar from "@/components/SimulationStickyBar";
import SimulationResultPanel from "@/components/SimulationResultPanel";
import { CopilotPanel } from "@/components/copilot/CopilotPanel";
import { useI18n } from "@/providers/I18nProvider";
import ExecutiveKpiCard from "@/components/dashboard/ExecutiveKpiCard";
import ExecutivePayGapTrend from "@/components/dashboard/ExecutivePayGapTrend";
import ExecutiveRiskPanel from "@/components/dashboard/ExecutiveRiskPanel";
import ExecutiveInsightsFeed from "@/components/dashboard/ExecutiveInsightsFeed";
import ExecutiveSuggestedActions from "@/components/dashboard/ExecutiveSuggestedActions";
import { Upload, FileDown, RotateCcw } from "lucide-react";

const DATASETS = ["demo-se", "demo-no", "demo-dk", "demo-fi"];

export default function DashboardPage() {
  const { t } = useI18n();
  const sp = useSearchParams();
  const router = useRouter();
  const datasetId = sp.get("datasetId") || "demo-se";
  const [computedAt, setComputedAt] = useState<string>("23 Aug 2026");

  return (
    <div className="px-6 lg:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">{t("dashboard.title")}</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {t("dashboard.lastComputed")} {computedAt}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={datasetId} 
            onChange={(e) => router.push(`/dashboard?datasetId=${e.target.value}`)}
            className="rounded-lg border border-[var(--ring)] px-3 py-2 text-sm bg-[var(--panel)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {DATASETS.map(ds => (
              <option key={ds} value={ds}>{ds}</option>
            ))}
          </select>
          
          <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-[var(--neutral-soft-bg)] border-[var(--ring)] text-[var(--text)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
            <Upload className="h-4 w-4" /> {t("dashboard.uploadData")}
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ExecutiveKpiCard 
          title={t("dashboard.kpi.gap")}
          value="5.6%"
          icon="trending"
          isHighlighted={true}
          yoyDelta={-0.8}
        />
        <ExecutiveKpiCard 
          title={t("dashboard.kpi.highVarianceRoles")}
          value="3"
          icon="users"
          yoyDelta={-1}
        />
        <ExecutiveKpiCard 
          title={t("dashboard.kpi.riskSites")}
          value="2"
          icon="shield"
          yoyDelta={-2}
        />
        <ExecutiveKpiCard 
          title={t("dashboard.kpi.employees")}
          value="1,247"
          icon="people"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ExecutivePayGapTrend />
        </div>
        <div>
          <ExecutiveRiskPanel />
        </div>
      </div>

      {/* Insights & Actions Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ExecutiveInsightsFeed />
        </div>
        <div>
          <ExecutiveSuggestedActions />
        </div>
      </div>

      {/* Simulation Components */}
      <SimulationDrawer />
      <SimulationStickyBar />
      <SimulationResultPanel />
      <CopilotPanel datasetId={datasetId} />
    </div>
  );
}
