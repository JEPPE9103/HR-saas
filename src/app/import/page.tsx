"use client";

import { useEffect } from 'react';
import { useI18n } from "@/providers/I18nProvider";
import ImportWizard from '@/components/import/ImportWizard';
import { FileSpreadsheet, BarChart3, Users, Shield } from 'lucide-react';

export default function ImportPage() {
  const { t } = useI18n();
  
  useEffect(() => {
    // Debug: Logga miljövariabler
    console.log('Import page loaded');
    console.log('NEXT_PUBLIC_IMPORT_V2:', process.env.NEXT_PUBLIC_IMPORT_V2);
    console.log('Type of NEXT_PUBLIC_IMPORT_V2:', typeof process.env.NEXT_PUBLIC_IMPORT_V2);
  }, []);

  const handleUseDemo = () => {
    console.log('Demo button clicked from import page');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section - 2026 Modern Design */}
        <div className="relative overflow-hidden text-center mb-20">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10" />
          <div className="absolute top-10 left-20 w-64 h-64 bg-gradient-to-br from-mint-200/30 to-teal-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-gradient-to-br from-coral-200/20 to-rose-300/15 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            {/* Modern Icon with 2026 styling */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-100 via-white to-blue-50 rounded-3xl mb-10 shadow-2xl backdrop-blur-sm">
              <FileSpreadsheet className="w-12 h-12 text-slate-700" />
            </div>
            
            {/* Typography Hierarchy */}
            <h1 className="text-6xl font-light text-slate-800 mb-8 leading-tight tracking-tight">
              {t('import.title')}
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              {t('import.subtitle')}
            </p>
          </div>
        </div>

        {/* Features Grid - 2026 Modern Design */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* EU-kompatibel */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-mint-200/20 to-teal-300/10 rounded-full blur-2xl" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mint-100 to-teal-200 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-teal-700" />
              </div>
              <h3 className="text-xl font-light text-slate-800 mb-4">{t('import.features.euCompatible.title')}</h3>
              <p className="text-slate-600 leading-relaxed font-light">{t('import.features.euCompatible.body')}</p>
            </div>
          </div>
          
          {/* Smart analys */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-coral-200/20 to-rose-300/10 rounded-full blur-2xl" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral-100 to-rose-200 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-coral-700" />
              </div>
              <h3 className="text-xl font-light text-slate-800 mb-4">{t('import.features.smartAnalysis.title')}</h3>
              <p className="text-slate-600 leading-relaxed font-light">{t('import.features.smartAnalysis.body')}</p>
            </div>
          </div>
          
          {/* HR-vänlig */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sage-200/20 to-emerald-300/10 rounded-full blur-2xl" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sage-100 to-emerald-200 flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-sage-700" />
              </div>
              <h3 className="text-xl font-light text-slate-800 mb-4">{t('import.features.hrFriendly.title')}</h3>
              <p className="text-slate-600 leading-relaxed font-light">{t('import.features.hrFriendly.body')}</p>
            </div>
          </div>
        </div>

        {/* Import Wizard */}
        <ImportWizard onUseDemo={handleUseDemo} />
      </div>
    </div>
  );
}


