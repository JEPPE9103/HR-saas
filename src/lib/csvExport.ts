import type { PayGapByDepartmentItem, PayGapByRoleItem } from "@/types";

function toCsvRow(values: (string | number)[]): string {
  return values
    .map((v) => {
      const s = String(v ?? "");
      if (s.includes(",") || s.includes("\n") || s.includes('"')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    })
    .join(",");
}

export function buildAnalyticsCsv(
  roleGaps: PayGapByRoleItem[],
  deptGaps: PayGapByDepartmentItem[],
  compliance: number
): string {
  const parts: string[] = [];
  parts.push("Compliance Score");
  parts.push(toCsvRow(["scorePercent"]));
  parts.push(toCsvRow([compliance.toFixed(2)]));
  parts.push("");

  parts.push("Pay Gap By Role");
  parts.push(toCsvRow(["roleName", "maleAvg", "femaleAvg", "gapPercent", "countMale", "countFemale"]));
  for (const r of roleGaps) {
    parts.push(
      toCsvRow([
        r.roleName,
        r.maleAvg.toFixed(2),
        r.femaleAvg.toFixed(2),
        r.gapPercent.toFixed(2),
        r.countMale,
        r.countFemale,
      ])
    );
  }
  parts.push("");

  parts.push("Pay Gap By Department");
  parts.push(toCsvRow(["departmentName", "maleAvg", "femaleAvg", "gapPercent", "countMale", "countFemale"]));
  for (const d of deptGaps) {
    parts.push(
      toCsvRow([
        d.departmentName,
        d.maleAvg.toFixed(2),
        d.femaleAvg.toFixed(2),
        d.gapPercent.toFixed(2),
        d.countMale,
        d.countFemale,
      ])
    );
  }

  return parts.join("\n");
}

export function triggerDownload(filename: string, content: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


