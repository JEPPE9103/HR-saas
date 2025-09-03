"use client";

interface StepperProps {
  steps: string[];
  active: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function Stepper({ steps, active, onStepClick, className = "" }: StepperProps) {
  return (
    <ol className={`flex items-center gap-8 text-sm ${className}`}>
      {steps.map((label, i) => (
        <li key={label} className="flex items-center gap-3">
          <button
            onClick={() => onStepClick?.(i + 1)}
            disabled={!onStepClick}
            className={[
              "inline-flex h-8 w-8 items-center justify-center rounded-full border-2 font-medium transition-all duration-300",
              i < active ? "bg-gradient-to-r from-mint-500 to-teal-500 text-white border-transparent shadow-lg" :
              i === active ? "bg-gradient-to-r from-coral-500 to-rose-500 text-white border-transparent shadow-lg" :
              "border-slate-300 text-slate-500 bg-white hover:border-slate-400 hover:text-slate-600"
            ].join(" ")}
          >
            {i + 1}
          </button>
          <span className={[
            "font-medium transition-colors duration-300",
            i < active ? "text-teal-700" :
            i === active ? "text-coral-700" :
            "text-slate-500"
          ].join(" ")}>
            {label}
          </span>
          {i < steps.length - 1 && (
            <div className={[
              "w-12 h-0.5 transition-colors duration-300",
              i < active ? "bg-gradient-to-r from-teal-400 to-teal-300" : "bg-slate-300"
            ].join(" ")} />
          )}
        </li>
      ))}
    </ol>
  );
}
