// Feature flags för att kontrollera funktionalitet
export const FEATURE_FLAGS = {
  // Import V2 - ny smart import med auto-mapping
  IMPORT_V2: process.env.NEXT_PUBLIC_IMPORT_V2 === 'true',
  
  // Andra feature flags kan läggas till här
} as const;

export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
  // Säkerställ att vi kan läsa miljövariabler korrekt
  if (typeof window !== 'undefined') {
    // På klientsidan, använd window.__NEXT_DATA__ eller fallback
    return FEATURE_FLAGS[flag];
  }
  return FEATURE_FLAGS[flag];
}

// Debug-utskrift för att verifiera att feature flags laddas korrekt
if (typeof window !== 'undefined') {
  console.log('Feature flags loaded:', {
    IMPORT_V2: FEATURE_FLAGS.IMPORT_V2,
    env: process.env.NEXT_PUBLIC_IMPORT_V2
  });
}
