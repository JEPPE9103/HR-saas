"use client";

import Link from "next/link";
import { useI18n } from "@/providers/I18nProvider";

export default function NotFound(){
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        {/* Header - 2026 Modern Design */}
        <div className="relative overflow-hidden text-center mb-20">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10" />
          <div className="absolute top-10 left-20 w-64 h-64 bg-gradient-to-br from-mint-200/30 to-teal-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-gradient-to-br from-coral-200/20 to-rose-300/15 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h1 className="text-6xl font-light text-slate-800 mb-8 leading-tight tracking-tight">
              {t('notFound.title')}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
              {t('notFound.subtitle')}
            </p>
          </div>
        </div>

        {/* Action Button - 2026 Modern Design */}
        <div className="text-center">
          <Link 
            href="/overview" 
            className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            {t('notFound.goToOverview')}
          </Link>
        </div>
      </div>
    </div>
  );
}


