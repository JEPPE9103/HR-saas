import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import ClientShell from "./ClientShell";
import { SafeThemeScript } from "@/components/SafeThemeScript";
import { CopilotPanel } from "@/components/copilot/CopilotPanel";
import { SimulationDrawer } from "@/components/SimulationDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transpara (demo)",
  description: "Client-side CSV analytics demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <SafeThemeScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <Suspense fallback={<div />}>
          <ClientShell>{children}</ClientShell>
        </Suspense>
      </body>
    </html>
  );
}
