'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { routing, LOCALE_LABELS, type Locale } from '@/i18n/routing';
import { Phone, Menu, X, MessageCircle, Globe } from 'lucide-react';
import { isPlaceholder } from '@/lib/placeholders';

export interface NavBarProps {
  agencyName: string;
  phoneDisplay: string;
  phoneRaw: string;
  whatsapp: string;
}

/** Liens de navigation — les libellés viennent de messages/{locale}.json */
const NAV_ITEMS = [
  { key: 'home', path: '/' },
  { key: 'tours', path: '/circuits' },
  { key: 'destinations', path: '/destinations' },
  { key: 'about', path: '/a-propos' },
  { key: 'reviews', path: '/avis' },
  { key: 'contact', path: '/contact' },
] as const;

/** Sélecteur de langue — bascule la page courante dans l'autre langue. */
function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations('nav');

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    // Pattern officiel next-intl : re-route la page courante avec ses params
    // @ts-expect-error — pathname + params sont corrélés à l'exécution
    router.replace({ pathname, params }, { locale: next });
  };

  return (
    <div
      className={`flex items-center gap-1 ${compact ? '' : 'border border-white/15 rounded-full px-1 py-0.5'}`}
      role="group"
      aria-label={t('language')}
    >
      {!compact && <Globe size={12} className="text-white/50 ml-1.5" aria-hidden />}
      {routing.locales.map((code) => (
        <button
          key={code}
          onClick={() => switchTo(code)}
          aria-pressed={code === locale}
          aria-label={LOCALE_LABELS[code]}
          className={`px-2 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wide transition-colors ${
            code === locale
              ? 'text-white'
              : 'text-white/50 hover:text-white'
          }`}
          style={code === locale ? { background: 'var(--accent)' } : {}}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export function NavBar({ agencyName, phoneDisplay, phoneRaw, whatsapp }: NavBarProps) {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(!isHome);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeAll = () => setDrawerOpen(false);

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const handle = () => setScrolled(window.scrollY > 60);
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <>
    <header
      role="banner"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-nil-deep/96 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.3)]'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="container-luxury relative flex items-center justify-between py-4"
        aria-label="Navigation principale"
      >
        {/* Logo — arche + palmier, wordmark empilé */}
        <Link
          href="/"
          className="group flex items-center gap-3 flex-shrink-0"
          aria-label={`${t('home')} — ${agencyName}`}
        >
          <svg viewBox="0 0 40 48" width="34" height="41" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="flex-shrink-0 opacity-95 group-hover:opacity-100 transition-opacity">
            <path d="M4 46V24C4 12 11 4 20 4C29 4 36 12 36 24V46" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M20 7L20.9 9.6L23.5 8.7L22 11L24.5 12L22 13L23.5 15.3L20.9 14.4L20 17L19.1 14.4L16.5 15.3L18 13L15.5 12L18 11L16.5 8.7L19.1 9.6Z" fill="var(--accent, #D9701F)"/>
            <path d="M20 40V28" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M20 28C17 26 13.5 26.5 12 28.5C15 28.8 18 29.5 20 28Z" fill="#FFFFFF"/>
            <path d="M20 28C23 26 26.5 26.5 28 28.5C25 28.8 22 29.5 20 28Z" fill="#FFFFFF"/>
            <path d="M20 28C18 24.8 18.4 21.8 20 20C20.6 22.8 21 26 20 28Z" fill="#FFFFFF"/>
            <path d="M20 28C16.8 27 14.6 24.5 14.5 22C17 23.5 19.4 25.5 20 28Z" fill="#FFFFFF"/>
            <path d="M20 28C23.2 27 25.4 24.5 25.5 22C23 23.5 20.6 25.5 20 28Z" fill="#FFFFFF"/>
          </svg>
          <div className="flex flex-col" style={{ lineHeight: 1.25 }}>
            <span className="text-white font-body font-bold text-[0.78rem] tracking-[0.13em] uppercase">
              Voyages
            </span>
            <span className="text-white font-body font-bold text-[0.78rem] tracking-[0.13em] uppercase">
              Authentiques
            </span>
            <span className="font-body font-bold text-[0.78rem] tracking-[0.3em] uppercase" style={{ color: 'var(--accent)' }}>
              Maroc
            </span>
          </div>
        </Link>

        {/* Desktop links — centrés en flux (pas d'absolu : évite tout chevauchement
            avec les actions de droite quand les libellés traduits sont plus longs) */}
        <ul className="hidden xl:flex items-center gap-5 list-none p-0 m-0 flex-nowrap mx-auto px-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`text-[0.68rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 whitespace-nowrap ${
                  pathname === item.path
                    ? 'text-white border-b-2 pb-1'
                    : 'text-white/70 hover:text-white'
                }`}
                style={pathname === item.path ? { borderColor: 'var(--accent)' } : {}}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden xl:flex items-center gap-4 flex-shrink-0">
          <LanguageSwitcher />
          {!isPlaceholder(phoneRaw) && (
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors"
            >
              <Phone size={13} strokeWidth={2} aria-hidden="true" />
              <span>{phoneDisplay}</span>
            </a>
          )}
          <Link href="/contact" className="btn btn-primary py-2.5 px-5 text-[0.65rem]">
            {tCommon('requestQuoteShort')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="xl:hidden text-white p-2 -mr-2 relative z-[60]"
          aria-label={drawerOpen ? t('closeMenu') : t('openMenu')}
          aria-expanded={drawerOpen}
          aria-controls="mobile-nav-menu"
        >
          <Menu size={24} className={`transition-all duration-200 ${drawerOpen ? 'opacity-0 scale-75 absolute' : 'opacity-100 scale-100'}`} />
          <X size={24} className={`transition-all duration-200 ${drawerOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75 absolute'}`} />
        </button>
      </nav>
    </header>

      <div
        id="mobile-nav-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        className={`xl:hidden fixed inset-0 top-[64px] z-50 bg-nil-deep/98 backdrop-blur-lg transition-all duration-300 overflow-y-auto ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="container-luxury pt-4 pb-24">
          <ul className="flex flex-col list-none p-0 m-0">
            {NAV_ITEMS.map((item) => (
              <li key={item.path} className="border-b border-white/8">
                <Link
                  href={item.path}
                  onClick={closeAll}
                  className="block py-4 text-white/90 hover:text-gold text-lg font-light font-display transition-colors"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <div className="flex justify-center">
              <LanguageSwitcher />
            </div>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#25D366] text-white rounded-xl py-4 text-base font-semibold"
              onClick={closeAll}
            >
              <MessageCircle size={20} />
              {t('contactWhatsApp')}
            </a>
            {!isPlaceholder(phoneRaw) && (
              <a
                href={`tel:${phoneRaw}`}
                className="flex items-center gap-3 text-white/80 text-base py-2"
              >
                <Phone size={18} className="text-gold" />
                {phoneDisplay}
              </a>
            )}
            <Link
              href="/contact"
              onClick={closeAll}
              className="btn btn-primary mt-2 w-full text-center"
            >
              {tCommon('requestQuote')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
