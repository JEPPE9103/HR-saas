import { clsx } from "clsx";

export function Skeleton({ className }: { className?: string }){
  return <div className={clsx("animate-pulse rounded-md bg-slate-200", className)} />;
}


