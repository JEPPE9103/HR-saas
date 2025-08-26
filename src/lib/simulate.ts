export type SimParams = {
  datasetId: string;
  filter?: { role?: string; department?: string; site?: string };
  method: "percentageDelta" | "targetPercentile";
  value: number; // percent or percentile
};

export async function runSimulation(params: SimParams) {
  // Demo-only: return a fake structure
  const headcount = 42;
  const budgetDeltaMonthly = 120000; // SEK
  const result = {
    impacted: headcount,
    newMedians: { male: 52000, female: 50000 },
    gapPercent: ((52000 - 50000) / 52000) * 100,
    budgetDelta: { monthly: budgetDeltaMonthly, annual: budgetDeltaMonthly * 12 },
    employees: Array.from({ length: 8 }).map((_, i) => ({
      employeeId: `E${1000 + i}`,
      currentBase: 45000 + i * 500,
      newBase: 47000 + i * 500,
    })),
  };
  return result;
}


