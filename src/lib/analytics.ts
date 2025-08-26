import type {
  Employee,
  PayGapByDepartmentItem,
  PayGapByRoleItem,
} from "@/types";

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sum = nums.reduce((a, b) => a + b, 0);
  return sum / nums.length;
}

function comp(a: number, b: number) {
  return Math.abs(b) - Math.abs(a);
}

function gapPercent(maleAvg: number, femaleAvg: number): number {
  if (!Number.isFinite(maleAvg) || maleAvg === 0) return 0;
  return ((maleAvg - femaleAvg) / maleAvg) * 100;
}

export function payGapByRole(employees: Employee[]): PayGapByRoleItem[] {
  const groups = new Map<string, Employee[]>();
  for (const e of employees) {
    const key = e.role || "Unknown";
    const arr = groups.get(key) ?? [];
    arr.push(e);
    groups.set(key, arr);
  }
  const out: PayGapByRoleItem[] = [];
  for (const [roleName, arr] of groups) {
    const males = arr.filter((e) => e.gender === "male");
    const females = arr.filter((e) => e.gender === "female");
    const maleAvg = average(males.map((e) => e.basePay + e.bonus));
    const femaleAvg = average(females.map((e) => e.basePay + e.bonus));
    const countMale = males.length;
    const countFemale = females.length;
    if (countMale + countFemale < 2) continue; // skip too small
    out.push({ roleName, maleAvg, femaleAvg, gapPercent: gapPercent(maleAvg, femaleAvg), countMale, countFemale });
  }
  return out.sort((a, b) => comp(a.gapPercent, b.gapPercent));
}

export function payGapByDepartment(employees: Employee[]): PayGapByDepartmentItem[] {
  const groups = new Map<string, Employee[]>();
  for (const e of employees) {
    const key = e.department || "Unknown";
    const arr = groups.get(key) ?? [];
    arr.push(e);
    groups.set(key, arr);
  }
  const out: PayGapByDepartmentItem[] = [];
  for (const [departmentName, arr] of groups) {
    const males = arr.filter((e) => e.gender === "male");
    const females = arr.filter((e) => e.gender === "female");
    const maleAvg = average(males.map((e) => e.basePay + e.bonus));
    const femaleAvg = average(females.map((e) => e.basePay + e.bonus));
    const countMale = males.length;
    const countFemale = females.length;
    if (countMale + countFemale < 2) continue;
    out.push({ departmentName, maleAvg, femaleAvg, gapPercent: gapPercent(maleAvg, femaleAvg), countMale, countFemale });
  }
  return out.sort((a, b) => comp(a.gapPercent, b.gapPercent));
}

export function complianceScore(roleGaps: PayGapByRoleItem[]): number {
  if (roleGaps.length === 0) return 0;
  const ok = roleGaps.filter((g) => Math.abs(g.gapPercent) < 5).length;
  return (ok / roleGaps.length) * 100;
}

export function riskAreas(roleGaps: PayGapByRoleItem[]): PayGapByRoleItem[] {
  return roleGaps
    .filter((g) => Math.abs(g.gapPercent) >= 5)
    .sort((a, b) => Math.abs(b.gapPercent) - Math.abs(a.gapPercent))
    .slice(0, 5);
}


