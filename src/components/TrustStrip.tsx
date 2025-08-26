"use client";

export default function TrustStrip(){
  const items = ["Astra AB","NordTech","KronaCo","PeopleNation","DataLedger"];
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-2 text-center text-xs uppercase tracking-wide text-slate-400">Trusted by HR & Finance teams</div>
      <div className="relative overflow-hidden">
        <div className="animate-[scroll_22s_linear_infinite] whitespace-nowrap text-slate-300">
          {items.concat(items).map((x,i)=> (
            <span key={i} className="mx-6 inline-block text-slate-300/80">{x}</span>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}


