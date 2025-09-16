export const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    price: 499,
    features: [
      '≤50 anställda',
      'Import + Översikt',
      '1 PDF‑rapport/månad',
      'E‑postsupport',
    ],
    limits: {
      maxEmployees: 50,
      maxReports: 1,
      maxDatasets: 2,
    },
  },
  team: {
    name: 'Team',
    price: 1499,
    features: [
      '51–250 anställda',
      'AI‑insikter',
      'Upp till 5 rapporter/månad',
      'Slack/Teams‑integration',
      'Prioriterad support',
    ],
    limits: {
      maxEmployees: 250,
      maxReports: 5,
      maxDatasets: 5,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 4990,
    features: [
      '251+ anställda',
      'Avancerad AI (orsaker & simuleringar)',
      'Compliance‑specialist',
      'Dedikerad support',
      'Custom‑integrationer',
    ],
    limits: {
      maxEmployees: -1,
      maxReports: -1,
      maxDatasets: -1,
    },
  },
} as const;

export function billingEnabled(): boolean {
  return process.env.NEXT_PUBLIC_BILLING_ENABLED === 'true';
}

export type PlanType = keyof typeof PRICING_PLANS;


