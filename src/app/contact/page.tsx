"use client";

import { useState } from "react";
import { PageTitle } from "@/components/ui/PageTitle";
import { Mail } from "lucide-react";
import { useI18n } from "@/providers/I18nProvider";

export default function ContactPage() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const salesEmail = process.env.NEXT_PUBLIC_SALES_EMAIL || "sales@example.com";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent("PayTransparency demo request");
    const body = encodeURIComponent(
      `${t('contact.name')}: ${name}\n${t('contact.email')}: ${email}\n${t('contact.company')}: ${company}\n\n${message}`
    );
    window.location.href = `mailto:${salesEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl mb-6 shadow-2xl">
            <Mail className="w-12 h-12 text-slate-700" />
          </div>
          <PageTitle subtitle={t('contact.subtitle')}>{t('contact.title')}</PageTitle>
        </div>
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">{t('contact.name')}</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100" />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">{t('contact.email')}</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-2">{t('contact.company')}</label>
            <input value={company} onChange={(e)=>setCompany(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100" />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-2">{t('contact.message')}</label>
            <textarea value={message} onChange={(e)=>setMessage(e.target.value)} rows={5} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100" />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="rounded-xl px-6 py-3 bg-slate-800 text-white hover:bg-slate-700 transition">
              {t('contact.submit')}
            </button>
          </div>
          <p className="text-xs text-slate-500">{t('contact.mailtoNote')} {salesEmail}</p>
        </form>
      </div>
    </div>
  );
}


