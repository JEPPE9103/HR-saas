"use client";

import { useI18n } from "@/providers/I18nProvider";

export function FooterNote() {
  const { t } = useI18n();
  return (
    <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
      {t('import.footer.note')}
    </p>
  );
}
