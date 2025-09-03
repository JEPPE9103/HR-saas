"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export function UserMenu(){
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link className="text-slate-700 hover:text-slate-900 transition-colors duration-200" href="/login">Sign in</Link>
        <Link className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 transition-colors duration-200" href="/signup">Sign up</Link>
      </div>
    );
  }

  const name = user.displayName ?? user.email ?? "User";
  const avatar = user.photoURL;

  return (
    <div className="flex items-center gap-3">
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt="" className="h-7 w-7 rounded-full ring-1 ring-slate-200" />
      ) : (
        <div className="h-7 w-7 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 text-white grid place-items-center text-xs font-medium">{name[0]?.toUpperCase()}</div>
      )}
      <span className="text-sm text-slate-700 hidden sm:inline">{name}</span>
      <button 
        className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors duration-200" 
        onClick={signOut}
      >
        Sign out
      </button>
    </div>
  );
}


