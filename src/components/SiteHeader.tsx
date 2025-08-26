"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { CheckCircle2 } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-neutral-900/80">
      <div className="px-4 h-14 w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white">+</div>
          <div className="text-lg font-semibold tracking-tight">
            <span className="text-slate-900 dark:text-neutral-100">Pay</span>
            <span className="text-slate-700 dark:text-neutral-300">Transparency</span>
          </div>
          <span className="ml-3 hidden sm:inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900">
            <CheckCircle2 className="h-3.5 w-3.5" /> EU Directive Ready
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/import" className="hover:underline">Import</Link>
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}


