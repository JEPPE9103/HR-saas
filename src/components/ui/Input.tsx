"use client";

import { clsx } from "clsx";
import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "w-full rounded-xl border border-[var(--ring)] bg-white px-3 py-2 text-sm text-[var(--text)] shadow-sm outline-none transition placeholder:text-slate-400",
        "focus:ring-2 focus:ring-[var(--accent)] dark:bg-[#0f172a] dark:text-slate-200",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";


