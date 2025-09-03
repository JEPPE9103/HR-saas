# Supabase + Stripe Setup Guide

## 🚀 Snabbstart

### 1. Skapa `.env.local` fil

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe Price IDs (skapa dessa i Stripe Dashboard)
STRIPE_TEAM_PRICE_ID=price_your_team_price_id
STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id

# Feature Flags
NEXT_PUBLIC_IMPORT_V2=true
```

## 🔧 Supabase Setup

### 1. Skapa projekt på [supabase.com](https://supabase.com)
### 2. Gå till Settings > API
### 3. Kopiera:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Skapa databastabeller

Kör detta SQL i Supabase SQL Editor:

```sql
-- Companies table
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'SE',
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'team', 'enterprise')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  members UUID[] DEFAULT '{}'
);

-- Users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Datasets table
CREATE TABLE datasets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) NOT NULL,
  label TEXT NOT NULL,
  row_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  source TEXT NOT NULL DEFAULT 'upload' CHECK (source IN ('upload', 'demo', 'integration'))
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'team', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own company" ON companies
  FOR SELECT USING (auth.uid() IN (SELECT unnest(members) FROM companies WHERE id = companies.id));

CREATE POLICY "Users can view their own user data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view datasets from their company" ON datasets
  FOR SELECT USING (company_id IN (SELECT id FROM companies WHERE auth.uid() IN (SELECT unnest(members) FROM companies WHERE id = companies.id)));

CREATE POLICY "Users can view subscriptions from their company" ON subscriptions
  FOR SELECT USING (company_id IN (SELECT id FROM companies WHERE auth.uid() IN (SELECT unnest(members) FROM companies WHERE id = companies.id)));
```

## 💳 Stripe Setup

### 1. Skapa konto på [stripe.com](https://stripe.com)
### 2. Gå till Developers > API keys
### 3. Kopiera:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

### 4. Skapa produkter och priser

#### Team Plan (2990 SEK/månad)
1. Gå till Products > Add Product
2. Namn: "Team Plan"
3. Pricing: 2990 SEK/month
4. Kopiera Price ID → `STRIPE_TEAM_PRICE_ID`

#### Enterprise Plan (4990 SEK/månad)
1. Gå till Products > Add Product
2. Namn: "Enterprise Plan"
3. Pricing: 4990 SEK/month
4. Kopiera Price ID → `STRIPE_ENTERPRISE_PRICE_ID`

### 5. Webhook Setup
1. Gå till Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Kopiera webhook secret → `STRIPE_WEBHOOK_SECRET`

## 🧪 Testa

### 1. Starta utvecklingsservern
```bash
npm run dev
```

### 2. Gå till `/pricing`
### 3. Testa prenumeration med Stripe test-kort:
   - **Success**: 4242 4242 4242 4242
   - **Decline**: 4000 0000 0000 0002

## 📱 Användning

### Prenumeration
```typescript
import { createCheckoutSession } from '@/lib/stripe/client';

const sessionId = await createCheckoutSession(priceId, userEmail);
```

### Supabase Query
```typescript
import { supabase } from '@/lib/supabase/client';

const { data, error } = await supabase
  .from('companies')
  .select('*')
  .eq('id', companyId);
```

## 🔒 Säkerhet

- **RLS**: Alla tabeller har Row Level Security
- **Auth**: Supabase Auth hanterar användarsessioner
- **Webhooks**: Stripe webhooks valideras med signature
- **Environment**: Känsliga nycklar i `.env.local` (inte i Git)

## 🚨 Felsökning

### "Missing environment variables"
- Kontrollera att `.env.local` finns
- Starta om utvecklingsservern

### "Supabase connection failed"
- Kontrollera URL och API-nyckel
- Verifiera att projektet är aktivt

### "Stripe checkout failed"
- Kontrollera Stripe-nycklar
- Verifiera webhook-URL
- Kolla Stripe Dashboard för fel
