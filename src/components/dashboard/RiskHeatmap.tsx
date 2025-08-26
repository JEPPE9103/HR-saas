"use client";

import { useMemo } from "react";
import { useSimulationDrawer } from "@/store/ui";

type Cell = { site: string; role: string; gapPercent: number; n: number };

function colorForGap(gap: number): string {
  // Diverging: below 0 -> teal, near 0 -> gray, above -> rose
  const clamped = Math.max(-2, Math.min(10, gap));
  const t = (clamped + 2) / 12; // 0..1
  // simple interpolation between teal (0,128,128) and rose (220,38,38)
  const r = Math.round(0 + (220 - 0) * t);
  const g = Math.round(128 + (38 - 128) * t);
  const b = Math.round(128 + (38 - 128) * t);
  return `rgb(${r},${g},${b})`;
}

export default function RiskHeatmap({
  sites = ["Berlin", "Stockholm", "Copenhagen", "London", "Paris"],
  roles = ["Engineer", "PM", "Sales", "Design", "Ops"],
  data,
}: {
  sites?: string[];
  roles?: string[];
  data?: Cell[];
}) {
  const { setOpen, setDefaults } = useSimulationDrawer();

  const cells = useMemo(() => {
    // build dense grid from sparse input or demo
    const demo: Cell[] = [];
    for (const s of sites) {
      for (const r of roles) {
        demo.push({ site: s, role: r, gapPercent: Number((Math.random() * 10).toFixed(1)), n: 20 + Math.floor(Math.random() * 80) });
      }
    }
    const byKey = new Map<string, Cell>();
    (data ?? demo).forEach((c) => byKey.set(`${c.site}__${c.role}`, c));
    return { byKey };
  }, [data, sites, roles]);

  const cellSize = 20;
  const padding = 24;
  const width = padding * 2 + roles.length * cellSize;
  const height = padding * 2 + sites.length * cellSize + 18; // bottom labels

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-2 text-sm text-slate-600 dark:text-slate-400">Risk Heatmap</div>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="max-w-full">
        {roles.map((r, i) => (
          <text key={r} x={padding + i * cellSize + cellSize / 2} y={14} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10px]">{r}</text>
        ))}
        {sites.map((s, j) => (
          <text key={s} x={4} y={padding + j * cellSize + cellSize / 2 + 3} className="fill-slate-500 dark:fill-slate-400 text-[10px]">{s}</text>
        ))}
        {sites.map((s, j) => (
          roles.map((r, i) => {
            const c = cells.byKey.get(`${s}__${r}`) ?? { site: s, role: r, gapPercent: 0, n: 0 };
            const x = padding + i * cellSize;
            const y = padding + j * cellSize;
            return (
              <g key={`${s}-${r}`}>
                <rect x={x} y={y} width={cellSize - 2} height={cellSize - 2} rx={3} ry={3}
                  fill={colorForGap(c.gapPercent)} className="cursor-pointer" onClick={() => {
                    setDefaults({ role: r, percent: 5 });
                    setOpen(true);
                  }}>
                </rect>
                <title>{`${s} • ${r}: ${c.gapPercent}% (N=${c.n})`}</title>
              </g>
            );
          })
        ))}
      </svg>
      <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">Click a cell to open simulation.</div>
    </div>
  );
}


