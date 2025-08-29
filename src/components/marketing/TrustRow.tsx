"use client";

import { ShieldCheck, Lock, Award, CheckCircle } from "lucide-react";
import { useI18n } from "@/providers/I18nProvider";

export default function TrustRow() {
  const { t } = useI18n();

  return (
    <div className="flex items-center justify-center gap-6 py-4">
      {/* Compliance badges */}
      <div className="flex items-center gap-4">
        <div className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1 ring-[var(--ring)] bg-[var(--panel)] text-[var(--text)]">
          <ShieldCheck className="h-3 w-3" /> {t("home.compliance.euDirective")}
        </div>
        <div className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1 ring-[var(--ring)] bg-[var(--panel)] text-[var(--text)]">
          <Lock className="h-3 w-3" /> {t("home.compliance.gdprSafe")}
        </div>
        <div className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1 ring-[var(--ring)] bg-[var(--panel)] text-[var(--text)]">
          <Award className="h-3 w-3" /> {t("home.compliance.iso27001")}
        </div>
        <div className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1 ring-[var(--ring)] bg-[var(--panel)] text-[var(--text)]">
          <CheckCircle className="h-3 w-3" /> {t("home.compliance.soc2Ready")}
        </div>
      </div>
      
      {/* Divider */}
      <div className="w-px h-6 bg-[var(--ring)]"></div>
      
      {/* Trusted by text */}
      <div className="text-sm text-[var(--text-muted)]">
        {t("hero.trustedBy")}
      </div>
      
      {/* Logo placeholders */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-8 bg-[var(--neutral-soft-bg)] rounded flex items-center justify-center text-xs text-[var(--text-muted)]">
          LOGO 1
        </div>
        <div className="w-16 h-8 bg-[var(--neutral-soft-bg)] rounded flex items-center justify-center text-xs text-[var(--text-muted)]">
          LOGO 2
        </div>
        <div className="w-16 h-8 bg-[var(--neutral-soft-bg)] rounded flex items-center justify-center text-xs text-[var(--text-muted)]">
          LOGO 3
        </div>
      </div>
    </div>
  );
}
