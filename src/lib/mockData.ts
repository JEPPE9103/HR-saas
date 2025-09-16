export type Employee = {
  id: string;
  gender: 'M' | 'F';
  role: string;
  level: string;
  department: string;
  site: string;
  salary: number;
  fte: number;
  startDate: string; // ISO
};

export const EU_TARGET_GAP_PCT = 3; // 3%

// Small mock dataset (aggregates roughly match demo trends)
export const employees: Employee[] = Array.from({ length: 60 }).map((_, i) => {
  const departments = ['Engineering', 'Support', 'Sales', 'HR', 'Finance'];
  const roles = ['Engineer', 'Support Agent', 'Account Exec', 'HRBP', 'Analyst'];
  const sites = ['Stockholm', 'Gothenburg', 'Malmö'];
  const dept = departments[i % departments.length];
  const role = roles[i % roles.length];
  const site = sites[i % sites.length];
  const gender: 'M'|'F' = i % 2 === 0 ? 'M' : 'F';
  const level = ['Junior', 'Mid', 'Senior'][i % 3];
  const base = role === 'Engineer' ? 54000 : role === 'Account Exec' ? 52000 : role === 'Analyst' ? 50000 : 45000;
  const variance = (i % 7) * 800 + (gender === 'M' ? 1000 : -1000);
  return {
    id: `E${i+1}`,
    gender,
    role,
    level,
    department: dept,
    site,
    salary: Math.max(32000, base + variance),
    fte: 1,
    startDate: `202${(i%4)+1}-0${(i%8)+1}-15`,
  };
});

export type MonthlyGap = { month: string; gap: number };
export const payGapTrend: MonthlyGap[] = [
  { month: 'Jan', gap: 7.8 },
  { month: 'Feb', gap: 7.5 },
  { month: 'Mar', gap: 7.2 },
  { month: 'Apr', gap: 6.9 },
  { month: 'May', gap: 6.6 },
  { month: 'Jun', gap: 6.1 },
  { month: 'Jul', gap: 5.9 },
  { month: 'Aug', gap: 5.6 },
  { month: 'Sep', gap: 5.3 },
  { month: 'Oct', gap: 5.0 },
  { month: 'Nov', gap: 4.8 },
  { month: 'Dec', gap: 4.6 },
];

export const roleCompare = [
  { role: 'Engineer', male: 56000, female: 53000 },
  { role: 'Support', male: 42000, female: 40000 },
  { role: 'Sales', male: 54000, female: 51000 },
  { role: 'HR', male: 48000, female: 47000 },
  { role: 'Finance', male: 52000, female: 50000 },
];

export const departmentRiskGrid = [
  { department: 'Engineering', risk: 0.6 },
  { department: 'Support', risk: 0.8 },
  { department: 'Sales', risk: 0.5 },
  { department: 'HR', risk: 0.3 },
  { department: 'Finance', risk: 0.4 },
];

export const sites = [
  { site: 'Stockholm', risk: 'Medium' },
  { site: 'Gothenburg', risk: 'High' },
  { site: 'Malmö', risk: 'Low' },
];

export const insightsSamples = [
  'IT has a 6.2% median gap (⚠️ Warning).',
  'Stockholm site improved by 0.8 pp vs last year.',
  'Raising Support salaries by 2% reduces overall gap to 2.7%.',
];


