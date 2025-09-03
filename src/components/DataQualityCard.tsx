export function DataQualityCard({ issues }: { issues: { type: string; detail: string }[] }) {
  return (
    <div className="card p-5">
              <h3 className="text-base font-semibold text-slate-800">Data Quality</h3>
      {issues.length === 0 ? (
        <p className="mt-2 text-sm subtle">No issues detected.</p>
      ) : (
        <ul className="mt-2 text-sm list-disc pl-5 subtle">
          {issues.map((i, idx) => (
            <li key={idx}><strong>{i.type}:</strong> {i.detail}</li>
          ))}
        </ul>
      )}
    </div>
  );
}


