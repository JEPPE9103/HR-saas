"use client";

export function TrustLogos(){
  const logos = ["astra","nordtech","kronaco","peoplenation","datalegder","nordbank"];
  return (
    <div className="mt-10 rounded-2xl border p-4 border-[var(--ring)] bg-[var(--panel)]">
      <p className="mb-4 text-center text-xs tracking-wide text-slate-500">TRUSTED BY HR & FINANCE TEAMS</p>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
        {logos.map(l => (
          <img key={l} src={`/logos/${l}.svg`} alt="" className="mx-auto h-6 opacity-70 transition hover:opacity-100" />
        ))}
      </div>
    </div>
  );
}


