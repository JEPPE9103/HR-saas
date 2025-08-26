"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export function Protected({ children }: { children: React.ReactNode }){
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return <div className="p-6 text-sm text-slate-500">Loading…</div>;
  if (!user) return null;
  return <>{children}</>;
}


