"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { I18nProvider } from "@/providers/I18nProvider";
// Legacy components moved to _quarantine - using stubs
import { SimulationDrawer } from "@/components/stubs";
import { SiteHeader } from "@/components/SiteHeader";
import { CopilotPanel } from "@/components/copilot/CopilotPanel";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Footer } from "@/components/ui/Footer";

function ShellContent({ children }: { children: ReactNode }){
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (pathname === "/" || pathname === "/login") {
      router.replace("/overview");
    }
  }, [user, pathname, router]);

  return (
    <>
      <SiteHeader />
      <main className="container-pro py-10 md:py-12">{children}</main>
      <Footer />
      {/* Legacy components moved to _quarantine - using stubs */}
      <SimulationDrawer />
      {/* Global AI Copilot (single panel) */}
      <CopilotPanel />
    </>
  );
}

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <ShellContent>{children}</ShellContent>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}


