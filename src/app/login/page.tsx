"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthClient, googleProvider, firebaseDb as dbFactory } from "@/lib/firebase/client";
import { signInWithPopup, signInWithRedirect, getRedirectResult, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getDocs, query, where, collection } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const db = dbFactory();
  const [loading, setLoading] = useState<null | "google" | "email">(null);
  const [err, setErr] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin"|"signup">("signin");

  const auth = getAuthClient();
  useEffect(() => { getRedirectResult(auth).catch(()=>{}); }, [auth]);
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
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text)]">Sign in</h1>
        {err && (<div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm">{err}</div>)}
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="rounded-md border px-3 py-2 bg-transparent" />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="rounded-md border px-3 py-2 bg-transparent" />
        <button className="btn btn-ghost" aria-label="Continue with Email" disabled={!!loading} onClick={async()=>{
          setErr(null); setLoading("email");
          try{
            if(mode==="signin"){ await signInWithEmailAndPassword(auth, email, password); }
            else { await createUserWithEmailAndPassword(auth, email, password); }
            await routePostLogin();
          }catch(e:any){ setErr(e?.message ?? "Sign-in failed"); }
          finally{ setLoading(null); }
        }}>{loading==="email" ? (mode==="signin"?"Signing in…":"Creating account…") : (mode==="signin"?"Continue with Email":"Create account")}</button>
        <button type="button" onClick={()=> setMode(m=> m==="signin"?"signup":"signin") } className="text-xs underline opacity-80 text-left">
          {mode==="signin"?"No account? Create one":"Have an account? Sign in"}
        </button>
        <button className="btn btn-ghost" aria-label="Sign in with Google" disabled={!!loading} onClick={async()=>{
          setErr(null); setLoading("google");
          try{
            await signInWithPopup(auth, googleProvider);
            await routePostLogin();
          }catch(e:any){
            const code = e?.code ?? "";
            if(code.includes("popup")){
              try{ await signInWithRedirect(auth, googleProvider); }catch(e2:any){ setErr(e2?.message ?? "Sign-in failed"); }
            }else{ setErr(e?.message ?? "Sign-in failed"); }
          }finally{ setLoading(null); }
        }}>{loading==="google"?"Signing in with Google…":"Continue with Google"}</button>
        <p className="text-xs text-muted-foreground">If popup closes instantly, ensure this domain is added in Firebase → Authentication → Authorized domains.</p>
      </section>
    </main>
  );
}


