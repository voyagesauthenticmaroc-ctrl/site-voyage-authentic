import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { JsonLd } from '@/components/JsonLd';
import { generateMetadata as _gen } from '@/lib/seo';
import { schemaTravelAgency, schemaBreadcrumb, schemaWebPage } from '@/lib/schema';
import { getExcursions } from '@/lib/content';
import type { Excursion } from '@/lib/content';
import { getDurationDays, getDepartureCity, parsePriceFrom } from '@/lib/circuits';
import { CircuitsGrid } from '@/components/CircuitsGrid';
import type { CircuitCard } from '@/components/CircuitsGrid';
import { ArrowRight } from 'lucide-react';

interface CircuitsPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ depart?: string | string[] }>;
}

export async function generateMetadata({ params }: Pick<CircuitsPageProps, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.circuits' });
  return _gen({
    title: t('title'),
    description: t('description'),
    path: '/circuits',
    locale,
  });
}

/* ── Helpers ─────────────────────────────────────────────── */

function toCard(exc: Excursion & { baseSlug: string }): CircuitCard {
  return {
    slug: exc.slug,
    name: exc.name,
    category: exc.category,
    hero: exc.hero,
    durationDays: getDurationDays(exc),
    departureCity: getDepartureCity(exc.baseSlug),
    priceFrom: parsePriceFrom(exc),
    intro: exc.intro,
  };
}

/* ── Page ───────────────────────────────────────────────── */

