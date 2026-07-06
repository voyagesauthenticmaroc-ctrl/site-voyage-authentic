import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Award, Globe, Users, Clock, ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { generateMetadata as _gen } from '@/lib/seo';
import { schemaTravelAgency, schemaBreadcrumb, schemaWebPage } from '@/lib/schema';
import { getSite } from '@/lib/content';
import { ScrollReveal } from '@/components/ScrollReveal';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.about' });
  return _gen({
    title: t('title'),
    description: t('description'),
    path: '/a-propos',
    locale,
  });
}

const VALUES = [
  { icon: Globe, key: 'private' as const },
  { icon: Award, key: 'authentic' as const },
  { icon: Users, key: 'languages' as const },
  { icon: Clock, key: 'flexible' as const },
];

export default async function AProposPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [site, t, tAgency, tCommon, tMeta] = await Promise.all([
    getSite(),
    getTranslations({ locale, namespace: 'aboutPage' }),
    getTranslations({ locale, namespace: 'agency' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'meta.about' }),
  ]);

  return (
    <>
      <JsonLd data={schemaTravelAgency()} />
      <JsonLd
        data={schemaWebPage({
          name: `${t('breadcrumb')} — ${site.name}`,
          description: tMeta('description'),
          path: '/a-propos',
          locale,
        })}
      />
      <JsonLd data={schemaBreadcrumb([{ name: t('breadcrumb'), path: '/a-propos' }])} />

      <main id="main-content">
        {/* ── Hero ────────────────────────────────────────────── */}
        <section aria-labelledby="about-title" className="page-hero">
          <div className="container-luxury relative z-10">
            <nav aria-label={tCommon('breadcrumbLabel')} className="mb-8">
              <ol className="flex gap-2 text-caption list-none p-0">
                <li><Link href="/" className="text-white/65 hover:text-white transition-colors">{tCommon('home')}</Link></li>
                <li aria-hidden="true" className="text-white/35">›</li>
                <li aria-current="page" className="text-gold">{t('breadcrumb')}</li>
              </ol>
            </nav>
            <h1 id="about-title" className="text-display-xl text-white text-balance">
              {site.name}
            </h1>
            <p className="text-gold-muted mt-4 text-xl max-w-2xl">
              {site.tagline}
            </p>
          </div>
        </section>

        {/* ── Présentation principale ──────────────────────────── */}
        <section aria-labelledby="presentation-title" className="section-y-lg bg-parchment-gradient">
          <div className="container-luxury">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <ScrollReveal direction="left">
                <div className="relative mx-auto lg:mx-0 max-w-sm">
                  <div
                    className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl"
                    style={{ background: 'var(--gold)', opacity: 0.15 }}
                  />
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl corner-ornament" style={{ aspectRatio: '4/5' }}>
                    <Image
                      src="/images/riad-patio.jpg"
                      alt={`${site.name} — riad marocain`}
                      fill
                      sizes="(min-width: 1024px) 380px, 85vw"
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-6">
                      <p className="font-display text-xl text-white">{site.name}</p>
                      <p className="text-gold text-sm mt-0.5">{t('agencyCardSub')}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <span className="text-eyebrow">{t('historyEyebrow')}</span>
                <h2 id="presentation-title" className="text-display-md mt-3 text-balance">
                  {t('historyTitle')}
                </h2>
                <span className="divider-gold mt-5" />

                <div className="mt-6 space-y-4">
                  <p className="text-pretty leading-relaxed text-lg">
                    {tAgency('bio')}
                  </p>
                  <p className="text-text-muted text-pretty leading-relaxed">
                    {tAgency('approach')}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <span className="flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 text-sm font-medium text-gold-accessible">
                    <Award size={14} className="text-gold" />
                    {t('badgeLicensed')}
                  </span>
                  <span className="flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 text-sm font-medium text-gold-accessible">
                    <Clock size={14} className="text-gold" />
                    {t('badgeExperience')}
                  </span>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Nos valeurs ─────────────────────────────────────── */}
        <section aria-labelledby="valeurs-title" className="section-y">
          <div className="container-luxury">
            <ScrollReveal className="text-center">
              <span className="text-eyebrow">{t('valuesEyebrow')}</span>
              <h2 id="valeurs-title" className="text-display-md mt-3 text-balance">
                {t('valuesTitle')}
              </h2>
              <span className="divider-gold-center mt-4" />
            </ScrollReveal>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-14 list-none p-0">
              {VALUES.map((val, i) => (
                <li key={val.key}>
                  <ScrollReveal delay={i * 80}>
                    <div className="surface-elevated p-7 h-full flex flex-col items-center text-center rounded-xl hover-lift">
                      <div className="w-14 h-14 flex items-center justify-center bg-gold/10 rounded-2xl mb-5">
                        <val.icon size={28} className="text-gold" />
                      </div>
                      <h3 className="font-display text-xl">{t(`values.${val.key}.title`)}</h3>
                      <p className="text-gold-accessible text-xs uppercase tracking-wide mt-1 mb-3">{t(`values.${val.key}.detail`)}</p>
                      <p className="text-text-muted text-sm leading-relaxed text-pretty">
                        {t(`values.${val.key}.description`)}
                      </p>
                    </div>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section aria-labelledby="cta-about" className="section-y bg-luxury-gradient">
          <div className="container-narrow text-center">
            <h2 id="cta-about" className="text-display-md text-white">
              {t('ctaTitle')}
            </h2>
            <p className="text-gold-muted mt-4">
              {tAgency('pricingNote')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/contact" className="btn btn-primary inline-flex items-center gap-2">
                {t('ctaQuote')} <ArrowRight size={16} />
              </Link>
              <Link href="/circuits" className="btn btn-outline-white inline-flex">
                {t('ctaTours')}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
