"use client";

import { useI18n } from "@/providers/I18nProvider";

export default function TrustStrip(){
  const { t } = useI18n();
  const items = ["Astra AB","NordTech","KronaCo","PeopleNation","DataLedger"];
  return (
    <div className="rounded-xl border p-3 border-[var(--ring)] bg-[var(--panel)]">
      <div className="mb-2 text-center text-xs uppercase tracking-wide text-slate-500">{t('home.trustline')}</div>
      <div className="relative overflow-hidden">
        <div className="animate-[scroll_22s_linear_infinite] whitespace-nowrap text-slate-600">
          {items.concat(items).map((x,i)=> (
            <span key={i} className="mx-6 inline-block text-slate-600/80">{x}</span>
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


