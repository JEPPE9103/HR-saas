"use client";

import { useI18n } from "@/providers/I18nProvider";
import { calculatePayGapStats, NormalizedEmployee } from "@/services/demoData";
import { Percent, BarChart3, Users } from "lucide-react";

interface KpiCardsProps {
  employees: NormalizedEmployee[];
  gapTrend: any[];
}

export default function KpiCards({ employees, gapTrend }: KpiCardsProps) {
  const { t } = useI18n();
  
  const stats = calculatePayGapStats(employees);
  
  // Safe extraction of gap values with proper type checking
  const getLatestGap = (): number => {
    if (!gapTrend || gapTrend.length === 0) {
      return 0;
    }
    const latest = gapTrend[gapTrend.length - 1];
    return typeof latest?.gap_pct === 'number' ? latest.gap_pct : 0;
  };
  
  const getPreviousGap = (): number => {
    if (!gapTrend || gapTrend.length < 2) return getLatestGap();
    const previous = gapTrend[gapTrend.length - 2];
    return typeof previous?.gap_pct === 'number' ? previous.gap_pct : getLatestGap();
  };
  
  const latestGap = getLatestGap();
  const previousGap = getPreviousGap();
  const gapChange = latestGap - previousGap;
  
  // Calculate percentage under/over median (approximation)
  const medianSalary = stats.maleMedian; // Using male median as reference
  const underMedian = employees.filter(emp => emp.base_salary_sek < medianSalary * 0.95).length;
  const overMedian = employees.filter(emp => emp.base_salary_sek > medianSalary * 1.05).length;
  const pctUnderMedian = Math.round((underMedian / employees.length) * 100);
  const pctOverMedian = Math.round((overMedian / employees.length) * 100);

  // Determine color for gap value
  let gapColor = '';
  if (latestGap <= 2) {
    gapColor = 'text-emerald-600';
  } else if (latestGap <= 5) {
    gapColor = 'text-blue-600';
  } else if (latestGap <= 10) {
    gapColor = 'text-yellow-600';
  } else {
    gapColor = 'text-red-600';
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {/* Average Gap Card - 2026 Modern Design */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-mint-200/20 to-teal-300/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-mint-100 to-teal-200 flex items-center justify-center">
              <Percent className="h-8 w-8 text-teal-700" />
            </div>
            <div className={`text-sm px-3 py-1 rounded-full ${gapChange < 0 ? 'bg-emerald-100 text-emerald-700' : gapChange > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
              {gapChange > 0 ? '+' : ''}{typeof gapChange === 'number' ? gapChange.toFixed(1) : '0.0'}%
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-3 font-light">{t('overview.kpi.avgGap')}</p>
            <p className={`text-4xl font-light ${gapColor} mb-6`}>
              {typeof latestGap === 'number' ? latestGap.toFixed(1) : '0.0'}%
            </p>
          </div>
                     {/* EU guidelines info */}
           <div className="pt-6 border-t border-slate-200/50">
             <div className="text-xs text-slate-600 space-y-2">
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                 <span className="font-light">{t('overview.kpi.euGoal')}</span>
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                 <span className="font-light">{t('overview.kpi.euAcceptable')}</span>
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                 <span className="font-light">{t('overview.kpi.euWarning')}</span>
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                 <span className="font-light">{t('overview.kpi.euCritical')}</span>
               </div>
             </div>
           </div>
        </div>
      </div>
      
      {/* Top Departments Card */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-coral-50 to-rose-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-coral-200/20 to-rose-300/10 rounded-full blur-2xl" />
        <div className="relative z-10 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-coral-200 to-rose-200 flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="h-8 w-8 text-coral-700" />
          </div>
          <p className="text-sm text-slate-600 mb-3 font-light">{t('overview.kpi.topDepartments')}</p>
          <p className="text-4xl font-light text-slate-800 mb-2">{stats.topDepartments.length}</p>
          <p className="text-sm text-slate-600 font-light">
            {stats.topDepartments.length > 0 ? stats.topDepartments[0].department : '-'}
          </p>
        </div>
      </div>
      
      {/* Under Median Card */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-sage-50 to-emerald-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sage-200/20 to-emerald-300/10 rounded-full blur-2xl" />
        <div className="relative z-10 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sage-200 to-emerald-200 flex items-center justify-center mx-auto mb-6">
            <Percent className="h-8 w-8 text-sage-700" />
          </div>
          <p className="text-sm text-slate-600 mb-3 font-light">{t('overview.kpi.underMedian')}</p>
          <p className="text-4xl font-light text-slate-800 mb-2">{pctUnderMedian}%</p>
          <p className="text-sm text-slate-600 font-light">
            {underMedian} {t('overview.kpi.employees')}
          </p>
        </div>
      </div>
      
      {/* Employees Card */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-200/20 to-purple-300/10 rounded-full blur-2xl" />
        <div className="relative z-10 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center mx-auto mb-6">
            <Users className="h-8 w-8 text-indigo-700" />
          </div>
          <p className="text-sm text-slate-600 mb-3 font-light">{t('overview.kpi.employees')}</p>
          <p className="text-4xl font-light text-slate-800 mb-2">{employees.length}</p>
          <p className="text-sm text-slate-600 font-light">
            {stats.maleCount}M / {stats.femaleCount}F
          </p>
        </div>
      </div>
    </div>
  );
}
