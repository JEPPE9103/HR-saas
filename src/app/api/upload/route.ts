import { NextRequest, NextResponse } from "next/server";

// Stub: accepts file metadata, returns fake storagePath + datasetId
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // In real impl, parse multipart/form-data and upload to Storage
    const datasetId = body?.datasetId || `ds_${Math.random().toString(36).slice(2, 8)}`;
    const storagePath = `uploads/${datasetId}/source.csv`;
    return NextResponse.json({ ok: true, datasetId, storagePath });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "upload failed" }, { status: 400 });
  }
}


