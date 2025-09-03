import React from "react";

interface PageTitleProps {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function PageTitle({ children, subtitle }: PageTitleProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl md:text-6xl font-light text-slate-800 mb-4 leading-tight tracking-tight">
        {children}
      </h1>
      {subtitle && (
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
          {subtitle}
        </p>
      )}
    </div>
  );
}


