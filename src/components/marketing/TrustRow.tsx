"use client";

import { useI18n } from "@/providers/I18nProvider";

export default function TrustRow() {
  const { t } = useI18n();

  const customerLogos = [
    { name: "NordTech", logo: "/logos/nordtech.svg" },
    { name: "KronaCo", logo: "/logos/kronaco.svg" },
    { name: "PeopleNation", logo: "/logos/peoplenation.svg" },
    { name: "DataLedger", logo: "/logos/datalegder.svg" },
    { name: "Astra AB", logo: "/logos/astra.svg" },
    { name: "NordBank", logo: "/logos/nordbank.svg" },
  ];

  return (
    <div className="py-8">
      {/* Top divider */}
      <div className="h-px bg-[var(--ring)] opacity-10 mb-8"></div>
      
      {/* Trust section */}
      <div className="text-center">
        <p className="text-sm font-medium text-[var(--text-muted)] mb-6 uppercase tracking-wide">
          {t("home.trustline")}
        </p>
        
        {/* Logo grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {customerLogos.map((company, index) => (
            <div 
              key={index} 
              className="group relative flex items-center justify-center w-full max-w-[100px] h-8"
            >
              <div className="w-full h-6 bg-gray-300 rounded opacity-60 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">{company.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom divider */}
      <div className="h-px bg-[var(--ring)] opacity-10 mt-8"></div>
    </div>
  );
}
