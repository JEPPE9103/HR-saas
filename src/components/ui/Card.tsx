"use client";

import { HTMLAttributes } from "react";
import { clsx } from "clsx";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({ title, children, footer }: CardProps) {
  return (
    <section className="mt-6 rounded-xl border border-[var(--ring)] bg-[var(--card)]">
      {title && <header className="border-b border-[var(--ring)] px-6 py-4 text-base font-semibold text-[var(--text)]">{title}</header>}
      <div className="px-6 py-6">{children}</div>
      {footer && <footer className="border-t border-[var(--ring)] px-6 py-4">{footer}</footer>}
    </section>
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


