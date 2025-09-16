"use client";

import { FileDown, Share2, FileText } from "lucide-react";

type Props = {
  onExportPdf?: () => void;
  onExportCsv?: () => void;
  onShare?: () => void;
};

export function ExportButtons({ onExportPdf, onExportCsv, onShare }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={onExportPdf} className="btn btn-primary">
        <FileText className="h-4 w-4" /> Export PDF
      </button>
      <button onClick={onExportCsv} className="btn btn-ghost">
        <FileDown className="h-4 w-4" /> Export CSV
      </button>
      <button onClick={onShare} className="btn btn-ghost">
        <Share2 className="h-4 w-4" /> Share link
      </button>
    </div>
  );
}