export default async function CircuitsPage({ params, searchParams }: CircuitsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const depart = Array.isArray(sp.depart) ? sp.depart[0] : sp.depart;

  const excursions = await getExcursions(locale);
  const cards: CircuitCard[] = excursions.map(toCard);

  const priceValues = cards
    .map((c) => (c.priceFrom ? parseInt(c.priceFrom.replace(/\D/g, ''), 10) : NaN))
    .filter((n) => !Number.isNaN(n));
  const minPrice = priceValues.length ? Math.min(...priceValues) : null;

  const t = await getTranslations({ locale, namespace: 'circuitsPage' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const tMeta = await getTranslations({ locale, namespace: 'meta.circuits' });

  return (
    <>
      <JsonLd data={schemaTravelAgency()} />
      <JsonLd
        data={schemaWebPage({
          name: tMeta('title'),
          description: tMeta('description'),
          path: '/circuits',
          locale,
        })}
      />
      <JsonLd data={schemaBreadcrumb([{ name: t('breadcrumb'), path: '/circuits' }])} />

      <main id="main-content">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section aria-labelledby="page-title" className="pt-32 pb-16 bg-luxury-gradient">
          <div className="container-luxury">
            <nav aria-label={tCommon('breadcrumbLabel')} className="mb-8">
              <ol className="flex gap-2 text-caption list-none p-0">
                <li>
                  <Link href="/" className="text-white/65 hover:text-white transition-colors">
                    {tCommon('home')}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/35">›</li>
                <li aria-current="page" className="text-gold">{t('breadcrumb')}</li>
              </ol>
            </nav>
            <h1 id="page-title" className="text-display-xl text-white text-balance">
              {depart ? t('titleFrom', { city: depart }) : t('title')}
            </h1>
            <p className="text-gold-muted mt-4 text-xl max-w-2xl">
              {t('subtitle', { count: cards.length })}
              {minPrice ? <>, <strong className="text-white">{t('fromPrice', { price: minPrice })}</strong></> : ''}.
            </p>
          </div>
        </section>

        {/* ── Grille avec filtres ────────────────────────────── */}
        <section aria-labelledby="circuits-grid-title" className="pb-24">
          <h2 id="circuits-grid-title" className="sr-only">{t('allToursHeading')}</h2>
          <CircuitsGrid key={depart ?? 'all'} circuits={cards} initialCity={depart} />
        </section>

        {/* ── Texte éditorial SEO (français uniquement pour l'instant) ── */}
        {locale === 'fr' && (
        <section aria-labelledby="seo-circuits-title" className="section-y bg-parchment-gradient">
          <div className="container-narrow">
            <p className="text-eyebrow mb-4">Voyager avec nous</p>
            <h2 id="seo-circuits-title" className="text-display-md">
              Des circuits privés au Maroc, conçus sur mesure
            </h2>
            <div className="mt-8 space-y-5 text-pretty leading-relaxed text-text-muted">
              <p>
                Tous nos circuits au Maroc sont <strong className="text-ink">100&nbsp;% privés</strong> :
                vous voyagez uniquement avec vos proches, dans un véhicule climatisé conduit par un
                chauffeur francophone qui connaît chaque piste et chaque kasbah. Contrairement aux
                tours en groupe, le rythme vous appartient — une pause photo dans la vallée du Dadès,
                une heure de plus dans les dunes de{' '}
                <Link href={{ pathname: '/destinations/[slug]', params: { slug: 'desert-sahara-merzouga' } }} className="text-gold hover:underline">Merzouga</Link>,
                un détour par un souk berbère : tout s&apos;adapte à vos envies.
              </p>
              <p>
                Du côté des itinéraires, trois grandes familles se dégagent. Les{' '}
                <strong className="text-ink">circuits désert</strong> (2 à 4 jours) relient{' '}
                <Link href={{ pathname: '/destinations/[slug]', params: { slug: 'marrakech' } }} className="text-gold hover:underline">Marrakech</Link> ou{' '}
                <Link href={{ pathname: '/destinations/[slug]', params: { slug: 'fes' } }} className="text-gold hover:underline">Fès</Link> aux dunes de
                l&apos;Erg Chebbi, avec nuit en bivouac sous les étoiles. Les{' '}
                <strong className="text-ink">circuits villes impériales</strong> enchaînent Rabat, Meknès,
                Fès et Marrakech, souvent complétés par{' '}
                <Link href={{ pathname: '/destinations/[slug]', params: { slug: 'chefchaouen' } }} className="text-gold hover:underline">Chefchaouen</Link>,
                la ville bleue du Rif. Enfin, les <strong className="text-ink">excursions à la journée</strong>{' '}
                depuis Marrakech — <Link href={{ pathname: '/destinations/[slug]', params: { slug: 'essaouira' } }} className="text-gold hover:underline">Essaouira</Link>,{' '}
                <Link href={{ pathname: '/destinations/[slug]', params: { slug: 'vallees-atlas' } }} className="text-gold hover:underline">vallée de l&apos;Ourika, cascades d&apos;Ouzoud</Link> ou{' '}
                <Link href={{ pathname: '/destinations/[slug]', params: { slug: 'ait-ben-haddou' } }} className="text-gold hover:underline">Aït Ben Haddou</Link> —
                s&apos;intègrent librement dans votre séjour, dès 45&nbsp;€ par personne.
              </p>
              <p>
                Chaque prix affiché est un tarif « à partir de » par personne : le devis final dépend de
                vos dates, du nombre de voyageurs et du niveau d&apos;hébergement souhaité (riads de charme,
                bivouacs de luxe, hôtels 4-5★). Demandez votre programme personnalisé — réponse gratuite
                sous 24&nbsp;h, sans engagement.
              </p>
            </div>
          </div>
        </section>
        )}

        {/* ── CTA ───────────────────────────────────────────── */}
        <section aria-labelledby="cta-circuits" className="section-y bg-luxury-gradient">
          <div className="container-narrow text-center">
            <h2 id="cta-circuits" className="text-display-md text-white">
              {t('ctaTitle')}
            </h2>
            <p className="text-gold-muted mt-4 max-w-xl mx-auto">
              {t('ctaText')}
            </p>
            <Link href="/contact" className="btn btn-primary mt-8 inline-flex items-center gap-2">
              {tCommon('requestQuote')} <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
