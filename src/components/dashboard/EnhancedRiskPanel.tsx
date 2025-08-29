"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, BarChart, Bar, Tooltip, ReferenceLine, Cell } from "recharts";
import { useSimulationDrawer } from "@/store/ui";
import { useI18n } from "@/providers/I18nProvider";

type Item = { site: string; role: string; gapPercent: number; n: number };

function getSeverityColor(gap: number): string {
  if (gap >= 8) return "var(--danger)"; // red
  if (gap >= 4) return "var(--warning)"; // orange
  return "var(--success)"; // green
}

function getSeverityLabel(gap: number): string {
  if (gap >= 8) return "High";
  if (gap >= 4) return "Medium";
  return "Low";
}

export default function EnhancedRiskPanel({ items }: { items?: Item[] }) {
  const { t: translate } = useI18n();
  const { setOpen, setDefaults } = useSimulationDrawer();
  const [mode, setMode] = useState<"list" | "bars">("bars");
  
  const roles = ["Engineer", "PM", "Sales", "Design", "Ops"];
  const sites = ["Stockholm", "Göteborg", "Malmö", "Uppsala", "Västerås"];

  const data: Item[] = useMemo(() => {
    if (items) return items;
    const d: Item[] = [];
    for (const s of sites) {
      for (const r of roles) {
        d.push({ 
          site: s, 
          role: r, 
          gapPercent: Number((Math.random() * 10).toFixed(1)), 
          n: 20 + Math.floor(Math.random() * 80) 
        });
      }
    }
    return d;
  }, [items]);

  const top = useMemo(() => [...data].sort((a, b) => b.gapPercent - a.gapPercent).slice(0, 6), [data]);

  return (
    <div className="p-6 rounded-xl shadow-md border border-[var(--ring)] bg-[var(--card)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)]">Risk by Department</h3>
          <p className="text-sm text-[var(--text-muted)]">Top 6 highest gaps</p>
        </div>
        <div className="inline-flex rounded-md border overflow-hidden border-[var(--ring)]">
          <button
            aria-pressed={mode === 'bars'}
            className={`px-3 py-1.5 text-xs transition ${
              mode === 'bars'
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-muted)] hover:bg-[var(--neutral-soft-bg)]'
            }`}
            onClick={() => setMode('bars')}
          >
            {translate('common.bars')}
          </button>
          <button
            aria-pressed={mode === 'list'}
            className={`px-3 py-1.5 text-xs transition border-l border-[var(--ring)] ${
              mode === 'list'
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-muted)] hover:bg-[var(--neutral-soft-bg)]'
            }`}
            onClick={() => setMode('list')}
          >
            {translate('common.list')}
          </button>
        </div>
      </div>

      {mode === 'list' && (
        <div className="h-72">
          <div className="h-full overflow-auto">
            <ul className="space-y-3">
              {top.map((t, i) => (
                <li key={`${t.site}-${t.role}`} className="flex items-center justify-between rounded-lg border p-3 border-[var(--ring)] hover:bg-[var(--neutral-soft-bg)] transition cursor-pointer" onClick={() => { setDefaults({ role: t.role, percent: 5 }); setOpen(true); }}>
                  <div>
                    <div className="font-medium text-[var(--text)]">{t.site} • {t.role}</div>
                    <div className="text-xs text-[var(--text-muted)]">N={t.n} employees</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                      style={{
                        background: t.gapPercent >= 8 ? 'var(--danger-soft-bg)' : t.gapPercent >= 4 ? 'var(--warning-soft-bg)' : 'var(--success-soft-bg)',
                        color: t.gapPercent >= 8 ? 'var(--danger-soft-fg)' : t.gapPercent >= 4 ? 'var(--warning-soft-fg)' : 'var(--success-soft-fg)',
                        boxShadow: `inset 0 0 0 1px ${t.gapPercent >= 8 ? 'var(--danger-soft-ring)' : t.gapPercent >= 4 ? 'var(--warning-soft-ring)' : 'var(--success-soft-ring)'}`,
                      }}
                    >
                      {getSeverityLabel(t.gapPercent)}
                    </span>
                    <span className="text-sm font-bold text-[var(--text)]">{t.gapPercent}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {mode === 'bars' && (() => {
        const rows = top.map(t => ({ 
          name: `${t.site} • ${t.role}`, 
          gap: t.gapPercent, 
          role: t.role, 
          site: t.site, 
          n: t.n,
          severity: getSeverityLabel(t.gapPercent)
        }));
        
        return (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} layout="vertical" margin={{ top: 10, right: 12, bottom: 10, left: 12 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--ring)" />
                <XAxis 
                  type="number" 
                  domain={[0, 10]} 
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                  axisLine={{ stroke: 'var(--ring)' }}
                  tickLine={{ stroke: 'var(--ring)' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120} 
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={{ stroke: 'var(--ring)' }}
                  tickLine={{ stroke: 'var(--ring)' }}
                />
                <ReferenceLine 
                  x={2} 
                  stroke="var(--success)" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: "2% goal", 
                    fill: "var(--success)", 
                    position: "insideTopRight", 
                    fontSize: 12 
                  }} 
                />
                <Tooltip 
                  formatter={(v: any, _n, p: any) => [`${v}% (N=${p.payload.n})`, p.payload.name]}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--ring)',
                    borderRadius: '8px',
                    color: 'var(--text)'
                  }}
                />
                <Bar 
                  dataKey="gap" 
                  radius={6} 
                  onClick={(_, i) => { 
                    const r = rows[i]; 
                    setDefaults({ role: r.role, percent: 5 }); 
                    setOpen(true); 
                  }}
                >
                  {rows.map((r, i) => (
                    <Cell key={`cell-${i}`} fill={getSeverityColor(r.gap)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      })()}
    </div>
  );
}
