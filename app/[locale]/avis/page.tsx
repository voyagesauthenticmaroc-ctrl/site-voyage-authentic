import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { JsonLd } from '@/components/JsonLd';
import { generateMetadata as _gen } from '@/lib/seo';
import { schemaTravelAgency, schemaAggregateRating, schemaBreadcrumb } from '@/lib/schema';
import { getReviews } from '@/lib/content';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.reviews' });
  return _gen({
    title: t('title'),
    description: t('description'),
    path: '/avis',
    locale,
  });
}

const STARS = [1, 2, 3, 4, 5];

export default async function AvisPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [reviews, t, tCommon] = await Promise.all([
    getReviews(),
    getTranslations({ locale, namespace: 'reviewsPage' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);
  const rated = reviews.filter((r) => r.rating != null && r.rating > 0);
  const avg = rated.length
    ? (rated.reduce((s, r) => s + (r.rating ?? 0), 0) / rated.length).toFixed(1)
    : '5.0';

  const aggregateRatingSchema = rated.length > 0
    ? schemaAggregateRating(rated.map((r) => ({
        author: r.author,
        rating: r.rating ?? 5,
        text: r.text,
        date: r.date,
      })))
    : null;

  return (
    <>
      <JsonLd data={schemaTravelAgency()} />
      {aggregateRatingSchema && <JsonLd data={aggregateRatingSchema} />}
      <JsonLd data={schemaBreadcrumb([{ name: t('breadcrumb'), path: '/avis' }])} />

      <main id="main-content">
        {/* ── Header ──────────────────────────────────────────── */}
        <section aria-labelledby="avis-title" className="pt-32 pb-16 bg-parchment-gradient">
          <div className="container-narrow text-center">
            <nav aria-label={tCommon('breadcrumbLabel')} className="mb-8 text-left">
              <ol className="flex gap-2 text-caption list-none p-0">
                <li><Link href="/" className="hover:text-gold transition-colors">{tCommon('home')}</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-gold">{t('breadcrumb')}</li>
              </ol>
            </nav>
            <h1 id="avis-title" className="text-display-xl text-balance">
              {t('title')}
            </h1>
            {rated.length > 0 && (
              <div className="flex items-center justify-center gap-3 mt-6" aria-label={t('avgAria', { avg })}>
                <div className="flex gap-1" aria-hidden="true">
                  {STARS.map((s) => (
                    <svg key={s} className="w-6 h-6 text-gold fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-display text-2xl text-gold-accessible">{avg}</span>
                <span className="text-caption">/ 5 — {t('reviewsCount', { count: rated.length })}</span>
              </div>
            )}
          </div>
        </section>

        {/* ── Liste des avis ──────────────────────────────────── */}
        <section aria-labelledby="reviews-list-title" className="section-y">
          <div className="container-luxury">
            <h2 id="reviews-list-title" className="sr-only">{t('listTitle')}</h2>

            {reviews.length > 0 && (
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
                {reviews.map((review, i) => (
                  <li key={i}>
                    <article className="surface-elevated p-6 h-full flex flex-col">
                      {review.rating && (
                        <div className="flex gap-0.5 mb-3" aria-label={t('ratingAria', { rating: review.rating })}>
                          {STARS.map((s) => (
                            <svg
                              key={s}
                              className={`w-4 h-4 fill-current ${s <= review.rating! ? 'text-gold' : 'text-parchment'}`}
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                      <blockquote className="flex-1">
                        <p className="text-pretty leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                      </blockquote>
                      <footer className="mt-4 pt-4 border-t border-border">
                        <cite className="not-italic font-medium">{review.author}</cite>
                        <div className="flex gap-3 mt-1 flex-wrap">
                          {review.location && <span className="text-caption">{review.location}</span>}
                          {review.date && <time className="text-caption" dateTime={review.date}>{review.date}</time>}
                        </div>
                      </footer>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section aria-labelledby="cta-avis" className="section-y bg-luxury-gradient">
          <div className="container-narrow text-center">
            <h2 id="cta-avis" className="text-display-md text-white">
              {t('ctaTitle')}
            </h2>
            <p className="text-gold-muted mt-4">
              {t('ctaText')}
            </p>
            <Link href="/contact" className="btn btn-primary mt-8 inline-flex">
              {t('ctaQuote')}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
