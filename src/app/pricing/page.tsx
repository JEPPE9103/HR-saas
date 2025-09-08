"use client";

import { useState } from 'react';
import { useI18n } from "@/providers/I18nProvider";
import { PRICING_PLANS, billingEnabled } from '@/lib/pricing';
import { PageTitle } from '@/components/ui/PageTitle';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PricingPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'team' | 'enterprise') => {
    try {
      setLoading(plan);
      // Billing är avstängt i denna fas – visa info, inga Stripe-anrop
      alert('Billing kommer snart. Kontakta oss för att uppgradera.');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Kunde inte starta prenumeration. Försök igen.');
    } finally {
      setLoading(null);
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'free': return <Check className="h-6 w-6" />;
      case 'team': return <Zap className="h-6 w-6" />;
      case 'enterprise': return <Crown className="h-6 w-6" />;
      default: return <Check className="h-6 w-6" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'border-gray-200 bg-white';
      case 'team': return 'border-blue-500 bg-blue-50';
      case 'enterprise': return 'border-purple-500 bg-purple-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative overflow-hidden text-center mb-20">
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl mb-6 shadow-2xl">
              <Star className="w-12 h-12 text-slate-700" />
            </div>
            <PageTitle subtitle={t('pricing.subtitle')}>{t('pricing.title')}</PageTitle>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {Object.entries(PRICING_PLANS).map(([planKey, plan]) => (
            <div
              key={planKey}
              className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-slate-50 to-white hover:shadow-2xl`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl ${
                planKey === 'free' ? 'bg-gradient-to-br from-slate-200/20 to-slate-300/10' :
                planKey === 'team' ? 'bg-gradient-to-br from-mint-200/20 to-teal-300/10' :
                'bg-gradient-to-br from-coral-200/20 to-rose-300/10'
              }`} />
              <div className="text-center relative z-10">
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-2xl ${
                    planKey === 'free' ? 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700' :
                    planKey === 'team' ? 'bg-gradient-to-br from-mint-100 to-teal-200 text-teal-700' :
                    'bg-gradient-to-br from-coral-100 to-rose-200 text-coral-700'
                  }`}>
                    {getPlanIcon(planKey)}
                  </div>
                </div>
                <h3 className="text-2xl font-light text-slate-800 mb-4 tracking-tight">{t(`pricing.${planKey}.name`)}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-light text-slate-800">{plan.price === 0 ? t('pricing.free.price') : `${plan.price.toLocaleString('sv-SE')} ${t('pricing.currency')}`}</span>
                  {plan.price > 0 && <span className="text-slate-600 font-light">{t('pricing.perMonth')}</span>}
                </div>
              </div>
              <ul className="space-y-4 mb-8 relative z-10">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-slate-700 font-light">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="text-center relative z-10">
                <button
                  className={`w-full rounded-2xl py-4 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-white ${
                    planKey === 'free' ? 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800' :
                    planKey === 'team' ? 'bg-gradient-to-r from-mint-600 to-teal-600 hover:from-mint-700 hover:to-teal-700' :
                    'bg-gradient-to-r from-coral-600 to-rose-600 hover:from-coral-700 hover:to-rose-700'
                  }`}
                  onClick={planKey === 'free' ? () => (window.location.href = '/import') : () => (window.location.href = '/contact')}
                  disabled={loading === planKey}
                >
                  {planKey === 'free' ? t('pricing.cta.free') : (!billingEnabled() ? t('pricing.cta.contact') : (loading === planKey ? t('pricing.cta.loading') : t('pricing.cta.subscribe')))}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ - 2026 Modern Design */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-slate-800 mb-4 tracking-tight">
              {t('pricing.faq.title')}
            </h2>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="group bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <h3 className="text-xl font-light text-slate-800 mb-4 tracking-tight">
                {t('pricing.faq.changePlan.question')}
              </h3>
              <p className="text-slate-600 leading-relaxed font-light">
                {t('pricing.faq.changePlan.answer')}
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <h3 className="text-xl font-light text-slate-800 mb-4 tracking-tight">
                {t('pricing.faq.trial.question')}
              </h3>
              <p className="text-slate-600 leading-relaxed font-light">
                {t('pricing.faq.trial.answer')}
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <h3 className="text-xl font-light text-slate-800 mb-4 tracking-tight">
                {t('pricing.faq.billing.question')}
              </h3>
              <p className="text-slate-600 leading-relaxed font-light">
                {t('pricing.faq.billing.answer')}
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <h3 className="text-xl font-light text-slate-800 mb-4 tracking-tight">
                {t('pricing.faq.support.question')}
              </h3>
              <p className="text-slate-600 leading-relaxed font-light">
                {t('pricing.faq.support.answer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
