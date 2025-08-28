"use client";

export function TrustLogos(){
  const companies = [
    "NordTech", "KronaCo", "PeopleNation", "DataLedger", "Astra AB", "NordBank",
    "NordTech", "KronaCo", "PeopleNation", "DataLedger", "Astra AB", "NordBank" // Duplicate for seamless loop
  ];
  
  return (
    <div className="mt-10 rounded-2xl border p-4 border-[var(--ring)] bg-[var(--panel)]">
      <p className="mb-4 text-center text-xs tracking-wide text-indigo-600 dark:text-slate-400">TRUSTED BY HR & FINANCE TEAMS</p>
      <div className="relative overflow-hidden rounded-xl bg-indigo-50 dark:bg-slate-800/50 p-3">
        <div className="flex animate-scroll whitespace-nowrap">
          {companies.map((company, index) => (
            <div 
              key={index} 
              className="mx-6 flex-shrink-0 text-sm font-medium text-indigo-700 dark:text-slate-300"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


