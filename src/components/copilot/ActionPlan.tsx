"use client";

type Step = { title: string; owner?: string; due?: string };

export function ActionPlan({ steps, onCreate }: { steps: Step[]; onCreate?: () => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h4 className="text-sm font-semibold text-slate-900">Suggested Action Plan</h4>
      <ol className="mt-3 space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">{i+1}</span>
            <div>
              <div className="text-sm text-slate-800 font-medium">{s.title}</div>
              {(s.owner || s.due) && (
                <div className="text-xs text-slate-600">{s.owner ? `Owner: ${s.owner}` : ''} {s.due ? ` • Due: ${s.due}` : ''}</div>
              )}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-3">
        <button className="btn btn-primary" onClick={onCreate}>Create Action Plan</button>
      </div>
    </div>
  );
}


