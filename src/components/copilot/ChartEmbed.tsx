"use client";

import { PayGapTrend } from "@/components/charts/PayGapTrend";
import { RoleCompare } from "@/components/charts/RoleCompare";
import { DepartmentHeatmap } from "@/components/charts/DepartmentHeatmap";

type ChartBlock =
  | { type: 'trend'; data: { month: string; gap: number }[] }
  | { type: 'roleCompare'; data: { role: string; male: number; female: number }[] }
  | { type: 'heatmap'; data: { department: string; risk: number }[] };

export function ChartEmbed({ block }: { block: ChartBlock }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      {block.type === 'trend' && <PayGapTrend data={block.data} />}
      {block.type === 'roleCompare' && <RoleCompare data={block.data} />}
      {block.type === 'heatmap' && <DepartmentHeatmap data={block.data} />}
    </div>
  );
}


