import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSummary, listTopGaps, listOutliers } from "@/lib/insights";
import { runSimulation } from "@/lib/simulate";
import { exportCSV, exportPDF } from "@/lib/exports";

const Body = z.object({
  sessionId: z.string(),
  datasetId: z.string(),
  message: z.string(),
});

export async function POST(req: NextRequest) {
  const { sessionId, datasetId, message } = Body.parse(await req.json());
  // Very small rule-based demo answering using tools
  const lower = message.toLowerCase();
  if (lower.startsWith("/gap")) {
    const gaps = await listTopGaps(datasetId, 5);
    return NextResponse.json({ text: `Top gaps: ${gaps.map(g=>`${g.role}: ${g.gapPercent.toFixed(1)}%`).join(", ")}. Next: run /simulate or /report.` });
  }
  if (lower.startsWith("/outliers")) {
    const o = await listOutliers(datasetId, 10);
    return NextResponse.json({ text: `Found ${o.items.length} outliers (|z|>2). Median ${o.med.toFixed(0)}. Next: /report or /simulate.` });
  }
  if (lower.startsWith("/simulate")) {
    const sim = await runSimulation({ datasetId, method: "percentageDelta", value: 5 });
    return NextResponse.json({ text: `Impacted ${sim.impacted}, new gap ${sim.gapPercent.toFixed(1)}%, budget +${sim.budgetDelta.annual.toFixed(0)} SEK/yr. Next: /report` });
  }
  if (lower.startsWith("/report")) {
    const pdf = await exportPDF(datasetId);
    return NextResponse.json({ text: `Report generated: ${pdf.url}. Next: /simulate or /outliers.` });
  }
  const sum = await getSummary(datasetId);
  return NextResponse.json({ text: `Dataset ${sum.datasetId}: ${sum.employees} employees, ${sum.roles} roles. Try /gap or /simulate.` });
}


