'use client';

import { OPEN_CONSENT_EVENT } from '@/components/CookieConsent';

export function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="text-white/25 hover:text-white/55 text-xs transition-colors"
    >
      {label}
    </button>
  );
}
