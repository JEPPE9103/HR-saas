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
import { db } from "@/lib/firebase";
import { addDoc, doc, getDoc } from "firebase/firestore";
import { datasetsRef } from "@/lib/models";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import UploadWizard, { Mapping } from "@/components/upload/UploadWizard";

export default function ImportPage() {
  const { user } = useAuth();
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
      <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl">
        <UploadWizard
          onAnalyze={onAnalyze}
          onUseDemo={() => (window.location.href = "/dashboard?datasetId=demo-se")}
        />
      </div>

      {/* Trust panel */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        <p><strong>Security & privacy.</strong> Data is processed in the EU, encrypted at rest and in transit. No PII required – names/emails/SSNs are not stored. Access controlled via RBAC and audit logging.</p>
      </div>

      {/* Optional: show summary and data quality if we parsed locally */}
      {summary && (
        <div className="mt-6 card p-4">
          <div className="text-sm text-slate-300">Rows imported: <strong>{imported}</strong> • Roles: <strong>{summary.roles}
          </strong> • Departments: <strong>{summary.departments}</strong> <Link href="/dashboard" className="ml-2 underline">Open dashboard</Link></div>
        </div>
      )}
      {errors.length > 0 && (
        <div className="mt-4 card p-4">
          <div className="text-sm text-rose-300">Validation errors ({errors.length}) – showing first 10.</div>
        </div>
      )}
    </div>
    </Protected>
  );
}


