"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { CheckCircle2 } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--ring)] bg-[var(--panel)]/90 backdrop-blur shadow-sm">
      <div className="px-4 h-14 w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--primary-foreground)]">+</div>
          <div className="text-lg font-semibold tracking-tight">
            <span className="text-[var(--text)]">Pay</span>
            <span className="subtle">Transparency</span>
          </div>
          <span className="ml-3 hidden sm:inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-[var(--success-soft-ring)]">
            <CheckCircle2 className="h-3.5 w-3.5" /> EU Directive Ready
          </span>
        </div>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="px-2 py-1 rounded-md text-[var(--text)]/80 hover:text-[var(--text)] hover:bg-slate-50">Hem</Link>
          <Link href="/overview" className="px-2 py-1 rounded-md text-[var(--text)]/80 hover:text-[var(--text)] hover:bg-slate-50">Översikt</Link>
          <Link href="/import" className="px-2 py-1 rounded-md text-[var(--text)]/80 hover:text-[var(--text)] hover:bg-slate-50">Importera</Link>
          <LanguageToggle />
          <ThemeToggle />
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}


