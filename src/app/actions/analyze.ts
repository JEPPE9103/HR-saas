"use server";

import { listTopGaps, getSummary } from "@/lib/insights";

export async function computeMetrics(datasetId: string) {
  // Demo: aggregate using existing utilities. In a real app, persist to Firestore.
  const [summary, topGaps] = await Promise.all([
    getSummary(datasetId),
    listTopGaps(datasetId, 10),
  ]);

  const metrics = {
    datasetId,
    computedAt: new Date().toISOString(),
    summary,
    gaps: topGaps,
    variance: [],
    outliers: [],
    benchmarks: [],
  };
  return metrics;
}


