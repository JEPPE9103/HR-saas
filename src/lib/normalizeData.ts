import { FieldKey, getFieldConfig } from "./importSchema";

export interface NormalizedRow {
  [key: string]: string | number | Date | null;
}

export interface NormalizationConfig {
  fieldMapping: Partial<Record<FieldKey, string>>;
  enumMappings: Partial<Record<FieldKey, Record<string, string>>>;
}

export function normalizeData(
  rawData: any[], 
  fieldMapping: Partial<Record<FieldKey, string>>,
  enumMappings: Partial<Record<FieldKey, Record<string, string>>>
): NormalizedRow[] {
  return rawData.map(row => {
    const normalizedRow: NormalizedRow = {};
    
    Object.entries(fieldMapping).forEach(([fieldKey, columnName]) => {
      if (!columnName) return;
      
      const field = fieldKey as FieldKey;
      const fieldConfig = getFieldConfig(field);
      const rawValue = row[columnName];
      
      if (rawValue === undefined || rawValue === null || rawValue === '') {
        // Handle empty values
        if (fieldConfig.default !== undefined) {
          normalizedRow[fieldKey] = fieldConfig.default;
        } else if (fieldConfig.required) {
          normalizedRow[fieldKey] = null;
        } else {
          normalizedRow[fieldKey] = null;
        }
        return;
      }
      
      // Normalize based on field type
      switch (fieldConfig.type) {
        case 'number':
          normalizedRow[fieldKey] = parseNumber(rawValue);
          break;
          
        case 'date':
          normalizedRow[fieldKey] = parseDate(rawValue);
          break;
          
        case 'enum':
          normalizedRow[fieldKey] = normalizeEnumValue(field, rawValue, enumMappings);
          break;
          
        default: // string
          normalizedRow[fieldKey] = String(rawValue).trim();
      }
    });
    
    return normalizedRow;
  });
}

function parseNumber(value: any): number | null {
  if (typeof value === 'number') return value;
  
  const stringValue = String(value).trim();
  if (stringValue === '') return null;
  
  // Remove spaces and replace comma with dot for decimal
  const cleanValue = stringValue.replace(/\s/g, '').replace(',', '.');
  
  const parsed = Number(cleanValue);
  return isNaN(parsed) ? null : parsed;
}

function parseDate(value: any): Date | null {
  if (value instanceof Date) return value;
  
  const stringValue = String(value).trim();
  if (stringValue === '') return null;
  
  // Try to parse as ISO date first (most common)
  const isoDate = new Date(stringValue);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }
  
  // Try different date formats
  const dateFormats = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
    /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
    /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
    /^\d{1,2}\.\d{1,2}\.\d{4}$/, // DD.MM.YYYY
  ];
  
  // Check if it matches any known format
  const isValidFormat = dateFormats.some(format => format.test(stringValue));
  if (!isValidFormat) return null;
  
  const parsed = new Date(stringValue);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeEnumValue(
  field: FieldKey, 
  value: any, 
  enumMappings: Partial<Record<FieldKey, Record<string, string>>>
): string | null {
  const stringValue = String(value).trim();
  if (stringValue === '') return null;
  
  const fieldMapping = enumMappings[field];
  if (fieldMapping && fieldMapping[stringValue]) {
    return fieldMapping[stringValue];
  }
  
  // Special handling for gender field
  if (field === 'gender') {
    const normalized = stringValue.toLowerCase();
    if (['f', 'female', 'kvinna'].includes(normalized)) return 'female';
    if (['m', 'male', 'man'].includes(normalized)) return 'male';
    if (['other', 'annan', 'övrigt'].includes(normalized)) return 'other';
    if (['', 'unknown', 'okänt'].includes(normalized)) return 'prefer_not_to_say';
  }
  
  // Fallback to the original value if no mapping exists
  return stringValue;
}

export function validateNormalizedData(data: NormalizedRow[]): {
  isValid: boolean;
  errors: Array<{ row: number; field: string; message: string }>;
} {
  const errors: Array<{ row: number; field: string; message: string }> = [];
  
  data.forEach((row, rowIndex) => {
    Object.entries(row).forEach(([field, value]) => {
      const fieldConfig = getFieldConfig(field as FieldKey);
      if (!fieldConfig) return;
      
      if (fieldConfig.required && (value === null || value === undefined || value === '')) {
        errors.push({
          row: rowIndex + 1,
          field,
          message: `${fieldConfig.label} är obligatoriskt men saknas`
        });
      }
      
      if (fieldConfig.type === 'number' && value !== null && typeof value !== 'number') {
        errors.push({
          row: rowIndex + 1,
          field,
          message: `${fieldConfig.label} ska vara ett nummer men är "${value}"`
        });
      }
      
      if (fieldConfig.type === 'date' && value !== null && !(value instanceof Date)) {
        errors.push({
          row: rowIndex + 1,
          field,
          message: `${fieldConfig.label} ska vara ett datum men är "${value}"`
        });
      }
      
      if (fieldConfig.type === 'enum' && value !== null && fieldConfig.options && typeof value === 'string' && !fieldConfig.options.includes(value)) {
        errors.push({
          row: rowIndex + 1,
          field,
          message: `${fieldConfig.label} har ogiltigt värde "${value}". Tillåtna värden: ${fieldConfig.options.join(', ')}`
        });
      }
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
