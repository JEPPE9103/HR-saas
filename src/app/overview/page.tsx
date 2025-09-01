"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useI18n } from "@/providers/I18nProvider";
import { Upload } from "lucide-react";

const DATASETS = ["demo-se", "demo-no", "demo-dk", "demo-fi"];

export default function OverviewPage() {
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
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Översikt</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Senast beräknad: {computedAt}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={datasetId} 
            onChange={(e) => router.push(`/overview?datasetId=${e.target.value}`)}
            className="rounded-lg border border-[var(--ring)] px-3 py-2 text-sm bg-[var(--panel)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {DATASETS.map(ds => (
              <option key={ds} value={ds}>{ds}</option>
            ))}
          </select>
          
          <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-[var(--neutral-soft-bg)] border-[var(--ring)] text-[var(--text)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
            <Upload className="h-4 w-4" /> Ladda upp data
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border p-6 border-[var(--ring)] bg-[var(--card)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Genomsnittlig lönegap</p>
              <p className="text-2xl font-bold text-[var(--text)]">5.6%</p>
            </div>
            <div className="text-green-600 text-sm">-0.8%</div>
          </div>
        </div>
        
        <div className="rounded-xl border p-6 border-[var(--ring)] bg-[var(--card)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Roller med hög varians</p>
              <p className="text-2xl font-bold text-[var(--text)]">3</p>
            </div>
            <div className="text-green-600 text-sm">-1</div>
          </div>
        </div>
        
        <div className="rounded-xl border p-6 border-[var(--ring)] bg-[var(--card)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Riskplatser</p>
              <p className="text-2xl font-bold text-[var(--text)]">2</p>
            </div>
            <div className="text-green-600 text-sm">-2</div>
          </div>
        </div>
        
        <div className="rounded-xl border p-6 border-[var(--ring)] bg-[var(--card)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Anställda</p>
              <p className="text-2xl font-bold text-[var(--text)]">1,247</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border p-6 border-[var(--ring)] bg-[var(--card)]">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Lönegapstrend</h3>
            <div className="h-64 bg-[var(--muted)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Graf kommer här
            </div>
          </div>
        </div>
        <div>
          <div className="rounded-xl border p-6 border-[var(--ring)] bg-[var(--card)]">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Risköversikt</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm text-red-700">Hög risk</span>
                <span className="text-sm font-medium">2 platser</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm text-yellow-700">Medel risk</span>
                <span className="text-sm font-medium">5 platser</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-green-700">Låg risk</span>
                <span className="text-sm font-medium">12 platser</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights & Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border p-6 border-[var(--ring)] bg-[var(--card)]">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Senaste insikter</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">Lönegapet har minskat med 0.8% sedan förra månaden</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">3 nya roller har normaliserats</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">2 platser kräver uppföljning</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="rounded-xl border p-6 border-[var(--ring)] bg-[var(--card)]">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Föreslagna åtgärder</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-[var(--accent)] text-white rounded-lg text-sm">
                Granska riskplatser
              </button>
              <button className="w-full text-left p-3 border border-[var(--ring)] rounded-lg text-sm text-[var(--text)]">
                Exportera rapport
              </button>
              <button className="w-full text-left p-3 border border-[var(--ring)] rounded-lg text-sm text-[var(--text)]">
                Schemalägg uppföljning
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
