"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from "@/providers/I18nProvider";
import * as XLSX from 'xlsx';
import { Stepper } from '@/components/ui/Stepper';
import { Card } from '@/components/ui/Card';
import { Dropzone } from './Dropzone';
import { HelpRow } from './HelpRow';
import { FooterNote } from './FooterNote';
import MappingForm from './MappingForm';
import DataPreview from './DataPreview';
import { FieldKey, getRequiredFields } from '@/lib/importSchema';
import { analyzeColumns, ColumnMeta } from '@/lib/csvSniffer';
import { loadDemoData, generateGapTrendData, generateFallbackDemoData, generateCompanyComparisonData } from '@/services/demoData';
import { isFeatureEnabled } from '@/lib/featureFlags';
import LegacyImportWizard from './LegacyImportWizard';
import { normalizeData, NormalizedRow } from '@/lib/normalizeData';
import { FileSpreadsheet } from 'lucide-react';

interface ImportWizardProps {
  onUseDemo: () => void;
}

export default function ImportWizard({ onUseDemo }: ImportWizardProps) {
  const { t } = useI18n();
  
  // Debug: Logga feature flag-status
  console.log('ImportWizard: Checking feature flag IMPORT_V2');
  console.log('Feature flag value:', isFeatureEnabled('IMPORT_V2'));
  
  // Kontrollera om Import V2 är aktiverat
  if (!isFeatureEnabled('IMPORT_V2')) {
    console.log('ImportWizard: Feature flag disabled, falling back to LegacyImportWizard');
    // Fallback till legacy import
    return <LegacyImportWizard onUseDemo={onUseDemo} />;
  }

  console.log('ImportWizard: Feature flag enabled, using Import V2');

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sniffedData, setSniffedData] = useState<{ columns: ColumnMeta[]; rows: any[] } | null>(null);
  const [fieldMapping, setFieldMapping] = useState<Partial<Record<FieldKey, string>>>({});
  const [enumMappings, setEnumMappings] = useState<Partial<Record<FieldKey, Record<string, string>>>>({});
  const [normalizedData, setNormalizedData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = useMemo(() => [
    t('import.wizard.steps.upload'), 
    t('import.wizard.steps.map'), 
    t('import.wizard.steps.preview')
  ], [t]);

  // Hantera filval
  const handleFileSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    setSelectedFile(file);
    setError(null);
    setIsProcessing(true);

    try {
      let data: { columns: ColumnMeta[]; rows: any[] };
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        const text = await file.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const row: any = {};
          headers.forEach((header, i) => {
            row[header] = values[i] || '';
          });
          return row;
        });
        const columns = analyzeColumns(rows, headers);
        data = { columns, rows };
      } else if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false }) as Record<string, any>[];
        // Konvertera till samma format som CSV sniffer
        const columns = jsonData.length > 0 ? analyzeColumns(jsonData, Object.keys(jsonData[0])) : [];
        data = { columns, rows: jsonData };
      } else {
        throw new Error(t('import.wizard.fileTypeError'));
      }

      setSniffedData(data);
      setCurrentStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('import.wizard.fileAnalysisError'));
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Hantera demo-data
  const handleUseDemo = useCallback(async () => {
    try {
      setIsProcessing(true);
      
      // Rensa gamla demo-data från localStorage
      localStorage.removeItem('employeesDemo');
      localStorage.removeItem('gapTrendDemo');
      localStorage.removeItem('compBandsDemo');
      
      // Använd fallback demo-data direkt istället för att försöka ladda från CSV
      const fallbackData = generateFallbackDemoData();
      
      // Simulera sniffed data för demo
      const demoSniffedData = {
        columns: fallbackData.employees.length > 0 ? analyzeColumns(fallbackData.employees, Object.keys(fallbackData.employees[0])) : [],
        rows: fallbackData.employees
      };
      
      setSniffedData(demoSniffedData);
      setCurrentStep(2);
    } catch (err) {
      setError(t('import.wizard.demoDataError'));
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Validera att alla obligatoriska fält är mappade
  const canProceedToStep3 = useCallback(() => {
    const requiredFields = getRequiredFields();
    return requiredFields.every(field => fieldMapping[field]);
  }, [fieldMapping]);

  // Uppdatera normaliserad data när mappning ändras
  useEffect(() => {
    if (currentStep >= 2) {
      const normalized = normalizeData(sniffedData?.rows || [], fieldMapping, enumMappings);
      setNormalizedData(normalized);
    }
  }, [fieldMapping, enumMappings, currentStep, sniffedData]);

  // Hantera import
  const handleImport = useCallback(async () => {
    try {
      setIsProcessing(true);
      
      // För demo, använd fördefinierad gap trend data istället för att beräkna på nytt
      let gapTrendData;
      if (sniffedData?.rows && sniffedData.rows.length > 0) {
        // Kontrollera om detta är demo-data (fallback)
        const isDemoData = sniffedData.rows.some(row => row.employee_id?.startsWith('EMP'));
        if (isDemoData) {
          // Använd fördefinierad gap trend för demo
          const fallbackData = generateFallbackDemoData();
          gapTrendData = fallbackData.gapTrend;
        } else {
          // Beräkna gap trend för riktig data
          gapTrendData = generateGapTrendData(normalizedData);
        }
      } else {
        gapTrendData = generateGapTrendData(normalizedData);
      }
      
      // För demo, spara både anställda och gap trend i localStorage
      localStorage.setItem('employeesDemo', JSON.stringify(normalizedData));
      localStorage.setItem('gapTrendDemo', JSON.stringify(gapTrendData));
      
      // Navigera till översikt
      router.push('/overview');
    } catch (err) {
      setError(t('import.wizard.importFailed'));
    } finally {
      setIsProcessing(false);
    }
  }, [normalizedData, router, sniffedData]);

  // Navigera mellan steg
  const goToStep = useCallback((step: number) => {
    if (step === 1) {
      setCurrentStep(1);
      setSelectedFile(null);
      setSniffedData(null);
      setFieldMapping({});
      setEnumMappings({});
      setNormalizedData([]);
      setError(null);
    } else if (step === 2 && selectedFile && sniffedData) {
      setCurrentStep(2);
    } else if (step === 3 && canProceedToStep3()) {
      setCurrentStep(3);
    }
  }, [selectedFile, sniffedData, canProceedToStep3]);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
          <FileSpreadsheet className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">{t('import.wizard.title')}</h2>
        <p className="text-gray-600">{t('import.wizard.subtitle')}</p>
      </div>

      {/* Stepper - 2026 Modern Design */}
      <div className="mb-12">
        <Stepper 
          steps={steps} 
          active={currentStep - 1} 
          onStepClick={goToStep}
          className="bg-gradient-to-r from-slate-50 to-white rounded-3xl border border-slate-200/50 p-6 shadow-lg"
        />
      </div>

      {/* Step Content - 2026 Modern Design */}
      <div className="space-y-8">
        {/* Step 1: File Upload */}
        {currentStep === 1 && (
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-200/50 p-8 hover:border-slate-300/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mint-200/20 to-teal-300/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <Dropzone onFiles={handleFileSelect} onUseDemo={handleUseDemo} />
              <HelpRow />
              
              {isProcessing && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-3 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                    <p className="text-sm font-medium text-teal-700">{t('import.wizard.analyzing')}</p>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center">
                      <span className="text-xs text-rose-600">!</span>
                    </div>
                    <p className="text-sm text-rose-700">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Column Mapping */}
        {currentStep === 2 && sniffedData && (
          <div className="group relative overflow-hidden bg-gradient-to-br from-coral-50 to-rose-100 rounded-3xl border border-coral-200/50 p-8 hover:border-coral-300/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-coral-200/20 to-rose-300/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <MappingForm 
                columns={sniffedData.columns}
                onMappingChange={setFieldMapping}
                onEnumMappingChange={(field: FieldKey, mapping: Record<string, string>) => {
                  setEnumMappings(prev => ({ ...prev, [field]: mapping }));
                }}
              />
              
              {/* Navigation Footer */}
              <div className="flex justify-between items-center pt-8 border-t border-coral-200/30">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="px-6 py-3 text-sm font-medium text-slate-600 bg-white/80 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all duration-200"
                >
                  ← {t('import.wizard.back')}
                </button>
                
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  disabled={!canProceedToStep3()}
                  className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-coral-600 to-rose-600 hover:from-coral-700 hover:to-rose-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {t('import.wizard.continue')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Data Preview & Import */}
        {currentStep === 3 && normalizedData.length > 0 && (
          <div className="group relative overflow-hidden bg-gradient-to-br from-sage-50 to-emerald-100 rounded-3xl border border-sage-200/50 p-8 hover:border-sage-300/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage-200/20 to-emerald-300/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <DataPreview 
                data={normalizedData} 
                onImport={handleImport}
                onBack={() => goToStep(2)}
              />
            </div>
          </div>
        )}
      </div>

      <FooterNote />
    </div>
  );
}
