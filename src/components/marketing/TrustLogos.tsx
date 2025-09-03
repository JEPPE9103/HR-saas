"use client";

export function TrustLogos(){
  const companies = [
    "NordTech", "KronaCo", "PeopleNation", "DataLedger", "Astra AB", "NordBank",
    "NordTech", "KronaCo", "PeopleNation", "DataLedger", "Astra AB", "NordBank" // Duplicate for seamless loop
  ];
  
  return (
    <div className="mt-10">
      {/* Top divider */}
      <div className="h-px bg-gray-200 opacity-30 mb-8"></div>
      
      {/* Main content */}
      <div className="text-center">
        <p className="mb-4 text-xs font-medium tracking-wide text-gray-600 uppercase">
          Trusted by HR & Finance teams
        </p>
        
        {/* Scrolling logos */}
        <div className="relative overflow-hidden rounded-xl bg-gray-50 p-3">
          <div className="flex animate-scroll whitespace-nowrap">
            {companies.map((company, index) => (
              <div 
                key={index} 
                className="mx-6 flex-shrink-0 text-sm font-medium text-gray-700"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom divider */}
      <div className="h-px bg-gray-200 opacity-30 mt-8"></div>
    </div>
  );
}


