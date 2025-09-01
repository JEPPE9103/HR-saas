"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { I18nProvider } from "@/providers/I18nProvider";
// Legacy components moved to _quarantine - using stubs
import { CopilotPanel, SimulationDrawer } from "@/components/stubs";
import { SiteHeader } from "@/components/SiteHeader";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <SiteHeader />
          <main className="container-pro py-10 md:py-12">{children}</main>
          {/* Legacy components moved to _quarantine - using stubs */}
          <CopilotPanel datasetId="demo-se" />
          <SimulationDrawer />
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}


