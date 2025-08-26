import { mockSnapshot } from "@/mocks/mockSnapshots";
import { mockInsights } from "@/mocks/mockInsights";

export async function uploadCsv(_fileOrDemo: File | "demo") {
  return { jobId: "job-demo" };
}

export async function getJobStatus(_jobId: string) {
  return { status: "done", snapshotId: mockSnapshot.id } as const;
}

export async function getSnapshot(snapshotId: string) {
  if (snapshotId !== mockSnapshot.id) return null;
  return mockSnapshot;
}

export async function getInsights(snapshotId: string) {
  if (snapshotId !== mockSnapshot.id) return [];
  return mockInsights;
}

export async function simulate(_snapshotId: string, _scenario: any) {
  return { deltaGap: -3.2, cost: 42000, impacted: 18, chart: [7, 6.2, 5.8, 4.9] };
}

export async function exportPdf(_snapshotId: string) {
  const blob = new Blob(["PDF mock"], { type: "application/pdf" });
  return URL.createObjectURL(blob);
}

export async function exportCsv(_snapshotId: string) {
  const blob = new Blob(["employeeId,newBase\nE1,47000\n"], { type: "text/csv" });
  return URL.createObjectURL(blob);
}


