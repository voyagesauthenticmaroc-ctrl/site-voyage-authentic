'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { MapPin, Clock, ArrowRight, X, Tag } from 'lucide-react';
import { WishlistButton } from '@/components/WishlistButton';

/* ────────────────────────────────────────────────────────── */
/*  Types                                                     */
/* ────────────────────────────────────────────────────────── */

export interface CircuitCard {
  slug: string;
  name: string;
  category: string;
  hero: { image: string; tagline?: string };
  durationDays: number;
  departureCity: string;
  priceFrom: string | null;
  intro: string;
}

interface CircuitsGridProps {
  circuits: CircuitCard[];
  /** Ville pré-sélectionnée (ex. depuis /circuits?depart=Marrakech) */
  initialCity?: string;
}

/* ────────────────────────────────────────────────────────── */
/*  Constants & helpers                                       */
/* ────────────────────────────────────────────────────────── */

/* Sentinelles indépendantes de la langue pour les filtres « tout » */
const ALL_CITIES = '__all__';
const ALL_CATEGORIES = '__all__';
const MIN_DAYS = 1;

const CATEGORY_COLORS: Record<string, string> = {
  'Circuit désert':            'bg-amber-600/90 text-white',
  'Circuit villes impériales': 'bg-nil-deep/90 text-gold',
  'Circuit complet':           'bg-terra/90 text-white',
  'Circuit luxe':              'bg-gold/90 text-ink',
  'Excursion à la journée':    'bg-forest-deep/90 text-white',
};

/* ────────────────────────────────────────────────────────── */
/*  Card component                                            */
/* ────────────────────────────────────────────────────────── */

