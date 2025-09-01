# Cleanup Plan - HR MVP Navigation Refactor

## KEEP (Required for MVP: /, /login, /import, /overview)

### Core Routes
- `/` - `src/app/page.tsx` (Landing page)
- `/login` - `src/app/login/page.tsx` (Authentication)
- `/import` - `src/app/import/page.tsx` (Data import)
- `/overview` - `src/app/overview/page.tsx` (NEW - main dashboard)

### Core Components
- `src/components/SiteHeader.tsx` (Navigation)
- `src/components/UserMenu.tsx` (User menu)
- `src/components/Protected.tsx` (Auth protection)
- `src/components/ThemeToggle.tsx` (Theme switching)
- `src/components/LanguageToggle.tsx` (Language switching)
- `src/components/SafeThemeScript.tsx` (Theme script)
- `src/components/ui/` (UI components)

### Core Providers
- `src/providers/AuthProvider.tsx` (Authentication)
- `src/providers/ThemeProvider.tsx` (Theme)
- `src/providers/I18nProvider.tsx` (Internationalization)

### Core Services
- `src/lib/firebase/` (Firebase integration)
- `src/services/` (API services)
- `src/store/` (State management)

### Core Layout
- `src/app/layout.tsx` (Root layout)
- `src/app/ClientShell.tsx` (Client wrapper)
- `src/app/globals.css` (Global styles)

### Import Flow
- `src/components/upload/` (Upload components)
- `src/app/import/page.tsx` (Import page)

## REVIEW (Uncertain usage - need to verify)

### Components
- `src/components/FeatureCard.tsx` (Used in landing?)
- `src/components/TrustStrip.tsx` (Used in landing?)
- `src/components/MiniTrendChart.tsx` (Used in landing?)
- `src/components/DataQualityCard.tsx` (Used in import?)
- `src/components/OpenCopilotButton.tsx` (Used in overview?)
- `src/components/TwProbe.tsx` (Debug component?)

### Marketing Components
- `src/components/marketing/` (Used in landing page)
- `src/components/hero/` (Used in landing page)

### API Routes
- `src/app/api/` (Need to check which endpoints are used)

## QUARANTINE (Legacy - move to _quarantine/)

### Legacy Routes
- `/dashboard` - `src/app/(dashboard)/dashboard/page.tsx`
- `/insights` - `src/app/(dashboard)/insights/page.tsx`
- `/simulate` - `src/app/(dashboard)/simulate/page.tsx`
- `/reports` - `src/app/reports/page.tsx`
- `/onboarding` - `src/app/onboarding/page.tsx`
- `/signup` - `src/app/signup/page.tsx`
- `/contact` - `src/app/contact/page.tsx`
- `/privacy` - `src/app/privacy/page.tsx`
- `/terms` - `src/app/terms/page.tsx`
- `/security` - `src/app/security/page.tsx`

### Legacy Components (Dashboard)
- `src/components/dashboard/` (ALL - many duplicates)
  - Executive* components (newer versions)
  - Polished* components (newer versions)
  - Basic components (older versions)
  - RiskHeatmap, ActionQueue (specialized)

### Legacy Components (Insights)
- `src/components/insights/` (ALL)
  - InsightCard.tsx
  - SeverityBadge.tsx

### Legacy Components (Simulation)
- `src/components/SimulationDrawer.tsx`
- `src/components/SimulationResultPanel.tsx`
- `src/components/SimulationStickyBar.tsx`

### Legacy Components (Copilot)
- `src/components/copilot/` (ALL)
  - CopilotPanel.tsx
  - Related AI components

### Legacy Route Group
- `src/app/(dashboard)/` (ENTIRE FOLDER)

## DUPLICATE COMPONENTS FOUND

### Dashboard Components (3 versions each!)
- KpiCard: `KpiCard.tsx` (basic) + `PolishedKpiCard.tsx` + `ExecutiveKpiCard.tsx`
- PayGapTrend: `PayGapTrend.tsx` + `PolishedPayGapTrend.tsx` + `ExecutivePayGapTrend.tsx`
- RiskPanel: `RiskPanel.tsx` + `EnhancedRiskPanel.tsx` + `ExecutiveRiskPanel.tsx`
- InsightsFeed: `InsightsFeed.tsx` + `PolishedInsightsFeed.tsx` + `ExecutiveInsightsFeed.tsx`
- SuggestedActions: `SuggestedActions.tsx` + `PolishedSuggestedActions.tsx` + `ExecutiveSuggestedActions.tsx`

## ACTION PLAN

### Phase 1: Create Overview Page
1. Create `src/app/overview/page.tsx` (placeholder)
2. Copy essential dashboard components to overview
3. Update navigation to point to `/overview`

### Phase 2: Move Legacy to Quarantine
1. Move entire `src/app/(dashboard)/` to `_quarantine/src/app/(dashboard)/`
2. Move `src/app/reports/` to `_quarantine/src/app/reports/`
3. Move `src/app/onboarding/` to `_quarantine/src/app/onboarding/`
4. Move `src/app/signup/` to `_quarantine/src/app/signup/`
5. Move `src/app/contact/` to `_quarantine/src/app/contact/`
6. Move `src/app/privacy/` to `_quarantine/src/app/privacy/`
7. Move `src/app/terms/` to `_quarantine/src/app/terms/`
8. Move `src/app/security/` to `_quarantine/src/app/security/`

### Phase 3: Move Legacy Components
1. Move `src/components/dashboard/` to `_quarantine/src/components/dashboard/`
2. Move `src/components/insights/` to `_quarantine/src/components/insights/`
3. Move `src/components/copilot/` to `_quarantine/src/components/copilot/`
4. Move simulation components to `_quarantine/src/components/simulation/`

### Phase 4: Update Navigation
1. Update `SiteHeader.tsx` to only show: Home, Översikt, Importera, Login/Profile
2. Remove links to legacy routes
3. Update any hardcoded links in components

### Phase 5: Fix Imports & Build
1. Create stubs for moved components if needed
2. Update imports to point to new locations
3. Run build and fix any errors
4. Update README with new route structure

## NOTES

- Keep Firebase Auth flow intact
- Keep import functionality working
- Keep theme/language switching
- Keep API endpoints that are used by import/overview
- Swedish translations for HR interface
- All demo links currently point to `/dashboard` - need to update to `/overview`
