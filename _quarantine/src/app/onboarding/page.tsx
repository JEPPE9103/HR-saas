"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { firebaseDb as dbFactory } from "@/lib/firebase/client";
import { companiesRef, datasetsRef } from "@/lib/models";
import { addDoc, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export default function OnboardingPage(){
  const db = dbFactory();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("SE");
  const stepBRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [user, loading, router]);

  async function createCompany(){
    if (!user) return;
    const docRef = await addDoc(companiesRef(db), {
      name: companyName || "My Company",
      country,
      plan: "free",
      createdAt: Date.now(),
      createdBy: user.uid,
      members: [user.uid],
    });
    // Ensure user doc exists; merge companyId to avoid "No document to update" errors
    await setDoc(doc(db, "users", user.uid), { companyId: docRef.id }, { merge: true });
    stepBRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function useDemo(){
    if (!user) return;
    const uref = doc(db, "users", user.uid);
    const us = await getDoc(uref);
    const companyId = (us.data() as any)?.companyId as string | undefined;
    if (!companyId) return;
    await addDoc(datasetsRef(db), {
      companyId,
      label: "Demo dataset",
      rowCount: 120,
      status: "ready",
      createdAt: Date.now(),
      createdBy: user.uid,
      source: "demo",
    } as any);
    router.push("/dashboard");
  }

  return (
    <main className="container py-12 md:py-16 space-y-8">
      <section className="card p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text)]">Create your organization account</h1>
        <div className="mt-4 space-y-4">
          <h2 className="text-base font-semibold text-[var(--text)]">Step 1 — Organization Information</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-600">Company name</label>
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm text-[var(--text)] border-[var(--ring)] bg-[var(--panel)] placeholder-slate-400"
                placeholder="Company name"
                value={companyName}
                onChange={(e)=>setCompanyName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Country</label>
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm text-[var(--text)] border-[var(--ring)] bg-[var(--panel)] placeholder-slate-400"
                placeholder="Country (e.g., SE)"
                value={country}
                onChange={(e)=>setCountry(e.target.value)}
              />
            </div>
          </div>
          <button className="btn btn-primary" onClick={createCompany}>Create company</button>
        </div>
      </section>

      <section ref={stepBRef} className="card p-8 max-w-2xl mx-auto">
        <h2 className="text-base font-semibold text-[var(--text)]">Step 2 — Dataset</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <a href="/import" className="card p-6 text-center">
            <div className="text-sm font-semibold text-[var(--text)]">Upload CSV now</div>
            <div className="text-xs text-slate-500">Go to import</div>
          </a>
          <button className="card p-6 text-center" onClick={useDemo}>
            <div className="text-sm font-semibold text-[var(--text)]">Use demo dataset</div>
            <div className="text-xs text-slate-500">Create demo and open dashboard</div>
          </button>
        </div>
      </section>
    </main>
  );
}


