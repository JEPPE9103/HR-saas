"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { I18nProvider } from "@/providers/I18nProvider";
import { CopilotPanel } from "@/components/copilot/CopilotPanel";
import { SimulationDrawer } from "@/components/SimulationDrawer";
import { SiteHeader } from "@/components/SiteHeader";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <SiteHeader />
          <main className="container-pro py-10 md:py-12">{children}</main>
          <CopilotPanel datasetId="demo-se" />
          <SimulationDrawer />
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}


