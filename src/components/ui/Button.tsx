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
      primary: "bg-slate-600 text-white hover:bg-slate-700 focus-visible:ring-slate-600",
      secondary: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 focus-visible:ring-slate-300",
      ghost: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 focus-visible:ring-slate-300",
    } as const;
    return (
      <button ref={ref} className={clsx(base, styles[variant], className)} {...props} />
    );
  }
);

Button.displayName = "Button";


