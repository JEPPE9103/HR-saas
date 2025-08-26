export type Gender = "male" | "female" | "other" | "unspecified";

export interface Employee {
  employeeCode: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  department: string;
  role: string;
  basePay: number;
  bonus: number;
  currency: string;
  fte: number; // 0..1
  hireDate: string; // YYYY-MM-DD
}

export interface ParseError {
  row: number; // 1-based row index including header row
  field?: string;
  message: string;
}

export interface PayGapByRoleItem {
  roleName: string;
  maleAvg: number;
  femaleAvg: number;
  gapPercent: number; // (maleAvg - femaleAvg) / maleAvg * 100
  countMale: number;
  countFemale: number;
}

export interface PayGapByDepartmentItem {
  departmentName: string;
  maleAvg: number;
  femaleAvg: number;
  gapPercent: number;
  countMale: number;
  countFemale: number;
}


