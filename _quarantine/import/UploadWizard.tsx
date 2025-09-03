"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/providers/I18nProvider";
import { AlertCircle, ArrowLeft, FileSpreadsheet, UploadCloud, ShieldCheck, CheckCircle, Lock, Users } from "lucide-react";
import * as XLSX from "xlsx";
import { REQUIRED_FIELDS, FieldKey, getRequiredFields, getFieldConfig } from "@/lib/importSchema";
import { ColumnMeta as ColumnInfo } from "@/lib/csvSniffer";
import { loadDemoData, normalizeEmployeeData } from "@/services/demoData";
import EnumMapping from "./EnumMapping";

type PreviewRow = Record<string, string | number>;

export interface Mapping {
  [key: string]: string;
}

interface EnumMappings {
  [fieldKey: string]: Record<string, string>;
}

export default function UploadWizard({
  onAnalyze,
  onUseDemo,
}: {
  onAnalyze: (file: File, mapping: Mapping) => Promise<void>;
  onUseDemo: () => void;
}) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState<Mapping>({});
  const [enumMappings, setEnumMappings] = useState<EnumMappings>({});
  const [previewData, setPreviewData] = useState<PreviewRow[]>([]);
  const [sniffedData, setSniffedData] = useState<ColumnInfo[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to translate column names
  function translateColumnName(columnName: string, locale: string): string {
    const translations: Record<string, Record<string, string>> = {
      sv: {
        'gender': 'Kön',
        'sex': 'Kön',
        'kön': 'Kön',
        'role': 'Roll',
        'role_title': 'Rolltitel',
        'position': 'Position',
        'title': 'Titel',
        'job_title': 'Jobbtitel',
        'department': 'Avdelning',
        'dept': 'Avdelning',
        'avdelning': 'Avdelning',
        'site': 'Plats',
        'location': 'Plats',
        'office': 'Kontor',
        'country': 'Land',
        'location_country': 'Land',
        'base_salary': 'Grundlön',
        'base_salary_sek': 'Grundlön (SEK)',
        'salary': 'Lön',
        'pay': 'Lön',
        'compensation': 'Ersättning',
        'employee_id': 'Anställnings-ID',
        'name': 'Namn',
        'full_name': 'Fullständigt namn',
        'first_name': 'Förnamn',
        'last_name': 'Efternamn',
        'hire_date': 'Anställningsdatum',
        'start_date': 'Startdatum',
        'level': 'Nivå',
        'job_family': 'Jobbfamilj',
        'fte': 'Helgdelsgrad',
        'currency': 'Valuta',
        'tenant_id': 'Klient-ID'
      },
      en: {
        'gender': 'Gender',
        'sex': 'Gender',
        'role': 'Role',
        'role_title': 'Role Title',
        'position': 'Position',
        'title': 'Title',
        'job_title': 'Job Title',
        'department': 'Department',
        'dept': 'Department',
        'site': 'Site',
        'location': 'Location',
        'office': 'Office',
        'country': 'Country',
        'location_country': 'Country',
        'base_salary': 'Base Salary',
        'base_salary_sek': 'Base Salary (SEK)',
        'salary': 'Salary',
        'pay': 'Pay',
        'compensation': 'Compensation',
        'employee_id': 'Employee ID',
        'name': 'Name',
        'full_name': 'Full Name',
        'first_name': 'First Name',
        'last_name': 'Last Name',
        'hire_date': 'Hire Date',
        'start_date': 'Start Date',
        'level': 'Level',
        'job_family': 'Job Family',
        'fte': 'FTE',
        'currency': 'Currency',
        'tenant_id': 'Tenant ID'
      }
    };

    const columnLower = columnName.toLowerCase().trim();
    const langTranslations = translations[locale] || translations.en;

    return langTranslations[columnLower] || columnName;
  }

  // Function to get unique values from a column
  function getUniqueValues(columnName: string): string[] {
    if (!columnName || !previewData.length) return [];
    const values = previewData
      .map(row => String(row[columnName] || ""))
      .filter(value => value.trim() !== "")
      .map(value => value.trim());
    return [...new Set(values)].slice(0, 10); // Show max 10 unique values
  }

  // Function to get field preview
  function getFieldPreview(fieldKey: string): string[] {
    const columnName = mapping[fieldKey];
    if (!columnName) return [];
    return getUniqueValues(columnName);
  }

  // Function to get compatible columns for a field
  function getCompatibleColumns(fieldKey: FieldKey): ColumnInfo[] {
    const fieldConfig = getFieldConfig(fieldKey);
    
    return sniffedData.filter(column => {
      switch (fieldConfig.type) {
        case 'number':
          return column.type === 'number';
        case 'date':
          return column.type === 'date';
        case 'enum':
          return column.type === 'string' && column.distinct.length <= 20;
        default:
          return true; // string accepts all types
      }
    });
  }

  // Function to validate required fields
  function validateMapping(): boolean {
    const requiredFields = getRequiredFields();
    return requiredFields.every(field => mapping[field]);
  }

  // Function to handle demo data
  async function handleDemoData() {
    setDemoLoading(true);
    setError(null);
    
    try {
      const demoData = await loadDemoData();
      const suggestions = {}; // Auto-suggestions removed for quarantined component
      
      setMapping(suggestions);
      setPreviewData(demoData.employees);
      setSniffedData([]); // Simplified for quarantined component
      setStep(2);
      
      // Simplified for quarantined component - just save raw data
      localStorage.setItem('employeesDemo', JSON.stringify(demoData.employees));
      localStorage.setItem('gapTrendDemo', JSON.stringify(demoData.gapTrend));
      localStorage.setItem('compBandsDemo', JSON.stringify(demoData.compBands));
      
      // Navigate to overview
      router.push('/overview');
      
    } catch (error) {
      setError('Failed to load demo data');
      console.error('Demo data error:', error);
    } finally {
      setDemoLoading(false);
    }
  }

  function onDrop(f: File) {
    setFile(f);
    setError(null);
    setValidationError(null);
    const reader = new FileReader();
    
    // Support CSV and XLSX by sniffing extension
    const name = f.name.toLowerCase();
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      reader.onload = () => {
        const data = new Uint8Array(reader.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws, { raw: false }) as Record<string, any>[];
        
        // Simplified for quarantined component
        setSniffedData([]);
        setPreviewData(jsonData);
        setMapping({});
        setStep(2);
      };
      reader.readAsArrayBuffer(f);
    } else {
      reader.onload = () => {
        const text = String(reader.result || "");
        const lines = text.split(/\r?\n/).filter(line => line.trim());
        const header = lines[0] || "";
        const cols = header
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);
        
        // Parse CSV data for preview
        const previewRows: PreviewRow[] = [];
        for (let i = 1; i < Math.min(lines.length, 11); i++) {
          const values = lines[i].split(",").map(v => v.trim());
          const row: PreviewRow = {};
          cols.forEach((col, index) => {
            row[col] = values[index] || "";
          });
          previewRows.push(row);
        }
        
        // Simplified for quarantined component
        setSniffedData([]);
        setPreviewData(previewRows);
        setMapping({});
        setStep(2);
      };
      reader.readAsText(f);
    }
  }

  async function handleAnalyze() {
    if (!file) return;
    
    if (!validateMapping()) {
      setValidationError(t('upload.validation.requiredFields'));
      return;
    }
    
    setBusy(true);
    try {
      // fake progress bar while awaiting onAnalyze
      await new Promise((r)=>setTimeout(r,150));
      await onAnalyze(file, mapping);
      setStep(3);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  function goBack() {
    if (step === 2) {
      setStep(1);
      setMapping({});
      setValidationError(null);
    }
  }

  const allMapped = validateMapping();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">{t('upload.title')}</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{t('upload.subtitle')}</p>
        
        {/* Trust & Security Cues */}
        <div className="mt-4 p-4 rounded-xl border border-[var(--ring)] bg-[var(--neutral-soft-bg)]">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-4 w-4 text-[var(--success)]" />
            <span className="text-sm font-medium text-[var(--text)]">{t('upload.dataSecure')}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-[var(--success)]" />
              <span className="text-[var(--text-muted)]">GDPR Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-3 w-3 text-[var(--success)]" />
              <span className="text-[var(--text-muted)]">Encrypted in EU</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-[var(--success)]" />
              <span className="text-[var(--text-muted)]">No PII stored</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <ol className="grid grid-cols-3 gap-3 text-sm">
        {[t('upload.step.upload'), t('upload.step.map'), t('upload.step.analyze')].map((label, i) => (
          <li
            key={label}
            className={`rounded-lg px-3 py-2 ring-1 ${
              step > i + 1
                ? "bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-[var(--success-soft-ring)]"
                : "bg-[var(--panel)] ring-[var(--ring)] text-[var(--text)]"
            } flex items-center gap-2`}
          >
            {step > i + 1 ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <span className="h-5 w-5 inline-flex items-center justify-center rounded-full bg-[var(--neutral-soft-bg)] text-[var(--text)]">{i + 1}</span>
            )}
            {label}
          </li>
        ))}
      </ol>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="rounded-2xl border p-6 shadow-lg border-[var(--ring)] bg-[var(--panel)]">
          <div
            className="rounded-xl border-2 border-dashed p-10 text-center transition border-[var(--ring)] bg-[var(--panel)]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) onDrop(e.dataTransfer.files[0]);
            }}
          >
            <UploadCloud className="mx-auto h-10 w-10 text-[var(--accent)]" />
            <p className="mt-3 text-[var(--text)]">{t('upload.drop.hint')}</p>
            <p className="text-xs text-[var(--text-muted)]">{t('upload.drop.or')}</p>
            <button
              onClick={() => inputRef.current?.click()}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-white hover:bg-[var(--accent-strong)]"
            >
              <FileSpreadsheet className="h-4 w-4" /> {t('upload.selectFile')}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onDrop(f);
              }}
            />
            <div className="mt-4 space-y-2">
              <button 
                onClick={handleDemoData} 
                disabled={demoLoading}
                className="text-[var(--accent)] hover:text-[var(--accent-strong)] text-sm underline disabled:opacity-50"
              >
                {demoLoading ? t('upload.demoData.loading') : t('upload.demoData')}
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-3 rounded-lg border border-[var(--danger-soft-ring)] bg-[var(--danger-soft-bg)] p-3">
              <p className="inline-flex items-center gap-2 text-[var(--danger-soft-fg)] text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Mapping */}
      {step === 2 && (
        <div className="rounded-2xl border p-6 shadow-lg border-[var(--ring)] bg-[var(--panel)]">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('upload.back')}
            </button>
            <h3 className="font-medium text-[var(--text)]">{t('upload.map.title')}</h3>
          </div>

          {/* File Preview */}
          {previewData.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-[var(--text)] mb-3">{t('upload.filePreview')}</h4>
              <div className="overflow-x-auto rounded-lg border border-[var(--ring)]">
                <table className="w-full text-xs">
                  <thead className="bg-[var(--neutral-soft-bg)]">
                    <tr>
                      {sniffedData.map((col) => (
                        <th key={col.name} className="px-3 py-2 text-left text-[var(--text)] font-medium">
                          {translateColumnName(col.name, locale)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-t border-[var(--ring)]">
                        {sniffedData.map((col) => (
                          <td key={col.name} className="px-3 py-2 text-[var(--text-muted)]">
                            {String(row[col.name] || "").slice(0, 20)}
                            {String(row[col.name] || "").length > 20 ? "..." : ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Validation Error */}
          {validationError && (
            <div className="mb-4 rounded-lg border border-[var(--danger-soft-ring)] bg-[var(--danger-soft-bg)] p-3">
              <p className="inline-flex items-center gap-2 text-[var(--danger-soft-fg)] text-sm">
                <AlertCircle className="h-4 w-4" />
                {validationError}
              </p>
            </div>
          )}

          {sniffedData.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">{t('upload.noColumns')}</p>
          ) : (
            <div className="space-y-6">
              {/* Column Mapping */}
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(REQUIRED_FIELDS).map(([fieldKey, config]) => {
                  const compatibleColumns = getCompatibleColumns(fieldKey as FieldKey);
                  const isMapped = mapping[fieldKey];
                  const isRequired = config.required;
                  
                  return (
                    <div key={fieldKey} className="space-y-2">
                      <label className="text-sm">
                        <div className="mb-1 text-[var(--text)]">
                          {config.label}
                          {isRequired && <span className="text-[var(--danger)] ml-1">*</span>}
                        </div>
                        <select
                          className={`w-full rounded-lg border px-3 py-2 text-[var(--text)] border-[var(--ring)] bg-[var(--panel)] ${
                            isRequired && !isMapped ? 'border-[var(--danger-soft-ring)]' : ''
                          }`}
                          value={isMapped ?? ""}
                          onChange={(e) => {
                            setMapping((m) => ({ ...m, [fieldKey]: e.target.value }));
                            setValidationError(null);
                          }}
                        >
                          <option value="">{t('upload.selectColumn')}</option>
                          {compatibleColumns.map((col) => (
                            <option key={col.name} value={col.name}>
                              {translateColumnName(col.name, locale)}
                            </option>
                          ))}
                        </select>
                      </label>
                      
                      {/* Field Preview */}
                      {isMapped && (
                        <div className="text-xs text-[var(--text-muted)]">
                          <div className="font-medium mb-1">{t('upload.sampleValues')}</div>
                          <div className="flex flex-wrap gap-1">
                            {getFieldPreview(fieldKey).map((value, index) => (
                              <span 
                                key={index} 
                                className="px-2 py-1 bg-[var(--neutral-soft-bg)] rounded text-xs"
                              >
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Enum Mapping */}
                      {isMapped && getFieldConfig(fieldKey as FieldKey).type === 'enum' && (
                        <EnumMapping
                          fieldKey={fieldKey as FieldKey}
                          sourceValues={getUniqueValues(isMapped)}
                          mapping={enumMappings[fieldKey] || {}}
                          onMappingChange={(newMapping) => {
                            setEnumMappings(prev => ({
                              ...prev,
                              [fieldKey]: newMapping
                            }));
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={handleAnalyze}
              disabled={!allMapped || busy || !file}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-white disabled:opacity-50 hover:bg-[var(--accent-strong)]"
            >
              {t('upload.analyze')}
            </button>
            {busy && (
              <div className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]"/>
                {t('upload.processing')}
              </div>
            )}
          </div>
          <p className="mt-3 text-xs text-[var(--text-muted)]">{t('upload.notice')}</p>
        </div>
      )}

      {/* Step 3: Done */}
      {step === 3 && (
        <div className="rounded-2xl border p-8 text-center shadow-lg border-[var(--ring)] bg-[var(--panel)]">
          <h3 className="text-xl font-semibold text-[var(--text)]">{t('upload.done.title')}</h3>
          <p className="mt-2 text-[var(--text-muted)]">{t('upload.done.subtitle')}</p>
          <a href="/overview" className="mt-4 inline-block rounded-lg bg-[var(--accent)] px-4 py-2 text-white hover:bg-[var(--accent-strong)]">
            {t('upload.goToDashboard')}
          </a>
        </div>
      )}
    </div>
  );
}