function CircuitCardItem({ c }: { c: CircuitCard }) {
  const t = useTranslations('filters');
  const tCommon = useTranslations('common');
  const catColor = CATEGORY_COLORS[c.category] ?? 'bg-nil-deep/90 text-white';
  const durationText = c.durationDays === 0 ? t('surMesure') : t('dayCount', { count: c.durationDays });

  return (
    <Link href={{ pathname: '/circuits/[slug]', params: { slug: c.slug } }} className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-2xl">
      <article className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.16)] transition-all duration-300 group-hover:-translate-y-1">

        {/* ── Image ── */}
        <div className="relative aspect-[4/3] overflow-hidden bg-parchment flex-shrink-0">
          <WishlistButton slug={c.slug} position="bottom-right" className="!w-9 !h-9" />
          <Image
            src={c.hero.image}
            alt={c.name}
            fill
            unoptimized
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 48vw, 95vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          {/* Category badge — top left */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center text-[0.65rem] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full backdrop-blur-sm ${catColor}`}>
              {c.category}
            </span>
          </div>

          {/* Duration badge — top right */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 bg-white/95 text-ink text-[0.72rem] font-bold px-2.5 py-1 rounded-full shadow-sm">
              <Clock size={10} strokeWidth={2.5} />
              {durationText}
            </span>
          </div>

          {/* Departure city — bottom left over image */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 text-white text-[0.72rem] font-medium drop-shadow-sm">
              <MapPin size={11} strokeWidth={2.5} className="text-gold" />
              {t('departure')} {c.departureCity}
            </span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col flex-1 p-5">
          <h3 className="font-display text-[1.05rem] leading-snug text-ink group-hover:text-nil-deep transition-colors duration-200 line-clamp-2">
            {c.name}
          </h3>

          {c.hero.tagline && (
            <p className="text-[0.8rem] text-text-muted mt-2 line-clamp-2 leading-relaxed">
              {c.hero.tagline}
            </p>
          )}

          <div className="flex-1" />

          {/* ── Footer : prix + lien ── */}
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-stone-100">
            {c.priceFrom ? (
              <div className="flex flex-col">
                <span className="text-[0.62rem] font-semibold uppercase tracking-wide text-text-muted">
                  {tCommon('from')}
                </span>
                <span className="font-bold text-[1.15rem] leading-tight" style={{ color: 'var(--accent-dark)' }}>
                  {c.priceFrom}
                  <span className="text-[0.7rem] font-medium text-text-muted"> {tCommon('perPerson')}</span>
                </span>
              </div>
            ) : (
              <span className="text-[0.72rem] text-text-muted font-medium">
                {tCommon('freeQuote24h')}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all duration-200 pb-0.5" style={{ color: 'var(--accent)' }}>
              {tCommon('seeMore')} <ArrowRight size={13} strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Empty state                                               */
/* ────────────────────────────────────────────────────────── */

function EmptyState({ onReset }: { onReset: () => void }) {
  const t = useTranslations('filters');
  return (
    <div className="py-24 text-center col-span-full">
      <MapPin size={40} className="text-parchment mx-auto mb-4" strokeWidth={1.5} />
      <p className="font-display text-xl text-ink">{t('noMatch')}</p>
      <p className="text-text-muted text-sm mt-2 mb-6">{t('tryChanging')}</p>
      <button onClick={onReset} className="btn btn-outline">
        {t('resetFilters')}
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Main component                                            */
/* ────────────────────────────────────────────────────────── */

export function CircuitsGrid({ circuits, initialCity }: CircuitsGridProps) {
  const t = useTranslations('filters');

  /* Villes de départ avec compteur, triées par nombre de circuits */
  const cityCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of circuits) map.set(c.departureCity, (map.get(c.departureCity) ?? 0) + 1);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [circuits]);

  const maxDataDays = useMemo(
    () => Math.max(MIN_DAYS, ...circuits.map((c) => c.durationDays)),
    [circuits]
  );

  const categories = useMemo(
    () => [ALL_CATEGORIES, ...Array.from(new Set(circuits.map((c) => c.category)))],
    [circuits]
  );

  const validInitialCity =
    initialCity && cityCounts.some(([name]) => name === initialCity) ? initialCity : ALL_CITIES;

  const [city, setCity] = useState(validInitialCity);
  const [minDays, setMinDays] = useState(MIN_DAYS);
  const [maxDays, setMaxDays] = useState(maxDataDays);
  const [category, setCategory] = useState(ALL_CATEGORIES);

  const filtered = useMemo(
    () =>
      circuits.filter(
        (c) =>
          (city === ALL_CITIES || c.departureCity === city) &&
          c.durationDays >= minDays &&
          c.durationDays <= maxDays &&
          (category === ALL_CATEGORIES || c.category === category)
      ),
    [circuits, city, minDays, maxDays, category]
  );

  const hasFilters =
    city !== ALL_CITIES || minDays !== MIN_DAYS || maxDays !== maxDataDays || category !== ALL_CATEGORIES;

  const reset = () => {
    setCity(ALL_CITIES);
    setMinDays(MIN_DAYS);
    setMaxDays(maxDataDays);
    setCategory(ALL_CATEGORIES);
  };

  const durationLabel =
    minDays === MIN_DAYS && maxDays === maxDataDays
      ? t('allDurations')
      : minDays === maxDays
        ? t('dayCount', { count: minDays })
        : t('dayRange', { min: minDays, max: maxDays });

  return (
    <div>
      {/* ══════════════════════════════════════════════════════ */}
      {/*  PANNEAU DE FILTRES                                   */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-stone-100 shadow-sm">
        <div className="container-luxury py-7 flex flex-col gap-6">

          {/* ── 1. Point de départ (mis en avant) ── */}
          <div>
            <p className="flex items-center gap-1.5 text-[0.8rem] font-bold text-ink uppercase tracking-wide mb-3">
              <MapPin size={15} strokeWidth={2.5} style={{ color: 'var(--accent)' }} />
              {t('departureCity')}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setCity(ALL_CITIES)}
                aria-pressed={city === ALL_CITIES}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.85rem] font-medium transition-all duration-200 ${
                  city === ALL_CITIES
                    ? 'bg-nil-deep text-white shadow-sm'
                    : 'bg-stone-100 text-text-muted hover:bg-parchment hover:text-ink'
                }`}
              >
                {t('allCities')}
                <span className={`text-[0.68rem] font-bold rounded-full px-1.5 py-0.5 ${
                  city === ALL_CITIES ? 'bg-white/20 text-white' : 'bg-stone-200 text-text-muted'
                }`}>
                  {circuits.length}
                </span>
              </button>
              {cityCounts.map(([name, count]) => (
                <button
                  key={name}
                  onClick={() => setCity(name)}
                  aria-pressed={city === name}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.85rem] font-medium transition-all duration-200 whitespace-nowrap ${
                    city === name
                      ? 'bg-[var(--accent)] text-white shadow-sm'
                      : 'bg-stone-100 text-text-muted hover:bg-parchment hover:text-ink'
                  }`}
                >
                  {name}
                  <span className={`text-[0.68rem] font-bold rounded-full px-1.5 py-0.5 ${
                    city === name ? 'bg-white/25 text-white' : 'bg-stone-200 text-text-muted'
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── 2. Nombre de jours ── */}
          <div>
            <p className="flex items-center gap-1.5 text-[0.8rem] font-bold text-ink uppercase tracking-wide mb-3">
              <Clock size={15} strokeWidth={2.5} style={{ color: 'var(--accent)' }} />
              {t('numberOfDays')}
              <span className="normal-case font-semibold text-[0.82rem]" style={{ color: 'var(--accent-dark)' }}>
                — {durationLabel}
              </span>
            </p>
            <div className="max-w-xl space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[0.72rem] text-text-muted w-8">{t('min')}</span>
                <input
                  type="range"
                  min={MIN_DAYS}
                  max={maxDataDays}
                  value={minDays}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (v <= maxDays) setMinDays(v);
                  }}
                  className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                  aria-label={t('minDaysAria')}
                />
                <span className="text-sm font-bold text-ink w-8 text-right">{minDays}j</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[0.72rem] text-text-muted w-8">{t('max')}</span>
                <input
                  type="range"
                  min={MIN_DAYS}
                  max={maxDataDays}
                  value={maxDays}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (v >= minDays) setMaxDays(v);
                  }}
                  className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                  aria-label={t('maxDaysAria')}
                />
                <span className="text-sm font-bold text-ink w-8 text-right">{maxDays}j</span>
              </div>
            </div>
          </div>

          {/* ── 3. Type de circuit ── */}
          <div>
            <p className="flex items-center gap-1.5 text-[0.8rem] font-bold text-ink uppercase tracking-wide mb-3">
              <Tag size={15} strokeWidth={2.5} style={{ color: 'var(--accent)' }} />
              {t('tourType')}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  aria-pressed={category === cat}
                  className={`px-3.5 py-1.5 rounded-full text-[0.78rem] font-medium transition-all duration-150 whitespace-nowrap ${
                    category === cat
                      ? 'bg-nil-deep text-white shadow-sm'
                      : 'bg-stone-100 text-text-muted hover:bg-parchment hover:text-ink'
                  }`}
                >
                  {cat === ALL_CATEGORIES ? t('all') : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  BARRE RÉSULTATS                                      */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="container-luxury mt-8 mb-6 flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-text-muted">
          <strong className="text-ink font-semibold">{t('toursFound', { count: filtered.length })}</strong>
          {city !== ALL_CITIES && (
            <> {t('departingFrom')} <strong className="text-ink font-semibold">{city}</strong></>
          )}
          {minDays === MIN_DAYS && maxDays === maxDataDays ? '' : ` · ${durationLabel}`}
        </p>
        {hasFilters && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-gold transition-colors"
          >
            <X size={13} strokeWidth={2.5} />
            {t('clearFilters')}
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  GRILLE                                               */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="container-luxury">
        {filtered.length === 0 ? (
          <EmptyState onReset={reset} />
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
            {filtered.map((c) => (
              <li key={c.slug}>
                <CircuitCardItem c={c} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
