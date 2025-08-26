export type Snapshot = {
  id: string;
  createdAt: string;
  kpis: { overallGapPct: number; rolesFlagged: number; riskLevel: "Low"|"Medium"|"High" };
  byRole: { role: string; maleMedian: number; femaleMedian: number; gapPct: number; headcount: number }[];
  trend: { month: string; gapPct: number }[];
  alerts: { role: string; gapPct: number; male: number; female: number }[];
  totals: { headcount: number; payrollSum: number };
};

export const mockSnapshot: Snapshot = {
  id: "demo-se",
  createdAt: new Date().toISOString(),
  kpis: { overallGapPct: 7.0, rolesFlagged: 3, riskLevel: "Medium" },
  byRole: [
    { role: "Engineer", maleMedian: 52000, femaleMedian: 48000, gapPct: 7.7, headcount: 46 },
    { role: "Developer", maleMedian: 50000, femaleMedian: 47000, gapPct: 6.0, headcount: 52 },
    { role: "Designer", maleMedian: 46000, femaleMedian: 45000, gapPct: 2.2, headcount: 20 },
  ],
  trend: [
    { month: "Jan", gapPct: 9 },
    { month: "Feb", gapPct: 8 },
    { month: "Mar", gapPct: 7 },
    { month: "Apr", gapPct: 6.5 },
    { month: "May", gapPct: 6.8 },
    { month: "Jun", gapPct: 6.4 },
  ],
  alerts: [
    { role: "Engineer", gapPct: 8.0, male: 43, female: 33 },
    { role: "Developer", gapPct: 7.1, male: 42, female: 35 },
    { role: "Sales", gapPct: 5.2, male: 34, female: 28 },
  ],
  totals: { headcount: 300, payrollSum: 15000000 },
};


