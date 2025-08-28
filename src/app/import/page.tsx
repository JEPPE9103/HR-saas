"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { parseCsvFile } from "@/lib/parseCsv";
import { uploadCsvToFirebase } from "@/services/firebaseApi";
import { useDataStore } from "@/store/data";
import type { ParseError } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { DataQualityCard } from "@/components/DataQualityCard";
import { Protected } from "@/components/Protected";
import { firebaseDb as dbFactory } from "@/lib/firebase/client";
import { addDoc, doc, getDoc } from "firebase/firestore";
import { datasetsRef } from "@/lib/models";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import UploadWizard, { Mapping } from "@/components/upload/UploadWizard";
import { useI18n } from "@/providers/I18nProvider";

export default function ImportPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const db = dbFactory();
  const router = useRouter();
  const setEmployees = useDataStore((s) => s.setEmployees);
  const save = useDataStore((s) => s.saveToLocalStorage);

  const [errors, setErrors] = useState<ParseError[]>([]);
  const [imported, setImported] = useState(0);
  const [summary, setSummary] = useState<{ roles: number; departments: number } | null>(null);

  const onAnalyze = useCallback(async (file: File, _mapping: Mapping) => {
    // behåll befintlig parse + persist flow
    const { data, errors } = await parseCsvFile(file);
    setErrors(errors);
    if (errors.length === 0) {
      setEmployees(data);
      save();
      setImported(data.length);
      const roles = new Set(data.map((d) => d.role)).size;
      const departments = new Set(data.map((d) => d.department)).size;
      setSummary({ roles, departments });
      if (user) {
        try { uploadCsvToFirebase(file).catch(()=>{}); } catch {}
        const uref = doc(db, "users", user.uid);
        const us = await getDoc(uref);
        const companyId = (us.data() as any)?.companyId ?? "";
        await addDoc(datasetsRef(db), {
          companyId,
          label: `Upload – ${new Date().toISOString().slice(0,10)}`,
          rowCount: data.length,
          status: "ready",
          createdAt: Date.now(),
          createdBy: user.uid,
          source: "upload",
        } as any);
      }
    }
  }, [save, setEmployees, user]);

  return (
    <Protected>
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="rounded-3xl border p-6 shadow-xl border-[var(--ring)] bg-[var(--panel)]">
        <UploadWizard
          onAnalyze={onAnalyze}
          onUseDemo={() => (window.location.href = "/dashboard?datasetId=demo-se")}
        />
      </div>

      {/* Trust panel */}
      <div className="mt-6 rounded-2xl border p-4 text-sm border-[var(--ring)] bg-[var(--panel)] text-[var(--text)]">
        <p><strong>{t('import.trust.title')}</strong> {t('import.trust.body')}</p>
      </div>

      {/* Optional: show summary and data quality if we parsed locally */}
      {summary && (
        <div className="mt-6 card p-4">
          <div className="text-sm text-slate-600">{t('import.summary.rows')}: <strong>{imported}</strong> • {t('import.summary.roles')}: <strong>{summary.roles}
          </strong> • {t('import.summary.departments')}: <strong>{summary.departments}</strong> <Link href="/dashboard" className="ml-2 underline">{t('import.summary.open')}</Link></div>
        </div>
      )}
      {errors.length > 0 && (
        <div className="mt-4 card p-4">
          <div className="text-sm text-rose-600">{t('upload.validationErrors',).replace('{n}', String(errors.length))}</div>
        </div>
      )}
    </div>
    </Protected>
  );
}


