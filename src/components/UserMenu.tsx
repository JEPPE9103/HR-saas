"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export function UserMenu(){
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link className="text-slate-300 hover:text-white" href="/login">Sign in</Link>
        <Link className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-800" href="/signup">Sign up</Link>
      </div>
    );
  }

  const name = user.displayName ?? user.email ?? "User";
  const avatar = user.photoURL;

  return (
    <div className="flex items-center gap-3">
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt="" className="h-7 w-7 rounded-full ring-1 ring-slate-200 dark:ring-slate-700" />
      ) : (
        <div className="h-7 w-7 rounded-full bg-sky-600 text-white grid place-items-center text-xs">{name[0]?.toUpperCase()}</div>
      )}
      <span className="text-sm text-slate-700 dark:text-slate-300 hidden sm:inline">{name}</span>
      <button className="btn btn-ghost" onClick={signOut}>Sign out</button>
    </div>
  );
}


