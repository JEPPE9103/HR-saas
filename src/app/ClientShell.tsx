"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { I18nProvider } from "@/providers/I18nProvider";
// Legacy components moved to _quarantine - using stubs
import { SimulationDrawer } from "@/components/stubs";
import { SiteHeader } from "@/components/SiteHeader";
import { OpenCopilotButton } from "@/components/OpenCopilotButton";
import { Footer } from "@/components/ui/Footer";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <SiteHeader />
          <main className="container-pro py-10 md:py-12">{children}</main>
          <Footer />
          {/* Legacy components moved to _quarantine - using stubs */}
          <SimulationDrawer />
          {/* Global AI Copilot */}
          <OpenCopilotButton />
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}


