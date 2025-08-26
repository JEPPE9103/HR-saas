import { NextRequest, NextResponse } from "next/server";

// Stub: trigger analysis for a dataset and return fake metrics timestamp
export async function POST(req: NextRequest) {
  try {
    const { datasetId } = await req.json();
    if (!datasetId) throw new Error("datasetId required");
    const computedAt = new Date().toISOString();
    // In real impl, enqueue Cloud Function / Server Action
    return NextResponse.json({ ok: true, datasetId, computedAt });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "analyze failed" }, { status: 400 });
  }
}


