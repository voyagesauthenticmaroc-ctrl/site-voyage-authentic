'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Cookie } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Clarity from '@microsoft/clarity';

const CONSENT_KEY = 'cookie-consent';
const CLARITY_ID = 'xintudhmh4';
export const OPEN_CONSENT_EVENT = 'open-cookie-consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function initClarity(granted: boolean) {
  if (granted) {
    Clarity.init(CLARITY_ID);
    Clarity.consentV2({ ad_Storage: 'granted', analytics_Storage: 'granted' });
  }
}

export function CookieConsent() {
  const t = useTranslations('cookies');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const open = () => setVisible(true);
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        setVisible(true);
      } else {
        initClarity(consent === 'granted');
      }
    } catch {
      /* localStorage indisponible (navigation privée stricte) : pas de bannière */
    }
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  const choose = (granted: boolean) => {
    try {
      localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
    } catch {
      /* le choix ne sera pas mémorisé, mais on applique quand même */
    }
    const value = granted ? 'granted' : 'denied';
    window.gtag?.('consent', 'update', {
      analytics_storage: value,
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
    });
    initClarity(granted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('ariaLabel')}
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-[9998] rounded-2xl overflow-hidden bg-white animate-fade-up"
      style={{
        border: '1px solid var(--cream-deep)',
        boxShadow: '0 16px 48px rgba(23,19,16,0.18), 0 2px 8px rgba(23,19,16,0.08)',
      }}
    >
      <div
        className="h-[3px]"
        style={{ background: 'linear-gradient(90deg, var(--gold) 0%, var(--accent) 100%)' }}
        aria-hidden="true"
      />
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          <span
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent-pale)' }}
            aria-hidden="true"
          >
            <Cookie size={22} style={{ color: 'var(--accent-dark)' }} />
          </span>
          <div>
            <p className="font-display text-base font-semibold leading-snug" style={{ color: 'var(--ink)' }}>
              {t('title')}
            </p>
            <p className="text-[0.82rem] leading-relaxed mt-1.5" style={{ color: 'var(--warm-gray)' }}>
              {t('message')}{' '}
              <Link
                href="/mentions-legales"
                className="underline underline-offset-2 transition-colors"
                style={{ color: 'var(--gold-dark)' }}
              >
                {t('learnMore')}
              </Link>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 mt-5">
          <button type="button" onClick={() => choose(true)} className="btn btn-primary text-xs flex-1">
            {t('accept')}
          </button>
          <button
            type="button"
            onClick={() => choose(false)}
            className="btn text-xs flex-1"
            style={{ background: 'transparent', color: 'var(--warm-gray)', borderColor: 'var(--cream-deep)' }}
          >
            {t('decline')}
          </button>
        </div>
      </div>
    </div>
  );
}
