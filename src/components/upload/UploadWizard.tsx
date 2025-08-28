"use client";

import { useState, useRef } from "react";
import { UploadCloud, ShieldCheck, FileSpreadsheet, Check, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { useI18n } from "@/providers/I18nProvider";

export type Mapping = {
  gender?: string;
  role?: string;
  dept?: string;
  site?: string;
  country?: string;
  basePay?: string;
};

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function onDrop(f: File) {
    setFile(f);
    setError(null);
    const reader = new FileReader();
    // Support CSV and XLSX by sniffing extension
    const name = f.name.toLowerCase();
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      reader.onload = () => {
        const data = new Uint8Array(reader.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const header = XLSX.utils.sheet_to_json(ws, { header: 1, range: 0, raw: false })[0] as string[] | undefined;
        const cols = (header || []).map((c) => String(c).trim()).filter(Boolean);
        setColumns(cols);
        setStep(2);
      };
      reader.readAsArrayBuffer(f);
    } else {
      reader.onload = () => {
        const text = String(reader.result || "");
        const header = text.split(/\r?\n/)[0] || "";
        const cols = header
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);
        setColumns(cols);
        setStep(2);
      };
      reader.readAsText(f);
    }
  }

  async function handleAnalyze() {
    if (!file) return;
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

  const req = ["gender", "role", "dept", "basePay"] as const;
  const allMapped = req.every((k) => (mapping as any)[k]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">{t('upload.title')}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('upload.subtitle')}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-[var(--success-soft-ring)]"><ShieldCheck className="h-3 w-3"/> {t('upload.badge.gdpr')}</span>
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-[var(--success-soft-ring)]">{t('upload.badge.euReady')}</span>
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-[var(--success-soft-ring)]">{t('upload.badge.iso')}</span>
        </div>
      </div>

      {/* Stepper */}
      <ol className="grid grid-cols-3 gap-3 text-sm">
        {[t('upload.step.upload'), t('upload.step.map'), t('upload.step.analyze')].map((label, i) => (
          <li
            key={label}
            className={`rounded-lg px-3 py-2 ring-1 ${
              step > i + 1
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-[var(--panel)] ring-[var(--ring)] text-[var(--text)]"
            } flex items-center gap-2`}
          >
            {step > i + 1 ? (
              <Check className="h-4 w-4" />
            ) : (
              <span className="h-5 w-5 inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-700">{i + 1}</span>
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
            <UploadCloud className="mx-auto h-10 w-10 text-indigo-600" />
            <p className="mt-3 text-[var(--text)]">{t('upload.drop.hint')}</p>
            <p className="text-xs text-slate-500">{t('upload.drop.or')}</p>
            <button
              onClick={() => inputRef.current?.click()}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
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
              <button onClick={onUseDemo} className="text-teal-700 hover:text-teal-800 text-sm underline">
                {t('upload.tryDemo')}
              </button>
            </div>
          </div>
          {error && (
            <p className="mt-3 inline-flex items-center gap-2 text-rose-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}
        </div>
      )}

      {/* Step 2: Mapping */}
      {step === 2 && (
        <div className="rounded-2xl border p-6 shadow-lg border-[var(--ring)] bg-[var(--panel)]">
          <h3 className="mb-4 font-medium text-[var(--text)]">{t('upload.map.title')}</h3>
          {columns.length === 0 ? (
            <p className="text-sm text-slate-500">{t('upload.noColumns')}</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { key: "gender", label: t('upload.field.gender') },
                { key: "role", label: t('upload.field.role') },
                { key: "dept", label: t('upload.field.dept') },
                { key: "site", label: t('upload.field.site') },
                { key: "country", label: t('upload.field.country') },
                { key: "basePay", label: t('upload.field.basePay') },
              ].map((f) => (
                <label key={f.key} className="text-sm">
                  <div className="mb-1 text-slate-600">{f.label}</div>
                  <select
                    className="w-full rounded-lg border px-3 py-2 text-[var(--text)] border-[var(--ring)] bg-[var(--panel)]"
                    value={(mapping as any)[f.key] ?? ""}
                    onChange={(e) => setMapping((m) => ({ ...m, [f.key]: e.target.value }))}
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
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white disabled:opacity-50 hover:bg-teal-700"
            >
              {t('upload.analyze')}
            </button>
            {busy && (
              <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-indigo-400"/>
                {t('upload.processing')}
              </div>
            )}
            <button onClick={() => setStep(1)} className="text-slate-600 hover:text-slate-800">
              {t('upload.back')}
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500">{t('upload.notice')}</p>
        </div>
      )}

      {/* Step 3: Done */}
      {step === 3 && (
        <div className="rounded-2xl border p-8 text-center shadow-lg border-[var(--ring)] bg-[var(--panel)]">
          <h3 className="text-xl font-semibold text-[var(--text)]">{t('upload.done.title')}</h3>
          <p className="mt-2 text-slate-600">{t('upload.done.subtitle')}</p>
          <a href="/dashboard" className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
            {t('upload.goToDashboard')}
          </a>
        </div>
      )}
    </div>
  );
}


