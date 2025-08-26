import Papa from "papaparse";
import { z } from "zod";
import type { Employee, Gender, ParseError } from "@/types";

const genderSchema = z
  .string()
  .transform((v) => v.trim().toLowerCase())
  .refine((v) => ["male", "female", "other", "unspecified"].includes(v), {
    message: "Invalid gender",
  }) as unknown as z.ZodType<Gender>;

const employeeSchema = z.object({
  employeeCode: z.string().min(1).transform((v) => v.trim()),
  firstName: z.string().min(1).transform((v) => v.trim()),
  lastName: z.string().min(1).transform((v) => v.trim()),
  gender: genderSchema,
  department: z.string().min(1).transform((v) => v.trim()),
  role: z.string().min(1).transform((v) => v.trim()),
  basePay: z
    .string()
    .transform((v) => Number(String(v).replace(/\s|,/g, "")))
    .refine((n) => Number.isFinite(n), { message: "basePay must be a number" }),
  bonus: z
    .string()
    .transform((v) => Number(String(v).replace(/\s|,/g, "")))
    .refine((n) => Number.isFinite(n), { message: "bonus must be a number" }),
  currency: z.string().min(1).transform((v) => v.trim()),
  fte: z
    .string()
    .transform((v) => Number(String(v).trim()))
    .refine((n) => n >= 0 && n <= 1, { message: "fte must be in [0,1]" }),
  hireDate: z
    .string()
    .transform((v) => v.trim())
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), { message: "Invalid date" }),
});

export const csvRowHeaders = [
  "employeeCode",
  "firstName",
  "lastName",
  "gender",
  "department",
  "role",
  "basePay",
  "bonus",
  "currency",
  "fte",
  "hireDate",
] as const;

type CsvRecord = Record<(typeof csvRowHeaders)[number], string>;

export async function parseCsvFile(file: File): Promise<{ data: Employee[]; errors: ParseError[] }> {
  const text = await file.text();
  return parseCsvText(text);
}

export function parseCsvText(text: string): { data: Employee[]; errors: ParseError[] } {
  const result = Papa.parse<CsvRecord>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  const data: Employee[] = [];
  const errors: ParseError[] = [];

  if (Array.isArray(result.data)) {
    result.data.forEach((raw, idx) => {
      const rowNumber = idx + 2; // header is row 1
      const parsed = employeeSchema.safeParse(raw);
      if (parsed.success) {
        data.push(parsed.data);
      } else {
        parsed.error.issues.slice(0, 3).forEach((issue) => {
          errors.push({
            row: rowNumber,
            field: issue.path?.[0] as string | undefined,
            message: issue.message,
          });
        });
      }
    });
  }

  if (result.errors && result.errors.length) {
    result.errors.slice(0, 10).forEach((e) => {
      errors.push({ row: (e.row ?? 0) + 1, message: e.message });
    });
  }

  return { data, errors };
}


