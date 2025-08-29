"use client";

export function TrustLogos(){
  const companies = [
    "NordTech", "KronaCo", "PeopleNation", "DataLedger", "Astra AB", "NordBank",
    "NordTech", "KronaCo", "PeopleNation", "DataLedger", "Astra AB", "NordBank" // Duplicate for seamless loop
  ];
  
  return (
    <div className="mt-10">
      {/* Top divider */}
      <div className="h-px bg-[var(--ring)] opacity-30 mb-8"></div>
      
      {/* Main content */}
      <div className="text-center">
        <p className="mb-4 text-xs font-medium tracking-wide text-[var(--text-muted)] uppercase">
          Trusted by HR & Finance teams
        </p>
        
        {/* Scrolling logos */}
        <div className="relative overflow-hidden rounded-xl bg-[var(--panel)] p-3">
          <div className="flex animate-scroll whitespace-nowrap">
            {companies.map((company, index) => (
              <div 
                key={index} 
                className="mx-6 flex-shrink-0 text-sm font-medium text-[var(--text)]"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom divider */}
      <div className="h-px bg-[var(--ring)] opacity-30 mt-8"></div>
    </div>
  );
}


