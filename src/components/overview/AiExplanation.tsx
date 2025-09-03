"use client";

import { useState } from "react";
import { useI18n } from "@/providers/I18nProvider";
import { Brain, Loader2 } from "lucide-react";

interface AiExplanationProps {
  gapTotal: number;
  topDepts: any[];
  pctUnderOverP50: number;
  trend: any[];
}

export default function AiExplanation({ gapTotal, topDepts, pctUnderOverP50, trend }: AiExplanationProps) {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async () => {
    setIsLoading(true);
    setError(null);
    setExplanation([]);
    
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-tenant-id': 'demo' // In production, get from auth context
        },
        body: JSON.stringify({ gapTotal, topDepts, pctUnderOverP50, trend })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'AI-förklaring misslyckades');
      }
      
      const data = await response.json();
      setExplanation(data.bullets || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ett fel uppstod');
      // Fallback explanation on error
      setExplanation([
        `Genomsnittlig lönegap på ${gapTotal.toFixed(1)}% visar en förbättring från föregående månad.`,
        `Topp 3 avdelningar med störst gap: ${topDepts.slice(0, 3).map(d => d.department).join(', ')}.`,
        `${pctUnderOverP50}% av anställda tjänar under medianlönen, vilket indikerar behov av lönejusteringar.`
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-light text-slate-800">{t('overview.ai.title')}</h3>
          <p className="text-sm text-slate-600 mt-1">AI analyserar era data och ger handlingsbara insikter</p>
        </div>
        <button
          onClick={handleExplain}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 px-4 py-2 text-sm text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          {isLoading ? 'Analyserar...' : t('overview.ai.explain')}
        </button>
      </div>
      
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 mb-6">
          <p className="text-sm text-rose-700 font-medium">{error}</p>
        </div>
      )}
      
      {explanation.length > 0 && (
        <div className="space-y-3">
          {explanation.map((bullet, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
              <p className="text-sm text-slate-700 leading-relaxed font-light">{bullet}</p>
            </div>
          ))}
        </div>
      )}
      
      {explanation.length === 0 && !isLoading && !error && (
        <div className="text-center py-8">
          <Brain className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-light">{t('overview.ai.placeholder')}</p>
        </div>
      )}
    </div>
  );
}
