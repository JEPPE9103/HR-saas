import { NextRequest, NextResponse } from "next/server";

// Stub: save selected column mapping for a dataset
export async function POST(req: NextRequest) {
  try {
    const { datasetId, mapping } = await req.json();
    if (!datasetId) throw new Error("datasetId required");
    // In real impl, persist mapping in Firestore
    return NextResponse.json({ ok: true, datasetId, saved: mapping });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "mapping failed" }, { status: 400 });
  }
}


