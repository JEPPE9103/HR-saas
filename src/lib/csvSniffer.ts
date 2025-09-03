import Papa from "papaparse";
import { FieldType } from "./importSchema";

export type ColumnMeta = { 
  name: string; 
  type: FieldType; 
  distinct: string[]; 
  samples: string[];
};

export function inferColumnType(samples: string[]): "number" | "date" | "string" {
  if (samples.length === 0) return "string";
  
  let numberCount = 0;
  let dateCount = 0;
  
  samples.forEach(sample => {
    const trimmed = sample.trim();
    if (trimmed === "") return;
    
    // Check if it's a number (allow . and ,)
    const cleanNumber = trimmed.replace(/[,\s]/g, "");
    if (!isNaN(Number(cleanNumber)) && cleanNumber !== "") {
      numberCount++;
    }
    
    // Check if it's a date
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
      /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
      /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
      /^\d{1,2}\.\d{1,2}\.\d{4}$/, // DD.MM.YYYY
    ];
    
    if (datePatterns.some(pattern => pattern.test(trimmed))) {
      dateCount++;
    }
  });
  
  const total = samples.length;
  const numberRatio = numberCount / total;
  const dateRatio = dateCount / total;
  
  if (numberRatio > 0.7) return "number";
  if (dateRatio > 0.7) return "date";
  return "string";
}

export function uniqueValues(values: string[], limit: number = 50): string[] {
  const unique = [...new Set(values.filter(v => v.trim() !== ""))];
  return unique.slice(0, limit);
}

export function detectDelimiter(content: string): string {
  const lines = content.split('\n').slice(0, 10);
  const delimiters = [',', ';', '\t', '|'];
  
  let bestDelimiter = ',';
  let bestScore = 0;
  
  delimiters.forEach(delimiter => {
    let score = 0;
    lines.forEach(line => {
      const parts = line.split(delimiter);
      if (parts.length > 1) {
        score += parts.length;
      }
    });
    if (score > bestScore) {
      bestScore = score;
      bestDelimiter = delimiter;
    }
  });
  
  return bestDelimiter;
}

export function detectDecimalSeparator(content: string): string {
  const commaCount = (content.match(/,/g) || []).length;
  const dotCount = (content.match(/\./g) || []).length;
  
  return commaCount > dotCount ? ',' : '.';
}

export function analyzeColumns(rows: any[], headers: string[]): ColumnMeta[] {
  if (rows.length === 0) return [];
  
  const columns: ColumnMeta[] = [];
  
  headers.forEach(header => {
    const values = rows.map(row => String(row[header] || "")).filter(v => v !== "");
    const samples = values.slice(0, 10);
    const uniqueValuesList = uniqueValues(values, 50);
    
    const inferredType = inferColumnType(samples);
    
    columns.push({
      name: header,
      type: inferredType,
      distinct: uniqueValuesList,
      samples
    });
  });
  
  return columns;
}


