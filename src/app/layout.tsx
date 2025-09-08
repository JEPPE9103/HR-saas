import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import ClientShell from "./ClientShell";
import { SafeThemeScript } from "@/components/SafeThemeScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Noxheim – Pay Equity. Simplified.",
    template: "%s · Noxheim",
  },
  description: "EU pay transparency demo – import, insights, and scenario simulation.",
  openGraph: {
    title: "Noxheim",
    description: "EU pay transparency demo – import, insights, and scenario simulation.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noxheim",
    description: "EU pay transparency demo – import, insights, and scenario simulation.",
  },
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
