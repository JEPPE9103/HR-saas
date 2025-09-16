"use client";

type Cell = { department: string; risk: number };

export function DepartmentHeatmap({ data }: { data: Cell[] }) {
  const color = (risk: number) => {
    // 0 green to 1 red
    const r = Math.round(255 * risk);
    const g = Math.round(200 * (1 - risk));
    return `rgb(${r}, ${g}, 120)`;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {data.map((c) => (
        <div key={c.department} className="rounded-xl p-3 border border-slate-200">
          <div className="text-xs text-slate-600 mb-2">{c.department}</div>
          <div className="h-12 rounded-lg" style={{ backgroundColor: color(c.risk) }} />
          <div className="mt-2 text-xs text-slate-700 font-medium">{Math.round(c.risk * 100)}%</div>
        </div>
      ))}
    </div>
  );
}


