# Import V2 - Setup Guide

## Aktivera nya importen

För att aktivera den nya smarta importen med auto-mapping, skapa en `.env.local` fil i projektets rot och lägg till:

```bash
NEXT_PUBLIC_IMPORT_V2=true
```

## Funktioner

### 1. Smart Auto-Mapping
- Systemet mappar automatiskt kolumner baserat på namn och innehåll
- Stöder svenska, engelska och många andra språk
- Använder synonyms för flexibel mappning

### 2. Smarta Dropdowns
- Varje fält visar endast relevanta kolumner baserat på typ
- Enum-fält (kön, nivå, avdelning) har fördefinierade alternativ
- Filtrerade listor baserat på fälttyp

### 3. Enum-värdesmappning
- Automatisk mappning av vanliga värden (t.ex. "F" → "female")
- HR kan justera mappningen vid behov
- Stöder svenska och engelska termer

### 4. Data-normalisering
- Automatisk parsing av nummer, datum och enum-värden
- Validering innan import
- Preview av normaliserade data

## Fallback

Om `NEXT_PUBLIC_IMPORT_V2=false` eller saknas, används den gamla importen från `_quarantine/import/legacy/`.

## Struktur

```
src/
├── lib/
│   ├── importSchema.ts      # Fältkonfiguration med synonyms
│   ├── csvSniffer.ts        # CSV/Excel analys
│   ├── autoMap.ts           # Auto-mapping heuristik
│   ├── valueMap.ts          # Enum-värdesmappning
│   └── normalizeData.ts     # Data-normalisering
├── components/import/
│   ├── MappingForm.tsx      # Ny mappningsformulär
│   ├── EnumValueMapper.tsx  # Enum-värdesmappning
│   └── DataPreview.tsx      # Data-förhandsgranskning
└── _quarantine/import/legacy/  # Gamla komponenter
```

## Användning

1. Ladda upp CSV/Excel-fil
2. Systemet mappar automatiskt kolumner
3. Justera mappning vid behov
4. Granska normaliserade data
5. Importera

## Stödda filformat

- CSV (komma, semikolon, tab-separerade)
- Excel (.xlsx, .xls)
- Automatisk delimiter-detektering
- Stöd för svenska decimaler (komma)
