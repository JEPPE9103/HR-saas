"use client";

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from "@/providers/I18nProvider";
import { Stepper } from '@/components/ui/Stepper';
import { Card } from '@/components/ui/Card';
import { Dropzone } from './Dropzone';
import { HelpRow } from './HelpRow';
import { FooterNote } from './FooterNote';

// Legacy imports från quarantined kod
import { ColumnMeta as ColumnInfo, analyzeColumns } from '@/lib/csvSniffer';
import { FieldKey, REQUIRED_FIELDS } from '@/lib/importSchema';
import { buildAutoMap } from '@/lib/autoMap';

interface LegacyImportWizardProps {
  onUseDemo: () => void;
}

export default function LegacyImportWizard({ onUseDemo }: LegacyImportWizardProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sniffedData, setSniffedData] = useState<{ columns: ColumnInfo[]; rows: any[] } | null>(null);
  const [fieldMapping, setFieldMapping] = useState<Partial<Record<FieldKey, string>>>({});
  const [autoMap, setAutoMap] = useState<Partial<Record<FieldKey, string | null>>>({});
  const [enumMappings, setEnumMappings] = useState<Partial<Record<FieldKey, Record<string, string>>>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = useMemo(() => [
    t('import.wizard.steps.upload'), 
    t('import.wizard.steps.map'), 
    t('import.wizard.steps.preview')
  ], [t]);

  // Enkel legacy implementation
  const handleFileSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    setSelectedFile(file);
    setError(null);
    setIsProcessing(true);

    try {
      // Enkel CSV parsing för legacy
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

      // Beräkna auto-mapping
      const autoMapping = buildAutoMap(columns);
      setAutoMap(autoMapping);
      
      // Förifyll med auto-mapping (filtrera bort null-värden)
      const initialMapping: Partial<Record<FieldKey, string>> = {};
      Object.entries(autoMapping).forEach(([key, value]) => {
        if (value) {
          initialMapping[key as FieldKey] = value;
        }
      });
      setFieldMapping(initialMapping);
      
      setSniffedData({ columns, rows });
      setCurrentStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('import.wizard.fileAnalysisError'));
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleUseDemo = useCallback(async () => {
    try {
      setIsProcessing(true);
      
      // Skapa demo-data direkt i legacy
      const demoRows = [
        { employee_id: 'EMP001', name: 'Anna Andersson', gender: 'female', department: 'IT', base_salary_sek: '45000' },
        { employee_id: 'EMP002', name: 'Erik Eriksson', gender: 'male', department: 'HR', base_salary_sek: '38000' },
        { employee_id: 'EMP003', name: 'Maria Svensson', gender: 'female', department: 'Finance', base_salary_sek: '52000' }
      ];
      
      const demoHeaders = ['employee_id', 'name', 'gender', 'department', 'base_salary_sek'];
      const demoColumns = analyzeColumns(demoRows, demoHeaders);
      
      // Beräkna auto-mapping för demo
      const demoAutoMapping = buildAutoMap(demoColumns);
      setAutoMap(demoAutoMapping);
      
      // Förifyll med auto-mapping för demo (filtrera bort null-värden)
      const demoInitialMapping: Partial<Record<FieldKey, string>> = {};
      Object.entries(demoAutoMapping).forEach(([key, value]) => {
        if (value) {
          demoInitialMapping[key as FieldKey] = value;
        }
      });
      setFieldMapping(demoInitialMapping);
      
      setSniffedData({ columns: demoColumns, rows: demoRows });
      setCurrentStep(2);
    } catch (err) {
      setError(t('import.wizard.demoDataError'));
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleMappingChange = useCallback((mapping: Partial<Record<FieldKey, string>>) => {
    setFieldMapping(prev => ({ ...prev, ...mapping }));
  }, []);

  const handleEnumMappingChange = useCallback((field: FieldKey, mapping: Record<string, string>) => {
    setEnumMappings(prev => ({ ...prev, [field]: mapping }));
  }, []);

  // Default gender mapping baserat på regex-regler
  const getDefaultGenderMapping = useCallback((value: string): string => {
    const normalized = value.toLowerCase().trim();
    
    if (/^f(emale)?$|^kvinna$/i.test(normalized)) return 'female';
    if (/^m(ale)?$|^man$/i.test(normalized)) return 'male';
    if (/^(other|annan|övrigt)$/i.test(normalized)) return 'other';
    
    return 'prefer_not_to_say';
  }, []);

  const handleContinue = useCallback(() => {
    setCurrentStep(3);
  }, []);

  // Validera att alla obligatoriska fält är mappade
  const canContinue = useCallback(() => {
    const requiredFields = Object.entries(REQUIRED_FIELDS)
      .filter(([_, config]) => config.required)
      .map(([key, _]) => key as FieldKey);
    
    return requiredFields.every(field => fieldMapping[field]);
  }, [fieldMapping]);

  const handleImport = useCallback(() => {
    // Enkel import-logik för legacy
    console.log('Legacy import:', { fieldMapping, sniffedData });
    router.push('/overview');
  }, [fieldMapping, sniffedData, router]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
            {t('import.legacy.title')}
          </h1>
          <p className="text-[var(--text-muted)]">
            {t('import.legacy.subtitle')}
          </p>
        </div>

        <Stepper steps={steps} active={currentStep - 1} />

        {currentStep === 1 && (
          <Card>
            <Dropzone
              onFiles={handleFileSelect}
              onUseDemo={handleUseDemo}
            />
            <HelpRow />
            <FooterNote />
            
            {isProcessing && (
              <div className="mt-4 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{t('import.legacy.loadingDemo')}</p>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {error}
              </div>
            )}
          </Card>
        )}

        {currentStep === 2 && sniffedData && (
          <Card>
                         <div className="mb-6">
               <h2 className="text-xl font-semibold text-[var(--text)] mb-4">
                 {t('import.wizard.step2.title')} (Legacy)
               </h2>
               <p className="text-[var(--text-muted)] mb-4">
                 {t('import.wizard.step2.subtitle')}
               </p>
             </div>

            <div className="space-y-4">
              {Object.entries(REQUIRED_FIELDS).map(([key, config]) => {
                const fieldKey = key as FieldKey;
                const isMapped = !!fieldMapping[fieldKey];
                const isRequired = config.required;
                
                // Filtrera kompatibla kolumner baserat på fälttyp
                const compatibleColumns = sniffedData.columns.filter(column => {
                  // Filtrera bort systemfält
                  if (column.name.toLowerCase().includes('tenant_id') || 
                      column.name.toLowerCase().includes('created_at') ||
                      column.name.toLowerCase().includes('updated_at')) {
                    return false;
                  }
                  
                  // Filtrera baserat på fälttyp
                  switch (config.type) {
                    case "number":
                      return column.type === "number";
                    case "date":
                      return column.type === "date";
                    case "enum":
                      return column.type === "string" && column.distinct.length <= 20;
                    case "string":
                      return column.type === "string";
                    default:
                      return true;
                  }
                });
                
                // Sortera: auto-mappad kolumn överst, sedan alfabetiskt
                const sortedColumns = [...compatibleColumns].sort((a, b) => {
                  if (a.name === autoMap[fieldKey]) return -1;
                  if (b.name === autoMap[fieldKey]) return 1;
                  return a.name.localeCompare(b.name);
                });
                
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center gap-4">
                      <label className="w-32 text-sm font-medium text-[var(--text)]">
                        {config.label}
                        {isRequired && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <select
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                          isMapped 
                            ? 'border-green-500 bg-[var(--card)] text-[var(--text)]' 
                            : 'border-[var(--ring)] bg-[var(--card)] text-[var(--text)]'
                        }`}
                        value={fieldMapping[fieldKey] || ''}
                        onChange={(e) => handleMappingChange({ [fieldKey]: e.target.value })}
                      >
                                                 <option value="">{t('import.wizard.columnSelect')}</option>
                        {sortedColumns.map(col => (
                          <option key={col.name} value={col.name}>
                            {col.name}
                          </option>
                        ))}
                      </select>
                      {isMapped && (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="ml-36 text-xs text-[var(--text-muted)]">
                                             {t('import.wizard.fieldType')} {config.type === 'number' ? t('import.wizard.fieldType.number') : config.type === 'date' ? t('import.wizard.fieldType.date') : config.type === 'enum' ? t('import.wizard.fieldType.enum') : t('import.wizard.fieldType.string')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Enum-värdesmappning för kön */}
            {fieldMapping.gender && (
              <div className="mt-6 p-4 bg-[var(--muted)] border border-[var(--ring)] rounded-lg">
                                 <h3 className="text-sm font-medium text-[var(--text)] mb-3">
                   {t('import.wizard.enumMapping.title')}
                 </h3>
                <div className="space-y-2">
                  {sniffedData.columns
                    .find(col => col.name === fieldMapping.gender)
                    ?.distinct.slice(0, 10)
                    .map(value => (
                      <div key={value} className="flex items-center gap-3">
                        <span className="text-sm text-[var(--text-muted)] w-20">
                          {value}
                        </span>
                        <span className="text-sm text-[var(--text-muted)]">→</span>
                        <select
                          className="text-sm border border-[var(--ring)] bg-[var(--card)] text-[var(--text)] px-2 py-1 rounded"
                          value={enumMappings.gender?.[value] || getDefaultGenderMapping(value)}
                          onChange={(e) => {
                            const newMapping = { ...enumMappings.gender, [value]: e.target.value };
                            handleEnumMappingChange('gender', newMapping);
                          }}
                        >
                          <option value="female">female</option>
                          <option value="male">male</option>
                          <option value="other">other</option>
                          <option value="prefer_not_to_say">prefer_not_to_say</option>
                        </select>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
                                                          <button
                 onClick={handleBack}
                 className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] bg-[var(--card)] border border-[var(--ring)] rounded-md hover:bg-[var(--neutral-soft-bg)]"
               >
                 {t('import.wizard.back')}
               </button>
                             <button
                onClick={handleContinue}
                disabled={!canContinue()}
                className={`px-4 py-2 text-sm font-medium border border-transparent rounded-md ${
                  canContinue()
                    ? 'text-white bg-[var(--accent)] hover:bg-[var(--accent)]/80'
                    : 'text-[var(--text-muted)] bg-[var(--muted)] cursor-not-allowed'
                }`}
              >
                {t('import.wizard.continue')}
               </button>
            </div>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
                         <div className="mb-6">
               <h2 className="text-xl font-semibold text-[var(--text)] mb-4">
                 {t('import.wizard.step3.title')} (Legacy)
               </h2>
               <p className="text-[var(--text-muted)] mb-4">
                 {t('import.wizard.step3.subtitle')}
               </p>
             </div>

                         <div className="mb-6">
               <h3 className="text-lg font-medium text-[var(--text)] mb-2">Mapping:</h3>
               <div className="space-y-2">
                 {Object.entries(fieldMapping).map(([key, value]) => (
                   <div key={key} className="flex items-center gap-2">
                     <span className="text-sm font-medium text-[var(--text)]">{key}:</span>
                     <span className="text-sm text-[var(--text-muted)]">{value}</span>
                   </div>
                 ))}
               </div>
             </div>

            <div className="flex justify-between">
                             <button
                 onClick={handleBack}
                 className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] bg-[var(--card)] border border-[var(--ring)] rounded-md hover:bg-[var(--neutral-soft-bg)]"
               >
                 {t('import.wizard.back')}
               </button>
               <button
                 onClick={handleImport}
                 className="px-4 py-2 text-sm font-medium text-white bg-[var(--accent)] border border-transparent rounded-md hover:bg-[var(--accent)]/80"
               >
                 {t('import.wizard.import')}
               </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
