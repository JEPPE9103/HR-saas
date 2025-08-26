import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { UserMenu } from "@/components/UserMenu";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
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
        <ThemeProvider>
          <AuthProvider>
          {/* Top Nav - dark glass */}
          <div className="sticky top-0 z-20 w-full backdrop-blur bg-slate-900/70 ring-1 ring-white/10">
            <nav className="container-pro flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-white">+</div>
                <Link href="/" className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Pay<span className="text-slate-700 dark:text-slate-300">Transparency</span>
                </Link>
                <span className="ml-3 hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-800 sm:inline-flex">EU Directive Ready</span>
              </div>
              <div className="flex items-center gap-6 text-sm font-medium">
                <Link className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white" href="/">Home</Link>
                <Link className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white" href="/import">Import</Link>
                <Link className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white" href="/dashboard">Dashboard</Link>
                <Link className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white" href="/insights">Insights</Link>
                <Link className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white" href="/simulate">Simulate</Link>
                <Link className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white" href="/reports">Reports</Link>
                <Link className="btn btn-ghost" href="/dashboard?demo=1">Try demo</Link>
                <UserMenu />
              </div>
            </nav>
          </div>
          {/* Page content */}
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
      </body>
    </html>
  );
}
