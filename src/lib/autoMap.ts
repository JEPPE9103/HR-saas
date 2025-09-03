import { REQUIRED_FIELDS, FieldKey } from "./importSchema";
import { ColumnMeta } from "./csvSniffer";

export type AutoMap = Record<FieldKey, string | null>;

export function buildAutoMap(cols: ColumnMeta[]): AutoMap {
  const autoMap: AutoMap = {} as AutoMap;
  
  // Initiera alla fält som null
  Object.keys(REQUIRED_FIELDS).forEach(key => {
    autoMap[key as FieldKey] = null;
  });
  
  // För varje fält, hitta bästa matchande kolumn
  Object.entries(REQUIRED_FIELDS).forEach(([fieldKey, fieldConfig]) => {
    const field = fieldKey as FieldKey;
    let bestScore = 0;
    let bestColumn: string | null = null;
    
    cols.forEach(column => {
      let score = 0;
      
      // Namnmatchning i synonyms (2 poäng)
      const normalizedColumnName = column.name.toLowerCase().trim();
      if (fieldConfig.synonyms.some(synonym => 
        normalizedColumnName.includes(synonym.toLowerCase().trim())
      )) {
        score += 2;
      }
      
      // Typmatchning (1 poäng)
      if (column.type === fieldConfig.type) {
        score += 1;
      }
      
      // För enum: rimligt antal unika värden (1 poäng)
      if (fieldConfig.type === "enum" && column.distinct.length <= 20) {
        score += 1;
      }
      
      // Uppdatera bästa match om denna har högre score
      if (score > bestScore) {
        bestScore = score;
        bestColumn = column.name;
      }
    });
    
    // Sätt kolumn endast om score >= 2
    if (bestScore >= 2) {
      autoMap[field] = bestColumn;
    }
  });
  
  return autoMap;
}
