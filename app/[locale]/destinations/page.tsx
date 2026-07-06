import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowRight, MapPin } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { ScrollReveal } from '@/components/ScrollReveal';
import { generateMetadata as _gen } from '@/lib/seo';
import { schemaTravelAgency, schemaBreadcrumb, schemaWebPage } from '@/lib/schema';
import { getExcursions } from '@/lib/content';
import { getDepartureCity } from '@/lib/circuits';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.destinations' });
  return _gen({
    title: t('title'),
    description: t('description'),
    path: '/destinations',
    locale,
  });
}

/* Slugs des destinations avec leurs visuels (images vérifiées Unsplash) — les textes viennent des traductions */
type DestSlug =
  | 'desert-sahara-merzouga'
  | 'marrakech'
  | 'chefchaouen'
  | 'ait-ben-haddou'
  | 'fes'
  | 'essaouira'
  | 'casablanca'
  | 'vallees-atlas'
  | 'tanger';

const DESTINATIONS: { slug: DestSlug; src: string; alt: string; tall: boolean }[] = [
  { slug: 'desert-sahara-merzouga', src: '/images/desert-marcheur.jpg', alt: 'Sahara, Merzouga', tall: true },
  { slug: 'marrakech', src: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80', alt: 'Marrakech', tall: false },
  { slug: 'chefchaouen', src: '/images/chefchaouen-ruelle.jpg', alt: 'Chefchaouen', tall: false },
  { slug: 'ait-ben-haddou', src: 'https://images.unsplash.com/photo-1569531955316-bb271f9c4531?auto=format&fit=crop&w=800&q=80', alt: 'Aït Ben Haddou', tall: true },
  { slug: 'fes', src: 'https://images.unsplash.com/photo-1742434790127-55e03b30455e?auto=format&fit=crop&w=800&q=80', alt: 'Fès', tall: false },
  { slug: 'essaouira', src: 'https://images.unsplash.com/photo-1555686367-56d5186965d5?auto=format&fit=crop&w=800&q=80', alt: 'Essaouira', tall: false },
  { slug: 'casablanca', src: 'https://images.unsplash.com/photo-1538230575309-59dfc388ae36?auto=format&fit=crop&w=800&q=80', alt: 'Casablanca', tall: false },
  { slug: 'vallees-atlas', src: 'https://images.unsplash.com/photo-1585213303822-f19214012600?auto=format&fit=crop&w=800&q=80', alt: 'Atlas', tall: true },
  { slug: 'tanger', src: 'https://images.unsplash.com/photo-1582919534700-acf2374f10d3?auto=format&fit=crop&w=800&q=80', alt: 'Tanger', tall: false },
];

/* Photos vérifiées par ville de départ — Unsplash License */
const CITY_IMAGES: Record<string, { src: string; alt: string }> = {
  Marrakech: {
    src: 'https://images.unsplash.com/photo-1544517333-3ceafba4d01b?auto=format&fit=crop&w=900&q=80',
    alt: 'Marrakech',
  },
  Casablanca: {
    src: 'https://images.unsplash.com/photo-1577147443647-81856d5151af?auto=format&fit=crop&w=800&q=80',
    alt: 'Casablanca',
  },
  'Fès': {
    src: 'https://images.unsplash.com/photo-1742434790127-55e03b30455e?auto=format&fit=crop&w=800&q=80',
    alt: 'Fès',
  },
  Rabat: {
    src: 'https://images.unsplash.com/photo-1526928878027-1cf28c1405ba?auto=format&fit=crop&w=800&q=80',
    alt: 'Rabat',
  },
  Tanger: {
    src: 'https://images.unsplash.com/photo-1582919534700-acf2374f10d3?auto=format&fit=crop&w=800&q=80',
    alt: 'Tanger',
  },
  Agadir: {
    src: 'https://images.unsplash.com/photo-1710092538995-4af0c11a3f3c?auto=format&fit=crop&w=800&q=80',
    alt: 'Agadir',
  },
  Ouarzazate: {
    src: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80',
    alt: 'Ouarzazate',
  },
};
const CITY_IMAGE_FALLBACK = { src: '/images/desert-marcheur.jpg', alt: 'Sahara' };

export default async function DestinationsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tCommon, tMeta, excursions] = await Promise.all([
    getTranslations({ locale, namespace: 'destinationsPage' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'meta.destinations' }),
    getExcursions(locale),
  ]);

  const cityCounts = new Map<string, number>();
  for (const exc of excursions) {
    const city = getDepartureCity(exc.baseSlug);
    if (city !== 'Maroc') cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
  }
  const departureCities = Array.from(cityCounts.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <JsonLd data={schemaTravelAgency()} />
      <JsonLd
        data={schemaWebPage({
          name: tMeta('title'),
          description: tMeta('description'),
          path: '/destinations',
          locale,
        })}
      />
      <JsonLd data={schemaBreadcrumb([{ name: t('breadcrumb'), path: '/destinations' }])} />

      <main id="main-content">
        {/* ── Hero ── */}
        <section aria-labelledby="dest-title" className="page-hero">
          <div className="container-luxury relative z-10">
            <nav aria-label={tCommon('breadcrumbLabel')} className="mb-8">
              <ol className="flex gap-2 text-caption list-none p-0">
                <li><Link href="/" className="text-white/65 hover:text-white transition-colors">{tCommon('home')}</Link></li>
                <li aria-hidden="true" className="text-white/35">›</li>
                <li aria-current="page" style={{ color: 'var(--accent-light)' }}>{t('breadcrumb')}</li>
              </ol>
            </nav>
            <span className="text-eyebrow-accent">{t('eyebrow')}</span>
            <h1 id="dest-title" className="text-display-lg text-white mt-3 text-balance">
              {t('title1')} <span className="script-accent">{t('titleScript')}</span> {t('title2')}
            </h1>
            <p className="text-white/65 mt-5 text-lg max-w-2xl">
              {t('heroText')}
            </p>
          </div>
        </section>

        {/* ── Villes de départ (mis en avant) ── */}
        <section aria-labelledby="depart-title" className="section-y bg-parchment">
          <div className="container-luxury">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-eyebrow-accent">{t('citiesEyebrow')}</span>
              <h2 id="depart-title" className="text-display-md text-ink mt-3 text-balance">
                {t('citiesTitle1')} <span className="script-accent">{t('citiesTitleScript')}</span>{t('citiesTitle2')}
              </h2>
              <p className="text-text-muted mt-4">
                {t('citiesText')}
              </p>
            </div>
            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10 list-none p-0 m-0">
              {departureCities.map(([city, count], i) => {
                const img = CITY_IMAGES[city] ?? CITY_IMAGE_FALLBACK;
                return (
                  <li key={city} className={i === 0 ? 'col-span-2' : ''}>
                    <Link
                      href={{ pathname: '/circuits', query: { depart: city } }}
                      className="group relative block h-48 sm:h-56 overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        unoptimized
                        sizes={i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />

                      <span className="absolute top-3 right-3 bg-white/95 text-ink text-[0.7rem] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {t('tourCount', { count })}
                      </span>

                      <div className="absolute bottom-0 inset-x-0 p-5">
                        <p
                          className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-widest"
                          style={{ color: 'var(--accent-light)' }}
                        >
                          <MapPin size={11} strokeWidth={2.5} /> {t('cityLabel')}
                        </p>
                        <p className="font-display text-white text-2xl mt-0.5">{city}</p>
                        <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wide mt-2 text-white/85 group-hover:gap-2.5 group-hover:text-white transition-all">
                          {t('viewTours')} <ArrowRight size={11} strokeWidth={2.5} />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ── Grille destinations ── */}
        <section aria-labelledby="dest-grid-title" className="section-y">
          <div className="container-luxury">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-eyebrow-accent">{t('gridEyebrow')}</span>
              <h2 id="dest-grid-title" className="text-display-md text-ink mt-3 text-balance">
                {t('gridTitle1')} <span className="script-accent">{t('gridTitleScript')}</span>
              </h2>
              <p className="text-text-muted mt-4">
                {t('gridText')}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {DESTINATIONS.map((d, i) => (
                <ScrollReveal key={d.slug} delay={(i % 3) * 80}>
                  <Link href={{ pathname: '/destinations/[slug]', params: { slug: d.slug } }} className="block group">
                    <article className="relative overflow-hidden rounded-3xl shadow-lg" style={{ aspectRatio: d.tall ? '4/5' : '4/4' }}>
                      <Image
                        src={d.src}
                        alt={d.alt}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                      <div className="absolute bottom-0 inset-x-0 p-6">
                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-light)' }}>
                          <MapPin size={12} /> {t(`cards.${d.slug}.sub`)}
                        </p>
                        <h2 className="font-display text-white text-2xl mt-1.5">{t(`cards.${d.slug}.name`)}</h2>
                        <p className="text-white/70 text-sm mt-2 leading-relaxed line-clamp-2">{t(`cards.${d.slug}.desc`)}</p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide mt-4 group-hover:gap-3 transition-all" style={{ color: 'var(--accent-light)' }}>
                          {t('discover')} <ArrowRight size={12} />
                        </span>
                      </div>
                    </article>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section aria-labelledby="cta-dest" className="section-y bg-luxury-gradient">
          <div className="container-narrow text-center">
            <span className="script-accent" style={{ fontSize: '1.6rem', color: 'var(--accent-light)' }}>
              {t('ctaScript')}
            </span>
            <h2 id="cta-dest" className="text-display-md text-white mt-3">
              {t('ctaTitle')}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/contact" className="btn btn-primary">
                {t('ctaQuote')}
              </Link>
              <Link href="/circuits" className="btn btn-outline-white">
                {t('ctaAllTours')}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
