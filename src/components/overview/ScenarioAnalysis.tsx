"use client";

import { useState } from "react";
import { useI18n } from "@/providers/I18nProvider";
import { Brain, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface ScenarioAnalysisProps {
  currentGap: number;
  employees: any[];
}

interface ScenarioResult {
  newGapPct: number;
  costEstimate: number;
  bullets: string[];
}

export default function ScenarioAnalysis({ currentGap, employees }: ScenarioAnalysisProps) {
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scenario, setScenario] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!scenario.trim()) {
      setError("Beskriv ditt scenario först");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scenario', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-tenant-id': 'demo' // In production, get from auth context
        },
        body: JSON.stringify({
          currentGap,
          scenario: scenario.trim(),
          employees: employees.length,
          budget: budget ? parseInt(budget) : undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Scenario-analys misslyckades');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ett fel uppstod');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <Brain className="h-5 w-5 text-coral-600" />
          <h3 className="text-lg font-light text-slate-800">{t('overview.scenario.title')}</h3>
          <span className="text-xs bg-gradient-to-r from-coral-500 to-rose-500 text-white px-3 py-1 rounded-full font-medium">Beta</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-slate-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-6">
          <p className="text-sm text-slate-600 font-light leading-relaxed">
            {t('overview.scenario.description')}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-3">
                {t('overview.scenario.scenario')}
              </label>
              <textarea
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder={t('overview.scenario.placeholder')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 bg-white/50 resize-none focus:border-coral-300 focus:ring-2 focus:ring-coral-100 transition-all duration-200"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-3">
                {t('overview.scenario.budget')} {t('overview.scenario.optional')}
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="500000"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 bg-white/50 focus:border-coral-300 focus:ring-2 focus:ring-coral-100 transition-all duration-200"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !scenario.trim()}
              className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-coral-600 to-rose-600 hover:from-coral-700 hover:to-rose-700 px-6 py-3 text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              {isLoading ? t('overview.scenario.analyzing') : t('overview.scenario.analyze')}
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm text-rose-700 font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div className="rounded-xl border border-slate-200 bg-white/50 p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 font-light mb-2">{t('overview.scenario.newGap')}</p>
                  <p className="text-2xl font-light text-slate-800">{result.newGapPct.toFixed(1)}%</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 font-light mb-2">{t('overview.scenario.costEstimate')}</p>
                  <p className="text-2xl font-light text-slate-800">
                    {result.costEstimate.toLocaleString('sv-SE')} {t('common.currency')}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800 mb-4">{t('overview.scenario.analysis')}</p>
                <div className="space-y-3">
                  {result.bullets.map((bullet, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-coral-500 mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-slate-700 leading-relaxed font-light">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
