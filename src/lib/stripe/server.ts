import Stripe from 'stripe'

// Fallback för utveckling
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_fallback'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
})

// Prisplaner
export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Upp till 50 anställda',
      'Grundläggande lönegapsanalys',
      '1 rapport per månad',
      'Email support'
    ],
    limits: {
      maxEmployees: 50,
      maxReports: 1,
      maxDatasets: 1
    }
  },
  team: {
    name: 'Team',
    price: 2990,
    priceId: process.env.STRIPE_TEAM_PRICE_ID || 'price_team_fallback',
    features: [
      'Upp till 250 anställda',
      'AI-drivna insikter',
      'Obegränsade rapporter',
      'Slack/Teams integration',
      'Priority support'
    ],
    limits: {
      maxEmployees: 250,
      maxReports: -1, // Obegränsat
      maxDatasets: 5
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 4990,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_fallback',
    features: [
      '250+ anställda',
      'Avancerade AI-funktioner',
      'Compliance-specialist',
      'Dedikerad support',
      'Custom integrationer'
    ],
    limits: {
      maxEmployees: -1, // Obegränsat
      maxReports: -1,
      maxDatasets: -1
    }
  }
} as const

export type PlanType = keyof typeof PRICING_PLANS
