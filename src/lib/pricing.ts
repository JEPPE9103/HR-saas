export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Upp till 50 anställda',
      'Grundläggande lönegapsanalys',
      '1 rapport per månad',
      'Email support',
    ],
    limits: {
      maxEmployees: 50,
      maxReports: 1,
      maxDatasets: 1,
    },
  },
  team: {
    name: 'Team',
    price: 2990,
    features: [
      'Upp till 250 anställda',
      'AI-drivna insikter',
      'Obegränsade rapporter',
      'Slack/Teams integration',
      'Priority support',
    ],
    limits: {
      maxEmployees: 250,
      maxReports: -1,
      maxDatasets: 5,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 4990,
    features: [
      '250+ anställda',
      'Avancerade AI-funktioner',
      'Compliance-specialist',
      'Dedikerad support',
      'Custom integrationer',
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


