"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, getDocs, query, where, collection } from "firebase/firestore";

export default function LoginPage() {
  const { signInGoogle, signInMicrosoft } = useAuth();
  const router = useRouter();
  async function routePostLogin(){
    // Wait until Firebase sets currentUser
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
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white">Sign in</h1>
        <button className="btn btn-ghost" aria-label="Sign in with Google" onClick={async()=>{
          await signInGoogle();
          await routePostLogin();
        }}>Continue with Google</button>
        <button className="btn btn-ghost" aria-label="Sign in with Microsoft" onClick={async()=>{
          await signInMicrosoft();
          await routePostLogin();
        }}>Continue with Microsoft</button>
      </section>
    </main>
  );
}


