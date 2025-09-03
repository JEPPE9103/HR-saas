"use client";

interface StepperProps {
  currentStep: number;
  steps: string[];
}

export default function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            {/* Step circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentStep
                  ? 'bg-[var(--success)] text-white'
                  : index === currentStep
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--muted)] text-[var(--text-muted)]'
              }`}
            >
              {index < currentStep ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            
            {/* Step label */}
            <span
              className={`ml-2 text-sm font-medium ${
                index <= currentStep ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'
              }`}
            >
              {step}
            </span>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 ml-4 ${
                  index < currentStep ? 'bg-[var(--success)]' : 'bg-[var(--muted)]'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
