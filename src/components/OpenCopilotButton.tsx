"use client";

import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/app";

export function OpenCopilotButton({ label = "Open Copilot" }: { label?: string }) {
  const setOpen = useAppStore((s) => s.setCopilotOpen);
  return (
    <Button onClick={() => setOpen(true)} className="btn btn-ghost">{label}</Button>
  );
}


