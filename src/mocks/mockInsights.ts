export type Insight = {
  id: string;
  type: "gap" | "outlier" | "compliance";
  title: string;
  description: string;
  severity: 1|2|3|4|5;
  role?: string;
  department?: string;
  site?: string;
};

export const mockInsights: Insight[] = [
  { id: "i1", type: "gap", title: "Engineering gap 8% (n=46)", description: "Median male vs female", severity: 4, role: "Engineer" },
  { id: "i2", type: "outlier", title: "Senior Dev outliers detected", description: "3 salaries above P97", severity: 3, role: "Developer" },
  { id: "i3", type: "compliance", title: "SE-2 site needs review", description: "Sample size close to threshold", severity: 2, site: "SE-2" },
];


