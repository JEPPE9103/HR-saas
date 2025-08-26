"use client";

import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-9 px-4 py-2";
    const styles = {
      primary: "bg-[var(--accent)] text-white hover:brightness-95 dark:bg-[var(--accent)] dark:hover:bg-[var(--accent-strong)] focus-visible:ring-[var(--accent)]",
      secondary: "bg-white text-[var(--text)] hover:bg-slate-50 border border-[var(--ring)] dark:bg-[#0f172a] dark:text-slate-200 dark:hover:bg-slate-900 dark:border-[var(--ring)] focus-visible:ring-[var(--ring)]",
      ghost: "bg-white text-[var(--text)] hover:bg-slate-50 border border-[var(--ring)] dark:bg-[#0f172a] dark:text-slate-200 dark:hover:bg-slate-900 dark:border-[var(--ring)] focus-visible:ring-[var(--ring)]",
    } as const;
    return (
      <button ref={ref} className={clsx(base, styles[variant], className)} {...props} />
    );
  }
);

Button.displayName = "Button";


