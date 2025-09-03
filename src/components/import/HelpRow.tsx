"use client";

import { Shield, Lock, Globe } from 'lucide-react';
import { useI18n } from "@/providers/I18nProvider";

export function HelpRow() {
  const { t } = useI18n();
  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-xl">
      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-slate-600" />
        {t('import.help.title')}
      </h4>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Lock className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{t('import.help.gdpr.title')}</p>
            <p className="text-xs text-gray-600">{t('import.help.gdpr.body')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Globe className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{t('import.help.eu.title')}</p>
            <p className="text-xs text-gray-600">{t('import.help.eu.body')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{t('import.help.pii.title')}</p>
            <p className="text-xs text-gray-600">{t('import.help.pii.body')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
