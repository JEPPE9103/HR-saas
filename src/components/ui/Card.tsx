import { clsx } from "clsx";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        // Theme-aware card
        "rounded-2xl border shadow-lg",
        "border-[var(--ring)] bg-[var(--panel)] text-[var(--text)]",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("px-8 py-6 border-b", "border-[var(--ring)] text-[var(--text)]", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={clsx("text-base font-semibold", "text-[var(--text)]", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("p-8", "text-[var(--text)]", className)} {...props} />;
}


