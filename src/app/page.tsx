import TrustStrip from "@/components/TrustStrip";
import FeatureCard from "@/components/FeatureCard";
import HeroSection from "@/components/hero/HeroSection";
import { Bot, ShieldCheck, BarChart3 } from "lucide-react";

export default function HomePage(){
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <HeroSection />

      {/* TRUST */}
      <section className="mt-10">
        <TrustStrip />
      </section>

      {/* FEATURES */}
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <FeatureCard icon={<BarChart3 className="h-4 w-4 text-indigo-300" />} title="Analyze pay gaps">
          Smart metrics, trends and variance by role, dept and site.
        </FeatureCard>
        <FeatureCard icon={<Bot className="h-4 w-4 text-teal-300" />} title="Copilot insights">
          Ask natural questions. Get actionable answers with next steps.
        </FeatureCard>
        <FeatureCard icon={<ShieldCheck className="h-4 w-4 text-emerald-300" />} title="Ensure compliance">
          EU Pay Transparency directive guardrails. Audit log built‑in.
        </FeatureCard>
      </section>

      {/* HOW IT WORKS (compressed) */}
      <section className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">How it works</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
          <li className="rounded-lg border border-white/10 bg-slate-900/40 p-4">1) Upload CSV → map gender, role, dept, pay.</li>
          <li className="rounded-lg border border-white/10 bg-slate-900/40 p-4">2) Get insights → gaps, outliers, compliance risks.</li>
          <li className="rounded-lg border border-white/10 bg-slate-900/40 p-4">3) Simulate & export → executive PDF + anonymized CSV.</li>
        </ol>
        <div className="mt-5 flex gap-3">
          <a href="/dashboard?datasetId=demo-se" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Start with sample data</a>
          <a href="/import" className="rounded-lg border border-white/10 px-4 py-2 text-slate-200 hover:bg-white/5">Upload your data</a>
        </div>
      </section>

      <footer className="mt-12 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} PayTransparency — EU Pay Transparency Directive ready.
      </footer>
    </main>
  );
}
