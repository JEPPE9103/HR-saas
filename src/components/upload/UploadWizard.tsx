"use client";

import { useState, useRef } from "react";
import { UploadCloud, ShieldCheck, FileSpreadsheet, Check, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";

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
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Upload employee data</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Upload a CSV/Excel export from your HR system. Data is encrypted and processed in the EU.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/10 text-emerald-300 px-2 py-0.5 ring-1 ring-emerald-300/30"><ShieldCheck className="h-3 w-3"/> GDPR safe</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100/10 text-indigo-300 px-2 py-0.5 ring-1 ring-indigo-300/30">EU directive ready</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-100/10 text-teal-300 px-2 py-0.5 ring-1 ring-teal-300/30">ISO 27001</span>
        </div>
      </div>

      {/* Stepper */}
      <ol className="grid grid-cols-3 gap-3 text-sm">
        {["Upload", "Map columns", "Analyze"].map((label, i) => (
          <li
            key={label}
            className={`rounded-lg px-3 py-2 ring-1 ${
              step > i + 1
                ? "bg-emerald-50/10 ring-emerald-300/30 text-emerald-200"
                : "bg-white/5 ring-white/10 text-slate-200"
            } flex items-center gap-2`}
          >
            {step > i + 1 ? (
              <Check className="h-4 w-4" />
            ) : (
              <span className="h-5 w-5 inline-flex items-center justify-center rounded-full bg-white/10">{i + 1}</span>
            )}
            {label}
          </li>
        ))}
      </ol>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
          <div
            className="rounded-xl border-2 border-dashed border-white/20 bg-slate-900/30 p-10 text-center hover:border-indigo-400/40 transition"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) onDrop(e.dataTransfer.files[0]);
            }}
          >
            <UploadCloud className="mx-auto h-10 w-10 text-indigo-300" />
            <p className="mt-3 text-slate-200">Drag & drop your .csv here</p>
            <p className="text-xs text-slate-400">or</p>
            <button
              onClick={() => inputRef.current?.click()}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              <FileSpreadsheet className="h-4 w-4" /> Select file
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
              <button onClick={onUseDemo} className="text-teal-300 hover:text-teal-200 text-sm underline">
                Or try the demo dataset
              </button>
            </div>
          </div>
          {error && (
            <p className="mt-3 inline-flex items-center gap-2 text-rose-300 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}
        </div>
      )}

      {/* Step 2: Mapping */}
      {step === 2 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
          <h3 className="mb-4 font-medium text-white">Map columns</h3>
          {columns.length === 0 ? (
            <p className="text-sm text-slate-400">No columns detected. Please upload a CSV with a header row.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { key: "gender", label: "Gender" },
                { key: "role", label: "Role" },
                { key: "dept", label: "Department" },
                { key: "site", label: "Site (optional)" },
                { key: "country", label: "Country (optional)" },
                { key: "basePay", label: "Base pay" },
              ].map((f) => (
                <label key={f.key} className="text-sm">
                  <div className="mb-1 text-slate-300">{f.label}</div>
                  <select
                    className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-slate-100"
                    value={(mapping as any)[f.key] ?? ""}
                    onChange={(e) => setMapping((m) => ({ ...m, [f.key]: e.target.value }))}
                  >
                    <option value="">Select column…</option>
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
              Analyze dataset
            </button>
            {busy && (
              <div className="inline-flex items-center gap-2 text-xs text-slate-300">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-indigo-400"/>
                Processing…
              </div>
            )}
            <button onClick={() => setStep(1)} className="text-slate-300 hover:text-white">
              Back
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            We never store names or emails. Only anonymized employee IDs are used. Minimum group size N≥10 enforced.
          </p>
        </div>
      )}

      {/* Step 3: Done */}
      {step === 3 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-lg">
          <h3 className="text-xl font-semibold text-white">Insights generated</h3>
          <p className="mt-2 text-slate-300">Your dashboard is ready.</p>
          <a href="/dashboard" className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
            Go to Dashboard
          </a>
        </div>
      )}
    </div>
  );
}


