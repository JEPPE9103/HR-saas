"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { CopilotPanel } from "@/components/copilot/CopilotPanel";
import { SimulationDrawer } from "@/components/SimulationDrawer";
import SiteHeader from "@/components/SiteHeader";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SiteHeader />
        <main className="container-pro py-10 md:py-12">{children}</main>
        <footer className="container-pro pb-10">
          <div className="card p-6 text-sm text-slate-400">
            © {new Date().getFullYear()} PayTransparency — EU Pay Transparency Directive ready.
          </div>
        </footer>
        <CopilotPanel datasetId="demo-se" />
        <SimulationDrawer />
      </AuthProvider>
    </ThemeProvider>
  );
}


