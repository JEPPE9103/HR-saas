export type FieldType = "string" | "number" | "date" | "enum";

export interface FieldConfig {
  label: string;
  type: FieldType;
  required: boolean;
  options?: readonly string[];
  default?: string | number;
  synonyms: readonly string[];
}

export const REQUIRED_FIELDS = {
  employee_id: { 
    label: "Anställnings-ID", 
    type: "string", 
    required: true,
    synonyms: ["employee_id", "emp id", "id", "medarbetar-id", "emp_code"]
  },
  name: { 
    label: "Namn", 
    type: "string", 
    required: true,
    synonyms: ["name", "namn", "full name", "full_name"]
  },
  gender: { 
    label: "Kön", 
    type: "enum", 
    required: true,
    options: ["male", "female", "other", "prefer_not_to_say"],
    synonyms: ["gender", "kön", "sex"]
  },
  department: { 
    label: "Avdelning", 
    type: "string", 
    required: true,
    synonyms: ["department", "avdelning", "team", "org unit"]
  },
  country: { 
    label: "Land", 
    type: "string", 
    required: true,
    synonyms: ["country", "land", "nation"]
  },
  base_salary_sek: { 
    label: "Grundlön (SEK)", 
    type: "number", 
    required: true,
    synonyms: ["base_salary_sek", "salary", "lön", "månadslön", "pay", "compensation"]
  },
  currency: { 
    label: "Valuta", 
    type: "string", 
    required: false, 
    default: "SEK",
    synonyms: ["currency", "valuta", "curr"]
  },
  hire_date: { 
    label: "Anställningsdatum", 
    type: "date", 
    required: false,
    synonyms: ["hire_date", "start date", "startdatum", "anställningsdatum"]
  },
} as const;

export type FieldKey = keyof typeof REQUIRED_FIELDS;

export function getRequiredFields(): FieldKey[] {
  return Object.entries(REQUIRED_FIELDS)
    .filter(([_, config]) => config.required)
    .map(([key, _]) => key as FieldKey);
}

export function getFieldConfig(field: FieldKey): FieldConfig {
  return REQUIRED_FIELDS[field];
}
