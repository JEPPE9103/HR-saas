export default function SeverityBadge({ level }: { level: "High"|"Medium"|"Low" }) {
  const map: any = {
    High:   "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/30",
    Medium: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/30",
    Low:    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs ring-1 ${map[level]}`}>{level}</span>;
}


