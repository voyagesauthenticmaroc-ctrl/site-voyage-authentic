import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Clock, Calendar, Lightbulb } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { PhotoGallery } from '@/components/PhotoGallery';
import type { Destination, Excursion } from '@/lib/content';
import {
  schemaTravelAgency,
  schemaTouristDestination,
  schemaBreadcrumb,
  schemaFaqPage,
} from '@/lib/schema';

interface DestinationTemplateProps {
  dest: Destination;
  relatedExcursions: Excursion[];
  otherDestinations: Destination[];
  path: string;
  whatsapp: string;
  locale?: string;
}

export async function DestinationTemplate({
  dest,
  relatedExcursions,
  otherDestinations,
  path,
  whatsapp,
  locale = 'fr',
}: DestinationTemplateProps) {
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'destinationTemplate' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  const faq = dest.faq ?? [];
  const pi = dest.practicalInfo;
  const shortName = dest.name.split(' — ')[0];

  return (
    <>
      {/* ── Schema.org ────────────────────────────────────────── */}
      <JsonLd data={schemaTravelAgency()} />
      <JsonLd
        data={schemaTouristDestination({
          name: dest.name,
          description: dest.seo.description,
          path,
          image: dest.hero.image,
          locale,
        })}
      />
      <JsonLd
        data={schemaBreadcrumb([
          { name: t('destinations'), path: '/destinations' },
          { name: dest.name, path },
        ])}
      />
      {faq.length > 0 && <JsonLd data={schemaFaqPage(faq)} />}

      <main id="main-content">
        {/* ── 1. Hero ───────────────────────────────────────────── */}
        <section aria-labelledby="page-title" className="relative overflow-hidden" style={{ minHeight: 'clamp(320px, 55vw, 600px)' }}>
          <div className="absolute inset-0 animate-hero-zoom">
            <Image
              src={dest.hero.image}
              alt={t('heroAlt', { name: dest.name })}
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover"
            />
          </div>
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
                  <Link href="/destinations" className="text-white/75 hover:text-white transition-colors drop-shadow">
                    {t('destinations')}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/40">›</li>
                <li aria-current="page" className="text-gold drop-shadow truncate max-w-[160px] sm:max-w-none">
                  {dest.name}
                </li>
              </ol>
            </nav>
            <div className="container-luxury pb-10 sm:pb-16">
              <span className="badge badge-white mb-4 inline-block">{t('badge')}</span>
              <h1 id="page-title" className="text-display-lg text-white" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                {dest.name}
              </h1>
              {dest.hero.tagline && (
                <p className="text-gold mt-3 text-base sm:text-xl max-w-2xl">{dest.hero.tagline}</p>
              )}
            </div>
          </div>
        </section>

        {/* ── 2. Introduction éditoriale ────────────────────────── */}
        <section aria-labelledby="intro-title" className="section-y">
          <div className="container-narrow">
            <p className="text-eyebrow mb-4">{t('whyVisit', { name: shortName })}</p>
            <h2 id="intro-title" className="text-display-md mb-6">
              {t('exceptional', { name: shortName })}
            </h2>
            <p className="text-pretty leading-relaxed text-lg text-text-muted">{dest.intro}</p>
          </div>
        </section>

        {/* ── 3. Zones / quartiers ─────────────────────────────── */}
        {dest.areas && dest.areas.length > 0 && (
          <section aria-labelledby="zones-title" className="section-y bg-parchment-gradient">
            <div className="container-luxury">
              <h2 id="zones-title" className="text-display-md">
                {t('discover', { name: shortName })}
              </h2>
              <ul className="grid sm:grid-cols-2 gap-6 mt-8 list-none p-0">
                {dest.areas.map((area) => (
                  <li key={area.name} className="surface p-6 border-gold-accent">
                    <h3 className="font-display text-2xl text-gold">{area.name}</h3>
                    <p className="mt-3 text-pretty">{area.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── 4. À voir absolument ──────────────────────────────── */}
        <section
          aria-labelledby="highlights-title"
          className={`section-y ${dest.areas && dest.areas.length > 0 ? '' : 'bg-parchment-gradient'}`}
        >
          <div className="container-luxury">
            <p className="text-eyebrow mb-4">{t('mustSeeEyebrow')}</p>
            <h2 id="highlights-title" className="text-display-md">
              {t('mustSeeTitle', { name: shortName })}
            </h2>
            <p className="text-text-muted mt-4 max-w-xl">
              {t('mustSeeSub')}
            </p>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 list-none p-0">
              {dest.highlights.map((h, i) => (
                <li
                  key={h.name}
                  className="surface p-6 border-gold-accent group hover:shadow-lg transition-shadow duration-300"
                >
                  <span className="text-sm font-mono text-gold/60 font-medium">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-xl mt-2 group-hover:text-gold transition-colors duration-300">
                    {h.name}
                  </h3>
                  <p className="text-caption mt-3">{h.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 5. Excursions disponibles ─────────────────────────── */}
        {relatedExcursions.length > 0 && (
          <section aria-labelledby="excursions-title" className="section-y bg-parchment-gradient">
            <div className="container-luxury">
              <p className="text-eyebrow mb-4">{t('programsEyebrow')}</p>
              <h2 id="excursions-title" className="text-display-md">
                {t('toursTo', { name: shortName })}
              </h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 list-none p-0">
                {relatedExcursions.map((exc) => {
                  const href = { pathname: '/circuits/[slug]', params: { slug: exc.slug } } as const;
                  return (
                    <li key={exc.slug}>
                      <article className="card-luxury h-full flex flex-col">
                        <div className="aspect-card relative overflow-hidden rounded-t-xl img-zoom">
                          <Image
                            src={exc.hero.image}
                            alt={exc.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <span className="badge badge-gold">{exc.category}</span>
                          <h3 className="font-display text-xl mt-3 flex-1">{exc.name}</h3>
                          {exc.priceFrom && (
                            <p className="text-sm text-text-muted mt-1">{exc.priceFrom}</p>
                          )}
                          <Link
                            href={href}
                            className="btn btn-outline mt-4 inline-flex text-sm self-start"
                          >
                            {t('viewProgram')}
                          </Link>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        {/* ── 6. Galerie photos ─────────────────────────────────── */}
        {dest.gallery && dest.gallery.length > 0 && (
          <section aria-labelledby="gallery-title" className="section-y bg-parchment-gradient">
            <div className="container-luxury">
              <p className="text-eyebrow mb-4">{t('picturesEyebrow')}</p>
              <h2 id="gallery-title" className="text-display-md">
                {t('photosTitle', { name: shortName })}
              </h2>
              <p className="text-text-muted mt-3 max-w-xl">
                {t('photosSub', { name: shortName })}
              </p>
              <PhotoGallery
                photos={dest.gallery.map((src) => ({
                  src,
                  alt: t('photoAlt', { name: dest.name }),
                }))}
                columns={3}
                className="mt-10"
              />
            </div>
          </section>
        )}

        {/* ── 8. Informations pratiques ─────────────────────────── */}
        {pi && (
          <section aria-labelledby="pratique-title" className="section-y">
            <div className="container-luxury">
              <p className="text-eyebrow mb-4">{t('tipsEyebrow')}</p>
              <h2 id="pratique-title" className="text-display-md">
                {t('practicalInfo')}
              </h2>
              <div className="grid sm:grid-cols-3 gap-8 mt-10">
                <div className="surface p-6 border-gold-accent">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="text-gold flex-shrink-0" size={22} aria-hidden />
                    <h3 className="font-display text-lg">{t('bestPeriod')}</h3>
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed">{pi.bestPeriod}</p>
                </div>
                <div className="surface p-6 border-gold-accent">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="text-gold flex-shrink-0" size={22} aria-hidden />
                    <h3 className="font-display text-lg">{t('recommendedDuration')}</h3>
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed">{pi.daysRecommended}</p>
                </div>
                <div className="surface p-6 border-gold-accent">
                  <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="text-gold flex-shrink-0" size={22} aria-hidden />
                    <h3 className="font-display text-lg">{t('guideTips')}</h3>
                  </div>
                  <ul className="space-y-2 list-none p-0">
                    {pi.tips.map((tip, i) => (
                      <li key={i} className="flex gap-2 text-sm text-text-muted">
                        <span className="text-gold mt-0.5 flex-shrink-0" aria-hidden>›</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── 9. FAQ ────────────────────────────────────────────── */}
        {faq.length > 0 && (
          <section aria-labelledby="faq-title" className="section-y bg-parchment-gradient">
            <div className="container-narrow">
              <p className="text-eyebrow mb-4">{t('faqEyebrow')}</p>
              <h2 id="faq-title" className="text-display-md">
                {t('faqTitle', { name: shortName })}
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

        {/* ── 10. CTA fort ──────────────────────────────────────── */}
        <section aria-labelledby="cta-title" className="section-y bg-luxury-gradient">
          <div className="container-narrow text-center">
            <h2 id="cta-title" className="text-display-md text-white">
              {t('ctaTitle', { name: shortName })}
            </h2>
            <p className="text-gold-muted mt-4 max-w-xl mx-auto">
              {t('ctaText')}
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
                {t('whatsapp')}
              </a>
            </div>
          </div>
        </section>

        {/* ── 11. Maillage interne — autres destinations ────────── */}
        {otherDestinations.length > 0 && (
          <section aria-labelledby="autres-dest-title" className="section-y">
            <div className="container-luxury">
              <h2 id="autres-dest-title" className="text-display-md">
                {t('otherDestinations')}
              </h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 list-none p-0">
                {otherDestinations.map((d) => {
                  const href = { pathname: '/destinations/[slug]', params: { slug: d.slug } } as const;
                  return (
                    <li key={d.slug}>
                      <Link
                        href={href}
                        className="block surface border-gold-accent group overflow-hidden rounded-xl"
                      >
                        <div className="aspect-[4/3] relative overflow-hidden">
                          <Image
                            src={d.hero.image}
                            alt={d.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 50vw, 25vw"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-4">
                          <span className="font-display text-lg group-hover:text-gold transition-colors duration-200">
                            {d.name}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
