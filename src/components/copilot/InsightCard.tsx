"use client";

type Props = {
  title: string;
  summary: string;
  confidence?: number; // 0..1
  href?: string;
  onInsert?: () => void;
};

export function InsightCard({ title, summary, confidence, href, onInsert }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        {typeof confidence === 'number' && (
          <span className="text-xs text-slate-600">Conf. {(confidence * 100).toFixed(0)}%</span>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{summary}</p>
      {(href || onInsert) && (
        <div className="mt-3 flex gap-2">
          {href && (
            <a className="btn btn-ghost" href={href}>View</a>
          )}
          {onInsert && (
            <button className="btn btn-primary" onClick={onInsert}>Insert into Report</button>
          )}
        </div>
      )}
    </div>
  );
}


