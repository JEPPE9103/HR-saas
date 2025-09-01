"use client";

import { useState, useRef } from "react";
import { UploadCloud, ShieldCheck, FileSpreadsheet, Check, AlertCircle, ArrowLeft, Lock, Users, Info } from "lucide-react";
import * as XLSX from "xlsx";
import { useI18n } from "@/providers/I18nProvider";
import { z } from "zod";

// Zod schema for validation
const mappingSchema = z.object({
  gender: z.string().min(1, "Gender column is required"),
  role: z.string().min(1, "Role column is required"),
  basePay: z.string().min(1, "Base pay column is required"),
  dept: z.string().optional(),
  site: z.string().optional(),
  country: z.string().optional(),
});

export type Mapping = {
  gender?: string;
  role?: string;
  dept?: string;
  site?: string;
  country?: string;
  basePay?: string;
};

type PreviewRow = Record<string, string | number>;

export default function UploadWizard({
  onAnalyze,
  onUseDemo,
}: {
  onAnalyze: (file: File, mapping: Mapping) => Promise<void>;
  onUseDemo: () => void;
}) {
  const { t } = useI18n();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Mapping>({});
  const [previewData, setPreviewData] = useState<PreviewRow[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
        const jsonData = XLSX.utils.sheet_to_json(ws, { raw: false });
        const header = XLSX.utils.sheet_to_json(ws, { header: 1, range: 0, raw: false })[0] as string[] | undefined;
        const cols = (header || []).map((c) => String(c).trim()).filter(Boolean);
        setColumns(cols);
        setPreviewData(jsonData.slice(0, 10) as PreviewRow[]);
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
        
        setColumns(cols);
        setPreviewData(previewRows);
        setStep(2);
      };
      reader.readAsText(f);
    }
  }

  function validateMapping(): boolean {
    try {
      mappingSchema.parse(mapping);
      setValidationError(null);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessage = (err as any).errors?.map((e: any) => e.message)?.join(", ") || "Validation failed";
        setValidationError(errorMessage);
      }
      return false;
    }
  }

  async function handleAnalyze() {
    if (!file) return;
    
    if (!validateMapping()) {
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

  const req = ["gender", "role", "basePay"] as const;
  const allMapped = req.every((k) => (mapping as any)[k]);

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
            <span className="text-sm font-medium text-[var(--text)]">Your data is secure</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3 text-[var(--success)]" />
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
              <Check className="h-4 w-4" />
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
            <div className="mt-4">
              <button onClick={onUseDemo} className="text-[var(--accent)] hover:text-[var(--accent-strong)] text-sm underline">
                {t('upload.tryDemo')}
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
              Back
            </button>
            <h3 className="font-medium text-[var(--text)]">{t('upload.map.title')}</h3>
          </div>

          {/* File Preview */}
          {previewData.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-[var(--text)] mb-3">File Preview (first 10 rows)</h4>
              <div className="overflow-x-auto rounded-lg border border-[var(--ring)]">
                <table className="w-full text-xs">
                  <thead className="bg-[var(--neutral-soft-bg)]">
                    <tr>
                      {columns.map((col) => (
                        <th key={col} className="px-3 py-2 text-left text-[var(--text)] font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="border-t border-[var(--ring)]">
                        {columns.map((col) => (
                          <td key={col} className="px-3 py-2 text-[var(--text-muted)]">
                            {String(row[col] || "").slice(0, 20)}
                            {String(row[col] || "").length > 20 ? "..." : ""}
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

          {columns.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">{t('upload.noColumns')}</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { key: "gender", label: t('upload.field.gender'), required: true },
                { key: "role", label: t('upload.field.role'), required: true },
                { key: "dept", label: t('upload.field.dept'), required: false },
                { key: "site", label: t('upload.field.site'), required: false },
                { key: "country", label: t('upload.field.country'), required: false },
                { key: "basePay", label: t('upload.field.basePay'), required: true },
              ].map((f) => (
                <label key={f.key} className="text-sm">
                  <div className="mb-1 text-[var(--text)]">
                    {f.label}
                    {f.required && <span className="text-[var(--danger)] ml-1">*</span>}
                  </div>
                  <select
                    className={`w-full rounded-lg border px-3 py-2 text-[var(--text)] border-[var(--ring)] bg-[var(--panel)] ${
                      f.required && !(mapping as any)[f.key] ? 'border-[var(--danger-soft-ring)]' : ''
                    }`}
                    value={(mapping as any)[f.key] ?? ""}
                    onChange={(e) => {
                      setMapping((m) => ({ ...m, [f.key]: e.target.value }));
                      setValidationError(null);
                    }}
                  >
                    <option value="">{t('upload.selectColumn')}</option>
                    {columns.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
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


