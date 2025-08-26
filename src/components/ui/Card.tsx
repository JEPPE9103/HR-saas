import { clsx } from "clsx";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        // Premium glass default to match app design
        "rounded-2xl border border-white/10 bg-white/5 shadow-lg text-slate-200",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("px-8 py-6 border-b border-white/10 text-slate-200", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={clsx("text-base font-semibold text-slate-200", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("p-8 text-slate-300", className)} {...props} />;
}


