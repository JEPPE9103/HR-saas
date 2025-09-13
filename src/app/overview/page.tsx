"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useI18n } from "@/providers/I18nProvider";
import { Upload, FileText, BarChart3, Bot, Users, Lightbulb } from "lucide-react";
import { PageTitle } from "@/components/ui/PageTitle";
import GapTrendChart from "@/components/overview/GapTrendChart";
import KpiCards from "@/components/overview/KpiCards";
import AiExplanation from "@/components/overview/AiExplanation";
import ScenarioAnalysis from "@/components/overview/ScenarioAnalysis";
import { NormalizedEmployee, calculatePayGapStats } from "@/services/demoData";

export default function OverviewPage() {
  const { t } = useI18n();
  const sp = useSearchParams();
  const router = useRouter();
  const datasetId = sp.get("datasetId") || "demo-se";
  const [computedAt, setComputedAt] = useState<string>("23 Aug 2026");
  
  // Demo data state
  const [employees, setEmployees] = useState<NormalizedEmployee[]>([]);
  const [gapTrend, setGapTrend] = useState<any[]>([]);
  const [compBands, setCompBands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load demo data from localStorage
  useEffect(() => {
    const loadDemoData = () => {
      try {
        const employeesData = localStorage.getItem('employeesDemo');
        const gapTrendData = localStorage.getItem('gapTrendDemo');
        const compBandsData = localStorage.getItem('compBandsDemo');
        
        if (employeesData) {
          setEmployees(JSON.parse(employeesData));
        }
        if (gapTrendData) {
          setGapTrend(JSON.parse(gapTrendData));
        }
        if (compBandsData) {
          setCompBands(JSON.parse(compBandsData));
        }
      } catch (error) {
        console.error('Failed to load demo data:', error);
        // Fallback to empty arrays if localStorage fails
        setEmployees([]);
        setGapTrend([]);
        setCompBands([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDemoData();

    // Lyssna på localStorage-ändringar för att uppdatera data i realtid
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'employeesDemo' || e.key === 'gapTrendDemo') {
        loadDemoData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleUploadData = () => {
    router.push('/import');
  };

  const handleCreateReport = async () => {
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-tenant-id': 'demo' // In production, get from auth context
        },
        body: JSON.stringify({ 
          gapTotal: typeof latestGap === 'number' ? latestGap : 0, 
          topDepts: stats?.topDepartments || [], 
          pctUnderOverP50, 
          trend: gapTrend || [],
          employees
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reportUrl) {
          window.open(data.reportUrl, '_blank');
        } else {
          // Fallback to window.print() if no PDF URL
          window.print();
        }
      } else {
        // Fallback to window.print() on error
        window.print();
      }
    } catch (error) {
      console.error('Report generation failed:', error);
      // Fallback to window.print()
      window.print();
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 lg:px-10 py-6">
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-600">Laddar data...</div>
        </div>
      </div>
    );
  }

  const stats = employees.length > 0 ? calculatePayGapStats(employees) : null;
  
  // Safe extraction of gap values with proper type checking
  const getLatestGap = (): number => {
    if (!gapTrend || gapTrend.length === 0) return 0;
    const latest = gapTrend[gapTrend.length - 1];
    return typeof latest?.gap_pct === 'number' ? latest.gap_pct : 0;
  };
  
  const latestGap = getLatestGap();
  const medianSalary = stats?.maleMedian || 0;
  const pctUnderOverP50 = employees.length > 0 
    ? Math.round((employees.filter(emp => emp.base_salary_sek < medianSalary * 0.95).length / employees.length) * 100)
    : 0;

  // Ensure we have safe defaults for all data
  const safeTopDepartments = stats?.topDepartments || [];
  const safeGapTrend = gapTrend || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Compact Header */}
        <div className="relative overflow-hidden text-center mb-12">
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl mb-6 shadow-2xl">
              <BarChart3 className="w-12 h-12 text-slate-700" />
            </div>
            <PageTitle subtitle={<span>{t('overview.lastComputed')} {computedAt}</span>}>{t('overview.title')}</PageTitle>
          </div>
        </div>

        {/* Compact Action Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <button 
            onClick={handleUploadData}
            className="group relative px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Upload className="h-4 w-4" /> {t('overview.uploadData')}
            </span>
          </button>
          
          <button 
            onClick={handleCreateReport}
            className="group px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> {t('overview.createReport')}
            </div>
          </button>
        </div>

        {/* KPI Cards - Compact */}
        {employees.length > 0 && (
          <div className="mb-12">
            <KpiCards employees={employees} gapTrend={safeGapTrend} />
          </div>
        )}

        {/* Main Content - Compact Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-12 mb-12">
          {/* Main Chart - Takes up more space */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Gap Trend Chart */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-mint-200/20 to-teal-300/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-light text-slate-800 mb-2 tracking-tight">{t('overview.trend.title')}</h3>
                  </div>
                  
                  {safeGapTrend.length > 0 ? (
                    <GapTrendChart data={safeGapTrend} />
                  ) : (
                    <div className="h-96 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 font-light">
                      {t('overview.trend.placeholder')}
                    </div>
                  )}
                </div>
              </div>

              {/* Insights & Actions Section - Moved here for better balance */}
              {employees.length > 0 && (
                <>
                  <div className="text-center">
                    <h2 className="text-2xl font-light text-slate-800 mb-6 leading-tight tracking-tight">{t('overview.insightsActions')}</h2>
                  </div>
                  
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Insights Card - Compact */}
                    <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-mint-200/20 to-teal-300/10 rounded-full blur-2xl" />
                      <div className="relative z-10 text-center">
                        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-mint-100 to-teal-200 flex items-center justify-center mx-auto mb-6">
                          <Users className="h-8 w-8 text-teal-700" />
                        </div>
                        <h3 className="text-xl font-light text-slate-800 mb-6">{t('overview.insights.title')}</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                            <span className="text-sm text-slate-600 font-light">{t('overview.insights.genderDistribution')}</span>
                            <span className="text-sm font-semibold text-slate-800">
                              {stats?.maleCount || 0}M / {stats?.femaleCount || 0}F
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                            <span className="text-sm text-slate-600 font-light">{t('overview.insights.avgSalary')}</span>
                            <span className="text-sm font-semibold text-slate-800">
                              {typeof stats?.maleMedian === 'number' ? Math.round(stats.maleMedian / 1000) : 0}{t('common.thousand')} {t('common.currency')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Suggested Actions Card - Compact */}
                    <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-coral-200/20 to-rose-300/10 rounded-full blur-2xl" />
                      <div className="relative z-10 text-center">
                        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-coral-100 to-rose-200 flex items-center justify-center mx-auto mb-6">
                          <Lightbulb className="h-8 w-8 text-coral-700" />
                        </div>
                        <h3 className="text-xl font-light text-slate-800 mb-6">{t('overview.suggestedActions.title')}</h3>
                        
                        <div className="space-y-3">
                          <button 
                            className="w-full text-left text-sm text-slate-700 hover:text-coral-600 p-3 rounded-xl hover:bg-white/50 transition-all duration-300 font-medium"
                            onClick={() => window.dispatchEvent(new CustomEvent('copilot:open', { detail: { message: '/analyze', send: true } }))}
                          >
                            {t('overview.suggestedActions.reviewTopGaps')}
                          </button>
                          <button 
                            className="w-full text-left text-sm text-slate-700 hover:text-coral-600 p-3 rounded-xl hover:bg-white/50 transition-all duration-300 font-medium"
                            onClick={() => window.dispatchEvent(new CustomEvent('copilot:open', { detail: { message: '/trend', send: true } }))}
                          >
                            {t('overview.suggestedActions.analyzeTrends')}
                          </button>
                          <button 
                            className="w-full text-left text-sm text-slate-700 hover:text-coral-600 p-3 rounded-xl hover:bg-white/50 transition-all duration-300 font-medium"
                            onClick={() => window.dispatchEvent(new CustomEvent('copilot:open', { detail: { message: '/report', send: true } }))}
                          >
                            {t('overview.suggestedActions.generateReport')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Right Sidebar - Compact Cards */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Explanation - Compact */}
            {employees.length > 0 && (
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-2xl p-5 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-mint-200/20 to-teal-300/10 rounded-full blur-2xl" />
                <div className="relative z-10 text-center mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-mint-100 to-teal-200 flex items-center justify-center mx-auto mb-3">
                    <Bot className="h-6 w-6 text-teal-700" />
                  </div>
                  <h3 className="text-lg font-light text-slate-800">{t('overview.ai.title')}</h3>
                </div>
                
                <AiExplanation 
                  gapTotal={typeof latestGap === 'number' ? latestGap : 0}
                  topDepts={safeTopDepartments}
                  pctUnderOverP50={pctUnderOverP50}
                  trend={safeGapTrend}
                />
              </div>
            )}
            
            {/* Scenario Analysis - Compact */}
            {employees.length > 0 && (
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-2xl p-5 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-coral-200/20 to-rose-300/10 rounded-full blur-2xl" />
                <div className="relative z-10 text-center mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-coral-100 to-rose-200 flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="h-6 w-6 text-coral-700" />
                  </div>
                  <h3 className="text-lg font-light text-slate-800">{t('overview.scenario.title')}</h3>
                </div>
                
                <ScenarioAnalysis 
                  currentGap={typeof latestGap === 'number' ? latestGap : 0}
                  employees={employees}
                />
              </div>
            )}
            
            {/* Risk Overview - Compact */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-2xl p-5 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-sage-200/20 to-emerald-300/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-light text-slate-800">{t('overview.risk.title')}</h3>
                </div>
                
                <div className="space-y-3">
                  {safeTopDepartments.length > 0 ? (
                    safeTopDepartments.slice(0, 3).map((dept, index) => (
                      <div key={dept.department} className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-rose-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                          <span className="text-xs text-slate-800 font-medium">{dept.department}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-800">
                          {typeof dept.gap === 'number' ? dept.gap.toFixed(1) : '0.0'}%
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 font-light text-center py-3">Ingen riskdata tillgänglig</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Remove the old Insights Section since we moved it above */}
      </div>
    </div>
  );
}
