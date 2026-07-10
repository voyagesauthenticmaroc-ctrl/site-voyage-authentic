import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Clock, Users, Star, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { CircuitMap } from '@/components/CircuitMap';
import { WishlistButton } from '@/components/WishlistButton';
import { extractRoute } from '@/lib/morocco-places';
import type { Excursion, Destination, Review } from '@/lib/content';
import {
  schemaTravelAgency,
  schemaTouristTrip,
  schemaBreadcrumb,
  schemaFaqPage,
} from '@/lib/schema';

interface ExcursionTemplateProps {
  exc: Excursion;
  relatedDestinations: Destination[];
  reviews: Review[];
  path: string;
  whatsapp: string;
  locale?: string;
  /** ISO 8601 duration e.g. 'PT45M', 'PT8H', 'P5D' */
  schemaDuration?: string;
}

export async function ExcursionTemplate({
  exc,
  relatedDestinations,
  reviews,
  path,
  whatsapp,
  locale = 'fr',
  schemaDuration,
}: ExcursionTemplateProps) {
  const [t, tCommon, tCircuits] = await Promise.all([
    getTranslations({ locale, namespace: 'excursionTemplate' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'circuitsPage' }),
  ]);

  const faq = exc.faq ?? [];
  const firstDuration = exc.programs?.[0]?.duration;
  const multiProgram = (exc.programs?.length ?? 0) > 1;
  const routeStops = extractRoute(exc.name, exc.programs?.[0]?.days);

  return (
    <>
      {/* ── Schema.org ────────────────────────────────────────── */}
      <JsonLd data={schemaTravelAgency()} />
      <JsonLd
        data={schemaTouristTrip({
          name: exc.name,
          description: exc.seo.description,
          path,
          image: exc.hero.image,
          locale,
          ...(schemaDuration ? { duration: schemaDuration } : {}),
        })}
      />
      <JsonLd
        data={schemaBreadcrumb([
          { name: tCircuits('breadcrumb'), path: '/circuits' },
          { name: exc.name, path },
        ])}
      />
      {faq.length > 0 && <JsonLd data={schemaFaqPage(faq)} />}

      <main id="main-content">
        {/* ── 1. Hero ───────────────────────────────────────────── */}
        <section aria-labelledby="page-title" className="relative overflow-hidden" style={{ minHeight: 'clamp(320px, 55vw, 600px)' }}>
          <Image
            src={exc.hero.image}
            alt={exc.name}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
          <div className="overlay-nil absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/70 pointer-events-none" />
          <div className="absolute inset-0 flex flex-col justify-between">
            <nav aria-label={tCommon('breadcrumbLabel')} className="z-10 pt-20">
              <ol className="flex gap-2 text-caption container-luxury py-3 list-none flex-wrap">
                <li>
                  <Link href="/" className="text-white/75 hover:text-white transition-colors drop-shadow">
                    {t('home')}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/40">›</li>
                <li>
                  <Link href="/circuits" className="text-white/75 hover:text-white transition-colors drop-shadow">
                    {t('tours')}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/40">›</li>
                <li aria-current="page" className="text-gold drop-shadow truncate max-w-[160px] sm:max-w-none">
                  {exc.name}
                </li>
              </ol>
            </nav>
            <div className="container-luxury pb-10 sm:pb-16">
              <span className="badge badge-white mb-4 self-start inline-block">{exc.category}</span>
              <h1 id="page-title" className="text-display-lg text-white" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                {exc.name}
              </h1>
              {exc.hero.tagline && (
                <p className="text-gold mt-3 text-base sm:text-xl max-w-2xl">{exc.hero.tagline}</p>
              )}
            </div>
          </div>
        </section>

        {/* ── 2. Barre de faits rapides ─────────────────────────── */}
        <div className="bg-nil-deep text-white py-5 border-b border-white/10">
          <div className="container-luxury flex flex-wrap items-center gap-x-8 gap-y-3">
            {firstDuration && (
              <div className="flex items-center gap-2 text-sm">
                <Clock size={15} className="text-gold flex-shrink-0" aria-hidden />
                <span className="text-gold font-medium">{t('duration')}</span>
                <span className="text-white/80">{firstDuration}</span>
              </div>
            )}
            {exc.priceFrom && (
              <div className="flex items-center gap-2 text-sm">
                <Star size={15} className="text-gold flex-shrink-0" aria-hidden />
                <span className="text-gold font-medium">{t('price')}</span>
                <span className="text-white/80">{exc.priceFrom}</span>
              </div>
            )}
            {exc.difficulty && (
              <div className="flex items-center gap-2 text-sm">
                <Users size={15} className="text-gold flex-shrink-0" aria-hidden />
                <span className="text-gold font-medium">{t('level')}</span>
                <span className="text-white/80">{exc.difficulty}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={15} className="text-gold flex-shrink-0" aria-hidden />
              <span className="text-gold font-medium">{t('availability')}</span>
              <span className="text-white/80">{t('availabilityValue')}</span>
            </div>
            <div className="flex items-center gap-3 sm:ml-auto">
              <WishlistButton slug={exc.slug} variant="inline" className="!bg-white/10 !border-white/25 !text-white hover:!bg-white/20" />
              <Link href="/contact" className="btn btn-primary text-sm py-2 px-5">
                {tCommon('requestQuote')}
              </Link>
            </div>
          </div>
        </div>

        {/* ── 3. Programmes / Itinéraire ────────────────────────── */}
        {exc.programs && exc.programs.length > 0 && (
          <section aria-labelledby="programs-title" className="section-y bg-parchment-gradient">
            <div className="container-luxury">
              <p className="text-eyebrow mb-4">{t('processEyebrow')}</p>
              <h2 id="programs-title" className="text-display-md">
                {multiProgram ? t('programsAvailable') : t('programSingle')}
              </h2>
              {exc.intro && (
                <p className="text-pretty leading-relaxed text-lg mt-6 max-w-3xl">{exc.intro}</p>
              )}
              {exc.experience && (
                <p className="text-pretty leading-relaxed text-lg mt-4 max-w-3xl text-text-muted">{exc.experience}</p>
              )}
              {routeStops.length >= 2 && (
                <div className="mt-10">
                  <CircuitMap stops={routeStops} title={exc.name} />
                </div>
              )}
              <div className={`grid gap-8 mt-10 ${multiProgram ? 'lg:grid-cols-2' : ''}`}>
                {exc.programs.map((prog) => (
                  <article key={prog.title} className="surface-elevated p-8">
                    <h3 className="font-display text-2xl text-gold">{prog.title}</h3>
                    {prog.duration && (
                      <span className="badge badge-nil mt-3 inline-flex">{prog.duration}</span>
                    )}
                    {prog.description && (
                      <p className="mt-4 text-pretty text-text-muted">{prog.description}</p>
                    )}
                    {prog.items && prog.items.length > 0 && (
                      <ul className="mt-4 space-y-2 list-none p-0">
                        {prog.items.map((item, i) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <span className="text-gold mt-0.5 flex-shrink-0" aria-hidden>›</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {prog.days && prog.days.length > 0 && (
                      <ol className="mt-6 space-y-5 list-none p-0">
                        {prog.days.map((day) => (
                          <li key={day.label} className="border-l-2 border-[var(--gold)] pl-4">
                            <h4 className="font-medium text-ink text-sm">{day.label}</h4>
                            {day.items.length > 0 && (
                              <ul className="mt-2 space-y-1 list-none p-0">
                                {day.items.map((item, i) => (
                                  <li key={i} className="text-sm text-text-muted flex gap-2">
                                    <span className="text-gold/50 mt-0.5 flex-shrink-0" aria-hidden>·</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ol>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}


        {/* ── 5. Excursions à la journée ────────────────────────── */}
        {exc.dayTrips && exc.dayTrips.length > 0 && (
          <section aria-labelledby="daytrips-title" className="section-y">
            <div className="container-luxury">
              <p className="text-eyebrow mb-4">{t('dayTripsFrom', { category: exc.category })}</p>
              <h2 id="daytrips-title" className="text-display-md">
                {t('dayTripsTitle')}
              </h2>
              <div className="grid lg:grid-cols-2 gap-8 mt-10">
                {exc.dayTrips.map((trip) => (
                  <article key={trip.title} className="surface p-6 border-gold-accent">
                    <h3 className="font-display text-xl">{trip.title}</h3>
                    {trip.duration && (
                      <span className="badge badge-gold mt-2 inline-flex">{trip.duration}</span>
                    )}
                    {trip.description && (
                      <p className="mt-4 text-sm text-text-muted text-pretty leading-relaxed">
                        {trip.description}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 6. Options ────────────────────────────────────────── */}
        {exc.options && exc.options.length > 0 && (
          <section aria-labelledby="options-title" className="section-y bg-parchment-gradient">
            <div className="container-luxury">
              <h2 id="options-title" className="text-display-md">
                {t('optionsTitle')}
              </h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 list-none p-0">
                {exc.options.map((opt) => (
                  <li key={opt.name} className="surface p-6 border-gold-accent">
                    <h3 className="font-display text-lg">{opt.name}</h3>
                    <p className="text-caption mt-3 text-sm leading-relaxed">{opt.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── 7. Inclus / Non inclus ────────────────────────────── */}
        {(exc.included || exc.excluded) && (
          <section
            aria-labelledby="inclus-title"
            className={`section-y ${exc.options && exc.options.length > 0 ? '' : 'bg-parchment-gradient'}`}
          >
            <div className="container-luxury">
              <h2 id="inclus-title" className="text-display-md">
                {t('includedTitle')}
              </h2>
              <div className="grid sm:grid-cols-2 gap-8 mt-8">
                {exc.included && exc.included.length > 0 && (
                  <div className="surface p-6 border-gold-accent">
                    <h3 className="font-display text-lg mb-4 flex items-center gap-2 text-emerald-700">
                      <CheckCircle size={20} aria-hidden />
                      {t('includedIn')}
                    </h3>
                    <ul className="space-y-3 list-none p-0">
                      {exc.included.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <CheckCircle
                            size={16}
                            className="text-emerald-600 flex-shrink-0 mt-0.5"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {exc.excluded && exc.excluded.length > 0 && (
                  <div className="surface p-6">
                    <h3 className="font-display text-lg text-text-muted mb-4 flex items-center gap-2">
                      <XCircle size={20} aria-hidden />
                      {t('notIncluded')}
                    </h3>
                    <ul className="space-y-3 list-none p-0">
                      {exc.excluded.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-text-muted">
                          <XCircle
                            size={16}
                            className="text-text-muted/50 flex-shrink-0 mt-0.5"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── 8. FAQ ────────────────────────────────────────────── */}
        {faq.length > 0 && (
          <section aria-labelledby="faq-exc-title" className="section-y bg-parchment-gradient">
            <div className="container-narrow">
              <p className="text-eyebrow mb-4">{t('faqEyebrow')}</p>
              <h2 id="faq-exc-title" className="text-display-md">
                {t('faqTitle', { name: exc.name })}
              </h2>
              <dl className="mt-10">
                {faq.map((item, i) => (
                  <div
                    key={item.question}
                    className={`py-6 ${i > 0 ? 'border-t border-[var(--parchment)]' : ''}`}
                  >
                    <dt className="font-display text-xl font-medium text-ink">
                      {item.question}
                    </dt>
                    <dd className="mt-3 text-pretty text-text-muted leading-relaxed">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* ── 9. Avis clients ───────────────────────────────────── */}
        {reviews.length > 0 && (
          <section aria-labelledby="avis-exc-title" className="section-y">
            <div className="container-luxury">
              <p className="text-eyebrow mb-4">{t('reviewsEyebrow')}</p>
              <h2 id="avis-exc-title" className="text-display-md">
                {t('reviewsTitle')}
              </h2>
              <ul className="grid sm:grid-cols-3 gap-6 mt-8 list-none p-0">
                {reviews.slice(0, 3).map((review, i) => (
                  <li key={i} className="surface-elevated p-6">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: review.rating ?? 5 }).map((_, j) => (
                        <Star key={j} size={14} className="text-gold fill-current" aria-hidden />
                      ))}
                    </div>
                    <blockquote className="text-sm text-pretty text-text-muted leading-relaxed">
                      &ldquo;{review.text}&rdquo;
                    </blockquote>
                    <footer className="mt-4 flex items-baseline gap-2">
                      <span className="font-medium text-sm">{review.author}</span>
                      {review.location && (
                        <span className="text-caption text-xs">— {review.location}</span>
                      )}
                    </footer>
                  </li>
                ))}
              </ul>
              <div className="mt-8 text-center">
                <Link
                  href="/avis"
                  className="text-gold hover:text-gold/80 text-sm font-medium transition-colors"
                >
                  {t('readAllReviews')}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── 10. CTA réservation ───────────────────────────────── */}
        <section aria-labelledby="cta-exc-title" className="section-y bg-luxury-gradient">
          <div className="container-narrow text-center">
            <h2 id="cta-exc-title" className="text-display-md text-white">
              {t('bookTitle', { name: exc.name })}
            </h2>
            <p className="text-gold-muted mt-4 max-w-xl mx-auto">
              {t('bookText')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/contact" className="btn btn-primary">
                {tCommon('requestQuote')}
              </Link>
              <a
                href={`https://wa.me/${whatsapp}`}
                className="btn btn-outline-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('bookWhatsApp')}
              </a>
            </div>
          </div>
        </section>

        {/* ── 11. Maillage — destinations associées ─────────────── */}
        {relatedDestinations.length > 0 && (
          <section aria-labelledby="dest-assoc-title" className="section-y">
            <div className="container-luxury">
              <h2 id="dest-assoc-title" className="text-display-md">
                {t('relatedDestinations')}
              </h2>
              <ul className="flex flex-wrap gap-3 mt-6 list-none p-0">
                {relatedDestinations.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={{ pathname: '/destinations/[slug]', params: { slug: d.slug } }}
                      className="badge badge-nil hover:text-gold hover:border-gold transition-colors duration-200"
                    >
                      {d.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
