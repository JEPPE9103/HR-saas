import CopilotDemo from "./CopilotDemo";
import HeroChart from "./HeroChart";

export default function HeroSection(){
  return (
    <section className="grid items-start gap-8 md:grid-cols-2">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          EU Directive ready • GDPR safe
        </div>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
          Pay Equity. <span className="text-indigo-300">Simplified.</span>
        </h1>
        <p className="mt-3 max-w-lg text-slate-300">
          Our AI Copilot analyzes your pay data, detects outliers, and checks compliance guardrails. Export an executive‑ready brief in minutes.
        </p>
        {/* Metrics row + CTAs */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-slate-300">Avg gap</div>
            <div className="text-2xl font-semibold text-white">5.6%</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-slate-300">Sites with risk</div>
            <div className="text-2xl font-semibold text-white">2</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-slate-300">Time to export</div>
            <div className="text-2xl font-semibold text-white">&lt; 2 min</div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a href="/import" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Get started</a>
          <a href="/dashboard?datasetId=demo-se" className="rounded-lg border border-teal-300/40 bg-teal-300/10 px-4 py-2 text-teal-200 hover:bg-teal-300/20">Try demo</a>
          <div className="ml-2 hidden md:block"><CopilotDemo /></div>
        </div>
      </div>
      <HeroChart />
    </section>
  );
}


