import sample from "@/sample/sample.json" assert { type: "json" };

export type DatasetId = string;

type Row = {
  employeeCode?: string;
  gender: string;
  role: string;
  department?: string;
  site?: string;
  country?: string;
  basePay: number;
  bonus: number;
};

function getRows(datasetId: DatasetId): Row[] {
  // For demo, we always return sample
  return (sample as any[]).map((r) => ({
    gender: String(r.gender).toLowerCase(),
    role: r.role,
    department: r.department,
    site: (r as any).site ?? "SE-1",
    country: (r as any).country ?? "SE",
    basePay: Number(r.basePay ?? 0),
    bonus: Number(r.bonus ?? 0),
  }));
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const a = [...values].sort((a, b) => a - b);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 === 0 ? (a[mid - 1] + a[mid]) / 2 : a[mid];
}

export async function getSummary(datasetId: DatasetId) {
  const rows = getRows(datasetId);
  const uniqueRoles = new Set(rows.map((r) => r.role)).size;
  const uniqueDepts = new Set(rows.map((r) => r.department ?? "")).size;
  return {
    employees: rows.length,
    roles: uniqueRoles,
    departments: uniqueDepts,
    datasetId,
    computedAt: new Date().toISOString(),
  };
}

export async function listTopGaps(datasetId: DatasetId, limit = 10) {
  const rows = getRows(datasetId);
  const byRole = new Map<string, Row[]>();
  for (const r of rows) {
    const arr = byRole.get(r.role) ?? [];
    arr.push(r);
    byRole.set(r.role, arr);
  }
  const items = [] as { role: string; gapPercent: number; maleMed: number; femaleMed: number; n: number }[];
  for (const [role, arr] of byRole) {
    const male = arr.filter((x) => x.gender === "male").map((x) => x.basePay + x.bonus);
    const female = arr.filter((x) => x.gender === "female").map((x) => x.basePay + x.bonus);
    if (male.length < 1 || female.length < 1) continue;
    const maleMed = median(male);
    const femaleMed = median(female);
    const gap = maleMed === 0 ? 0 : ((maleMed - femaleMed) / maleMed) * 100;
    items.push({ role, gapPercent: gap, maleMed, femaleMed, n: arr.length });
  }
  return items.sort((a, b) => Math.abs(b.gapPercent) - Math.abs(a.gapPercent)).slice(0, limit);
}

export async function listOutliers(datasetId: DatasetId, limit = 50) {
  const rows = getRows(datasetId);
  const amounts = rows.map((r) => r.basePay + r.bonus);
  const med = median(amounts);
  const mean = amounts.reduce((a, b) => a + b, 0) / (amounts.length || 1);
  const variance = amounts.reduce((a, b) => a + (b - mean) ** 2, 0) / (amounts.length || 1);
  const sd = Math.sqrt(variance);
  const result = rows
    .map((r) => ({ key: r.role, amount: r.basePay + r.bonus, z: sd ? (r.basePay + r.bonus - mean) / sd : 0 }))
    .filter((x) => Math.abs(x.z) > 2)
    .slice(0, limit);
  return { med, mean, sd, items: result };
}


