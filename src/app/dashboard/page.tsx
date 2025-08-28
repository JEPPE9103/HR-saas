import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const kpis = [
  { label: "Gender pay gap", value: 5.6, delta: -0.8, suffix: "%" },
  { label: "High-variance roles", value: 4, delta: -1, suffix: "" },
  { label: "Compliance-risk sites", value: 2, delta: +1, suffix: "" },
  { label: "Employees analyzed", value: 523, delta: +23, suffix: "" },
];

const gapTrend = [
  { m: "Aug", gap: 6.2, bench: 5.5 },
  { m: "Sep", gap: 5.9, bench: 5.4 },
  { m: "Oct", gap: 5.7, bench: 5.3 },
  { m: "Nov", gap: 5.4, bench: 5.2 },
  { m: "Dec", gap: 5.2, bench: 5.2 },
  { m: "Jan", gap: 5.1, bench: 5.1 },
  { m: "Feb", gap: 5.0, bench: 5.1 },
  { m: "Mar", gap: 5.3, bench: 5.1 },
  { m: "Apr", gap: 5.4, bench: 5.0 },
  { m: "May", gap: 5.5, bench: 5.0 },
  { m: "Jun", gap: 5.6, bench: 5.0 },
  { m: "Jul", gap: 5.6, bench: 5.0 },
];

const roles = [
  { role: "Software Engineer", varx: 0.34 },
  { role: "Project Manager", varx: 0.28 },
  { role: "Data Analyst", varx: 0.25 },
  { role: "Sales Executive", varx: 0.22 },
];

const sites = [
  { site: "Volvo Cars", severity: "High", score: 0.82 },
  { site: "H&M", severity: "Medium", score: 0.55 },
  { site: "Ericsson", severity: "Low", score: 0.28 },
];

const insights = [
  {
    title: "Engineering gap 8.2% (High)",
    body: "Recommend +5% adj for IC2–IC4. Est. budget +€240k, new gap 2.1%.",
  },
  {
    title: "H&M har 2 outliers >40% över median",
    body: "Se över undantag; föreslå tak vid P90 för IC-nivåer.",
  },
  {
    title: "Female % in leadership trending down",
    body: "Set target P50 by Q4; simulate promotion uplift for top performers.",
  },
];

export default function DashboardPage(){
  return (
    <Suspense fallback={<div />}>
      <DashboardClient />
    </Suspense>
  );
}

