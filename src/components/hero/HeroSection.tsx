import CopilotDemo from "./CopilotDemo";
import HeroChart from "./HeroChart";

export default function HeroSection(){
  return (
    <section className="grid items-center gap-8 md:grid-cols-2">
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
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a href="/import" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Get started</a>
          <a href="/dashboard?datasetId=demo-se" className="rounded-lg border border-teal-300/40 bg-teal-300/10 px-4 py-2 text-teal-200 hover:bg-teal-300/20">Try demo</a>
          <div className="ml-2 hidden sm:block"><CopilotDemo /></div>
        </div>
      </div>
      <HeroChart />
    </section>
  );
}


