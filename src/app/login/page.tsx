"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/providers/I18nProvider";
import { getAuthClient, googleProvider, firebaseDb as dbFactory } from "@/lib/firebase/client";
import { signInWithPopup, signInWithRedirect, getRedirectResult, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getDocs, query, where, collection } from "firebase/firestore";

export default function LoginPage() {
  const { t } = useI18n();
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
    router.push(ds.empty ? "/overview" : "/overview");
  }
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        {/* Header - 2026 Modern Design */}
        <div className="relative overflow-hidden text-center mb-20">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10" />
          <div className="absolute top-10 left-20 w-64 h-64 bg-gradient-to-br from-mint-200/30 to-teal-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-gradient-to-br from-coral-200/20 to-rose-300/15 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h1 className="text-6xl font-light text-slate-800 mb-8 leading-tight tracking-tight">
              {mode === "signin" ? t('login.signin') : t('login.signup')}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
              {t('login.subtitle')}
            </p>
          </div>
        </div>

        {/* Login Form - 2026 Modern Design */}
        <div className="max-w-md mx-auto">
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-3xl p-10 hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mint-200/20 to-teal-300/10 rounded-full blur-2xl" />
            
            <div className="relative z-10 space-y-6">
              {err && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {err}
                </div>
              )}
              
              <div className="space-y-4">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder={t('login.email')} 
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 bg-white/80 backdrop-blur-sm focus:border-slate-400 focus:outline-none transition-colors duration-200" 
                />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder={t('login.password')} 
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 bg-white/80 backdrop-blur-sm focus:border-slate-400 focus:outline-none transition-colors duration-200" 
                />
              </div>
              
              <button 
                className="w-full rounded-2xl bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white px-4 py-3 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" 
                aria-label="Continue with Email" 
                disabled={!!loading} 
                onClick={async() => {
                  setErr(null); 
                  setLoading("email");
                  try{
                    if(mode === "signin"){ 
                      await signInWithEmailAndPassword(auth, email, password); 
                    } else { 
                      await createUserWithEmailAndPassword(auth, email, password); 
                    }
                    await routePostLogin();
                  } catch(e: any){ 
                    setErr(e?.message ?? t('login.signinFailed')); 
                  } finally{ 
                    setLoading(null); 
                  }
                }}
              >
                {loading === "email" ? (mode === "signin" ? t('login.signinLoading') : t('login.signupLoading')) : (mode === "signin" ? t('login.signinEmail') : t('login.createAccount'))}
              </button>
              
              <button 
                type="button" 
                onClick={() => setMode(m => m === "signin" ? "signup" : "signin")} 
                className="w-full text-sm underline opacity-80 text-slate-600 hover:text-slate-800 transition-colors duration-200"
              >
                {mode === "signin" ? t('login.noAccount') : t('login.hasAccount')}
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">{t('login.or')}</span>
                </div>
              </div>
              
              <button 
                className="w-full rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-slate-300 text-slate-700 px-4 py-3 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" 
                aria-label="Sign in with Google" 
                disabled={!!loading} 
                onClick={async() => {
                  setErr(null); 
                  setLoading("google");
                  try{
                    await signInWithPopup(auth, googleProvider);
                    await routePostLogin();
                  } catch(e: any){
                    const code = e?.code ?? "";
                    if(code.includes("popup")){
                      try{ 
                        await signInWithRedirect(auth, googleProvider); 
                      } catch(e2: any){ 
                        setErr(e2?.message ?? t('login.signinFailed')); 
                      }
                    } else{ 
                      setErr(e?.message ?? t('login.signinFailed')); 
                    }
                  } finally{ 
                    setLoading(null); 
                  }
                }}
              >
                {loading === "google" ? t('login.googleLoading') : t('login.continueGoogle')}
              </button>
              
              <p className="text-xs text-slate-500 text-center">
                {t('login.popupNote')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


