# Transpara Frontend

## Import V2 - Setup Guide

### Översikt
Import V2 är en helt ny, intelligent import-funktionalitet som gör importflödet självförklarande för HR-personal. Systemet auto-mappar kolumner, visar endast relevanta val i dropdowns och löser värdemappning automatiskt.

### Funktioner
- **Auto-mapping**: Intelligent mappning av kolumner baserat på namn och typ
- **Smarta dropdowns**: Endast relevanta kolumner visas per fälttyp
- **Enum-värdesmappning**: Automatisk hantering av kön, avdelning, nivå etc.
- **Datanormalisering**: Konvertering till standardformat innan import
- **Feature flag**: Enkel aktivering/inaktivering av ny funktionalitet
- **Legacy fallback**: Automatisk återgång till gammal import om något går fel

### Aktivering
Sätt miljövariabeln `NEXT_PUBLIC_IMPORT_V2=true` för att aktivera Import V2:

```bash
# .env.local
NEXT_PUBLIC_IMPORT_V2=true
```

### Filstruktur
```
src/
├── lib/
│   ├── importSchema.ts      # Målschema med svenska etiketter
│   ├── csvSniffer.ts        # CSV/Excel analys
│   ├── autoMap.ts           # Intelligent kolumnmappning
│   ├── valueMap.ts          # Enum-värdesmappning
│   ├── normalizeData.ts     # Datanormalisering
│   └── featureFlags.ts      # Feature flag-hantering
├── components/import/
│   ├── ImportWizard.tsx     # Huvudkomponent med feature flag
│   ├── MappingForm.tsx      # Ny mappningsformulär
│   ├── EnumValueMapper.tsx  # Enum-värdesmappning UI
│   ├── DataPreview.tsx      # Förhandsgranskning
│   └── LegacyImportWizard.tsx # Fallback till gammal import
└── _quarantine/import/legacy/ # Gammal import-kod
```

### Användning

#### 1. Ladda upp fil
- Stöd för CSV, XLSX, XLS
- Automatisk kolumnanalys och typinferens
- Identifierar systemfält (tenant_id, created_at) automatiskt

#### 2. Mappa kolumner
- **Auto-mapping**: Systemet föreslår mappning baserat på namn och typ
- **Filtrerade dropdowns**: Endast relevanta kolumner visas per fält
- **Validering**: Grön punkt för mappade fält, röd för saknade

#### 3. Enum-värdesmappning
- Automatiska förslag för kön, avdelning, nivå etc.
- HR kan justera mappning manuellt
- Stöd för svenska värden (kvinna → female)

#### 4. Förhandsgranskning
- Visar 10 normaliserade rader
- Validering av data
- Möjlighet att gå tillbaka och justera

### Schema
```typescript
export const REQUIRED_FIELDS = {
  employee_id: { 
    label: "Anställnings-ID", 
    type: "string", 
    required: true,
    synonyms: ["employee_id", "emp id", "id", "personalnummer"]
  },
  gender: { 
    label: "Kön", 
    type: "enum", 
    required: true,
    options: ["male", "female", "other", "prefer_not_to_say"],
    synonyms: ["gender", "kön", "sex", "m/f", "man", "kvinna"]
  },
  // ... fler fält
}
```

### Auto-mapping Algoritm
1. **Namnmatchning** (2 poäng): Jämför med synonymer
2. **Typmatchning** (1 poäng): number → numerisk kolumn
3. **Distinct-värden** (1 poäng): Rimligt antal unika värden för enum

Kräver minst 2 poäng för att mappa automatiskt.

### Fallback-mekanism
Om `NEXT_PUBLIC_IMPORT_V2=false` eller om något går fel:
- Rendera `LegacyImportWizard` från `_quarantine`
- Behåll all befintlig funktionalitet
- Ingen risk för att bryta bygget

### Testning
```bash
# Aktivera Import V2
export NEXT_PUBLIC_IMPORT_V2=true

# Starta utvecklingsserver
npm run dev

# Testa med exempel-filer
# public/demo/employees_example.csv
# public/demo/employees_large.csv
```

### Supportade format
- **CSV**: Automatisk delimiter-detektering
- **XLSX/XLS**: Fullständigt stöd
- **Kodning**: UTF-8, ISO-8859-1
- **Storlek**: Max 50 MB

### Framtida förbättringar
- Stöd för fler filformat
- Avancerad datavalidering
- Batch-import med progress
- Integration med backend-API:er

---

## Vanliga kommandon

```bash
# Installera beroenden
npm install

# Starta utvecklingsserver
npm run dev

# Bygg för produktion
npm run build

# Kör tester
npm test

# Lint och typecheck
npm run lint
npm run type-check
```

## Miljövariabler

```bash
# .env.local
NEXT_PUBLIC_IMPORT_V2=true  # Aktivera Import V2
```

## Teknisk stack

- **Framework**: Next.js 15
- **Språk**: TypeScript
- **Styling**: Tailwind CSS
- **UI-komponenter**: Custom komponenter
- **Parsing**: PapaParse (CSV), XLSX (Excel)
