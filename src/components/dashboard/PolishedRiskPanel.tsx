"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, BarChart, Bar, Tooltip, ReferenceLine, Cell } from "recharts";
import { useSimulationDrawer } from "@/store/ui";
import { useI18n } from "@/providers/I18nProvider";
import { BarChart3, List } from "lucide-react";

type Item = { site: string; role: string; gapPercent: number; n: number };

function getSeverityColor(gap: number): string {
  if (gap > 8) return "var(--danger)"; // red
  if (gap >= 5) return "var(--warning)"; // orange
  if (gap >= 2) return "var(--caution)"; // yellow
  return "var(--success)"; // green
}

function getSeverityLabel(gap: number): string {
  if (gap > 8) return "High";
  if (gap >= 5) return "Medium";
  if (gap >= 2) return "Low";
  return "Safe";
}

function getSeverityPillColor(gap: number): string {
  if (gap > 8) return "bg-[var(--danger-soft-bg)] text-[var(--danger-soft-fg)] ring-[var(--danger-soft-ring)]";
  if (gap >= 5) return "bg-[var(--warning-soft-bg)] text-[var(--warning-soft-fg)] ring-[var(--warning-soft-ring)]";
  if (gap >= 2) return "bg-[var(--caution-soft-bg)] text-[var(--caution-soft-fg)] ring-[var(--caution-soft-ring)]";
  return "bg-[var(--success-soft-bg)] text-[var(--success-soft-fg)] ring-[var(--success-soft-ring)]";
}

export default function PolishedRiskPanel({ items }: { items?: Item[] }) {
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
    <div className="p-6 rounded-2xl shadow-md border border-[var(--ring)] bg-[var(--card)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)]">Risk by Department</h3>
          <p className="text-sm text-[var(--text-muted)]">Top 6 highest gaps</p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-[var(--ring)] p-1 bg-[var(--panel)]">
          <button
            onClick={() => setMode('bars')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              mode === 'bars' 
                ? 'bg-[var(--accent)] text-white shadow-sm' 
                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--neutral-soft-bg)]'
            }`}
          >
            <BarChart3 className="h-3 w-3" />
          </button>
          <button
            onClick={() => setMode('list')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              mode === 'list' 
                ? 'bg-[var(--accent)] text-white shadow-sm' 
                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--neutral-soft-bg)]'
            }`}
          >
            <List className="h-3 w-3" />
          </button>
        </div>
      </div>

      {mode === 'list' && (
        <div className="h-64 overflow-y-auto space-y-2">
          {top.map((t, i) => (
            <div 
              key={`${t.site}-${t.role}`} 
              className="flex items-center justify-between p-3 rounded-lg border border-[var(--ring)] bg-[var(--panel)] hover:bg-[var(--neutral-soft-bg)] transition-colors duration-200 cursor-pointer group"
              onClick={() => { setDefaults({ role: t.role, percent: 5 }); setOpen(true); }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-sm font-medium text-[var(--text-muted)] w-6 text-center">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--text)] text-sm truncate">
                    {t.site} • {t.role}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">N={t.n} employees</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ${getSeverityPillColor(t.gapPercent)}`}>
                  {getSeverityLabel(t.gapPercent)}
                </span>
                <span className="text-sm font-semibold text-[var(--text)]">
                  {t.gapPercent}%
                </span>
              </div>
            </div>
          ))}
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
                  <div className="h-64 overflow-y-auto">
          <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={rows} 
                layout="vertical" 
                margin={{ top: 10, right: 40, bottom: 10, left: 12 }}
                barGap={12}
              >
                <CartesianGrid 
                  horizontal={false} 
                  strokeDasharray="3 3" 
                  stroke="var(--ring)" 
                  strokeOpacity={0.2} 
                />
                <XAxis 
                  type="number" 
                  domain={[0, 12]} 
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
                  tickLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120} 
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
                  tickLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
                />
                <Tooltip 
                  formatter={(v: any, _n, p: any) => [`${v}% (N=${p.payload.n})`, p.payload.name]}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--ring)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="gap" 
                  radius={[2, 2, 0, 0]}
                  barSize={6}
                  className="hover:opacity-80 transition-opacity"
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
            
            {/* Value labels */}
            <div className="flex justify-between mt-3 px-1">
              {rows.map((item, index) => (
                <div key={index} className="text-xs font-medium text-[var(--text)] text-center" style={{ width: '16.66%' }}>
                  {item.gap}%
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
