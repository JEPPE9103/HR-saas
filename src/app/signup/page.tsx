"use client";

import { useRouter } from "next/navigation";
import { getAuthClient, firebaseDb as dbFactory } from "@/lib/firebase/client";
import { doc, getDoc, getDocs, query, where, collection } from "firebase/firestore";

export default function SignupPage() {
  const router = useRouter();
  const auth = getAuthClient();
  const db = dbFactory();
  async function routePostLogin(){
    const u = auth.currentUser;
    if (!u) {
      await new Promise<void>((resolve) => {
        const unsub = auth.onAuthStateChanged((usr) => { if (usr) { unsub(); resolve(); } });
      });
    }
    const userNow = auth.currentUser!;
    const uref = doc(db, "users", userNow.uid);
    const us = await getDoc(uref);
    const companyId = (us.data() as any)?.companyId as string | undefined;
    if (!companyId){ router.push("/onboarding"); return; }
    const ds = await getDocs(query(collection(db, "datasets"), where("companyId", "==", companyId)));
    router.push(ds.empty ? "/onboarding" : "/dashboard");
  }
  return (
    <main className="container py-20 md:py-24">
      <section className="card p-10 max-w-md mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">Create account</h1>
        <a className="btn btn-ghost" aria-label="Sign up with Google" href="/login">Continue with Google</a>
      </section>
    </main>
  );
}


