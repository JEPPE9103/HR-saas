"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppStore } from "@/store/app";

interface Message { role: "user" | "assistant"; content: string }

export function CopilotPanel({ datasetId }: { datasetId: string }) {
  const isOpen = useAppStore((s) => s.isCopilotOpen);
  const setOpenGlobal = useAppStore((s) => s.setCopilotOpen);
  const [open, setOpen] = useState(isOpen);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [open, messages]);

  useEffect(() => { setOpen(isOpen); }, [isOpen]);
  useEffect(() => { setOpenGlobal(open); }, [open, setOpenGlobal]);

  async function send() {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    // call API (stubbed)
    const res = await fetch("/api/copilot/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: "local", datasetId, message: text }),
    });
    const data = await res.json().catch(() => ({ text: "(demo) Coming soon." }));
    setMessages((m) => [...m, { role: "assistant", content: data.text ?? "(demo) Coming soon." }]);
  }

  function Quick({ label, value }: { label: string; value: string }) {
    return (
      <Button variant="ghost" onClick={() => setInput(value)} className="h-8">
        {label}
      </Button>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-40">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-sky-600 text-white px-4 py-3 text-sm font-semibold shadow-lg shadow-sky-700/30 hover:bg-sky-500"
        >
          Open Copilot
        </button>
      )}
      {/* Overlay and slide-over */}
      <div className={`${open ? "pointer-events-auto" : "pointer-events-none"} fixed inset-0 z-40`}> 
        {/* Dim backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        {/* Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-[640px] transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="h-full rounded-l-3xl border-l border-[var(--ring)] bg-[var(--card)] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[var(--ring)] flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--text)]">Pay Transparency Copilot</h2>
              <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
            </div>
            <div ref={panelRef} className="flex-1 overflow-auto p-4 space-y-3">
              {[...messages].reverse().map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div className={
                    m.role === "user"
                      ? "inline-block max-w-[80%] rounded-2xl px-3 py-2 bg-[var(--accent)] text-white"
                      : "inline-block max-w-[80%] rounded-2xl px-3 py-2 border border-[var(--ring)] bg-[var(--card)]"
                  }>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            {/* Slash commands + input */}
            <div className="p-3 border-t border-[var(--ring)]">
              <div className="mb-2 flex gap-2 flex-wrap">
                <Quick label="/gap" value="/gap show top" />
                <Quick label="/outliers" value="/outliers list" />
                <Quick label="/simulate" value='"/simulate role:\"Engineer\" +5%"' />
                <Quick label="/report" value="/report export" />
              </div>
              <div className="flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." />
                <Button onClick={send}>Send</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


