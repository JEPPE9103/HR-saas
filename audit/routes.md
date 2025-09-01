# Route Audit Report

## App Router Routes (src/app/**/page.tsx)

### Root Routes
- `/` - `src/app/page.tsx` (Landing page)

### Authentication Routes
- `/login` - `src/app/login/page.tsx` (Login page)
- `/signup` - `src/app/signup/page.tsx` (Signup page)

### Dashboard Routes (Route Group: (dashboard))
- `/dashboard` - `src/app/(dashboard)/dashboard/page.tsx` (Dashboard page)
- `/insights` - `src/app/(dashboard)/insights/page.tsx` (Insights page)
- `/simulate` - `src/app/(dashboard)/simulate/page.tsx` (Simulate page)

### Feature Routes
- `/import` - `src/app/import/page.tsx` (Import/Upload page)
- `/reports` - `src/app/reports/page.tsx` (Reports page)
- `/onboarding` - `src/app/onboarding/page.tsx` (Onboarding page)

### Legal/Info Routes
- `/contact` - `src/app/contact/page.tsx` (Contact page)
- `/privacy` - `src/app/privacy/page.tsx` (Privacy policy)
- `/terms` - `src/app/terms/page.tsx` (Terms of service)
- `/security` - `src/app/security/page.tsx` (Security page)

### API Routes
- `/api/**` - `src/app/api/**` (API endpoints)

### Special Routes
- `/not-found` - `src/app/not-found.tsx` (404 page)

## Route Analysis

### Current Navigation Links (from SiteHeader.tsx)
- Home (`/`)
- Import (`/import`)
- Dashboard (`/dashboard`)
- Insights (`/insights`)
- Simulate (`/simulate`)
- Reports (`/reports`)

### MVP Target Routes
- `/` (Landing)
- `/login` (Authentication)
- `/import` (Data import)
- `/overview` (Main dashboard - needs to be created)

### Legacy Routes to Quarantine
- `/dashboard` (replace with `/overview`)
- `/insights` (legacy)
- `/simulate` (legacy)
- `/reports` (legacy)
- `/onboarding` (legacy)
- `/contact` (legacy)
- `/privacy` (legacy)
- `/terms` (legacy)
- `/security` (legacy)
- `/signup` (legacy - keep only login)

## Route Dependencies

### Authentication Flow
- `/login` → `/onboarding` (if no company)
- `/login` → `/dashboard` (if has datasets)
- `/onboarding` → `/dashboard`

### Import Flow
- `/import` → `/dashboard` (after successful import)

### Demo Links
- Landing page links to `/dashboard?datasetId=demo-se`
- Final CTA links to `/dashboard?datasetId=demo-se`
