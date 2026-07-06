import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import {
  Star,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  MapPin,
  Users,
  Shield,
  Globe,
  Heart,
  Home,
  Compass,
  Clock,
  CreditCard,
  Languages,
  Lock,
} from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ContactForm } from '@/components/ContactForm';
import { generateMetadata as _gen } from '@/lib/seo';
import { schemaTravelAgency, schemaWebPage, schemaAggregateRating } from '@/lib/schema';
import { getSite, getReviews, getExcursions } from '@/lib/content';
import { isPlaceholder } from '@/lib/placeholders';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  return _gen({
    title: t('title'),
    description: t('description'),
    path: '/',
    locale,
  });
}

/* Circuits phares : slug → clé de traduction + visuel (photos vérifiées Unsplash) */
const FEATURED: { slug: string; key: 'merzouga' | 'grandTour' | 'chefchaouen'; src: string; alt: string }[] = [
  {
    slug: 'marrakech-merzouga-3j',
    key: 'merzouga',
    src: '/images/desert-caravane.jpg',
    alt: "Caravane de dromadaires au coucher du soleil dans les dunes de l'Erg Chebbi, Merzouga",
  },
  {
    slug: 'marrakech-imperial-9j',
    key: 'grandTour',
    src: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80',
    alt: "Kasbah et palmeraie du sud marocain, vallées de l'Atlas",
  },
  {
    slug: 'marrakech-chefchaouen-4j',
    key: 'chefchaouen',
    src: '/images/chefchaouen-ruelle.jpg',
    alt: 'Ruelle bleue fleurie de Chefchaouen, la perle du Rif',
  },
];

/* Destinations phares : clé de traduction + visuel */
const HOME_DESTS: { key: 'sahara' | 'chefchaouen' | 'marrakech' | 'aitBenHaddou'; src: string; alt: string; tall: boolean }[] = [
  {
    key: 'sahara',
    src: 'https://images.unsplash.com/photo-1758124270360-3d13c31b74f8?auto=format&fit=crop&w=600&q=80',
    alt: "Dunes de l'Erg Chebbi au coucher du soleil, Merzouga",
    tall: true,
  },
  {
    key: 'chefchaouen',
    src: '/images/chefchaouen-ruelle.jpg',
    alt: 'Ruelle bleue fleurie de Chefchaouen',
    tall: false,
  },
  {
    key: 'marrakech',
    src: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80',
    alt: 'Place Jemaa el-Fna au coucher du soleil, Marrakech',
    tall: false,
  },
  {
    key: 'aitBenHaddou',
    src: 'https://images.unsplash.com/photo-1569531955316-bb271f9c4531?auto=format&fit=crop&w=600&q=80',
    alt: "Ksar d'Aït Ben Haddou, patrimoine UNESCO",
    tall: true,
  },
];

/* Couleurs des avatars (initiales) */
const AVATAR_COLORS = ['#E07C3A', '#243B6A', '#2E7D5B', '#8A5CB8'];

function initials(name: string): string {
  return name
    .split(/[\s&]+/)
    .filter((w) => /^[A-ZÀ-Ü]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [site, reviews, t, tAgency, tMeta] = await Promise.all([
    getSite(),
    getReviews(),
    getTranslations({ locale, namespace: 'homePage' }),
    getTranslations({ locale, namespace: 'agency' }),
    getTranslations({ locale, namespace: 'meta.home' }),
  ]);

  const featuredReviews = reviews.slice(0, 3);
  const ratedReviews = reviews
    .filter((r) => r.rating)
    .map((r) => ({ author: r.author, rating: r.rating!, text: r.text, date: r.date }));

  const aggregateRatingSchema = schemaAggregateRating(ratedReviews);

  const trustItems = [
    { icon: Users, label: t('trust.guides') },
    { icon: Star, label: t('trust.private') },
    { icon: Clock, label: t('trust.assistance') },
    { icon: Lock, label: t('trust.payment') },
  ];

  const marqueeItems = t('marquee').split('|');
  const checklist = t.raw('checklist') as string[];

  return (
    <>
      <JsonLd data={schemaTravelAgency()} />
      <JsonLd
        data={schemaWebPage({
          name: site.name,
          description: tMeta('description'),
          path: '/',
          locale,
        })}
      />
      {aggregateRatingSchema && <JsonLd data={aggregateRatingSchema} />}

      <main id="main-content">

        {/* ══════════════════════════════════════════════════════
            1. HERO
        ══════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden"
          aria-labelledby="hero-title"
          style={{ background: '#181410' }}
        >
          <div className="absolute inset-0">
            <Image
              src="/images/hero-marrakech.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[62%_center]"
              aria-hidden="true"
            />
            <span className="sr-only">{t('heroImageAlt')}</span>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(24,20,16,0.96) 0%, rgba(24,20,16,0.88) 20%, rgba(24,20,16,0.55) 36%, rgba(24,20,16,0.15) 50%, transparent 60%)',
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(24,20,16,0.45) 0%, transparent 16%, transparent 82%, rgba(24,20,16,0.4) 100%)',
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 pointer-events-none lg:hidden" style={{ background: 'rgba(24,20,16,0.45)' }} aria-hidden="true" />
          </div>

          {/* Carte de confiance flottante — desktop */}
          <div className="hidden lg:grid absolute right-10 top-1/2 -translate-y-1/2 z-10 bg-white rounded-2xl shadow-2xl p-5 w-[210px] gap-5">
            <div className="flex justify-center pb-1" aria-hidden="true">
              <svg viewBox="0 0 36 44" width="22" height="27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 42V22C3 10.5 9.5 3 18 3C26.5 3 33 10.5 33 22V42" stroke="var(--accent)" strokeWidth="1.5" fill="none"/>
                <path d="M18 6.5L19.4 10.4L23.4 9.1L21.1 12.5L24.8 14L21.1 15.5L23.4 18.9L19.4 17.6L18 21.5L16.6 17.6L12.6 18.9L14.9 15.5L11.2 14L14.9 12.5L12.6 9.1L16.6 10.4Z" fill="var(--accent)"/>
              </svg>
            </div>
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-pale)' }}
                >
                  <Icon size={16} style={{ color: 'var(--accent)' }} />
                </span>
                <span className="text-[0.68rem] font-bold uppercase tracking-wide leading-snug" style={{ color: 'var(--ink)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="container-luxury relative pt-28 pb-16 lg:pt-36 lg:pb-24">
            <div className="max-w-xl">

              <div className="relative z-10">
                <span
                  className="text-eyebrow animate-fade-in inline-block"
                  style={{ color: '#C0AA70' }}
                >
                  {t('heroEyebrow')}
                </span>
                <h1
                  id="hero-title"
                  className="text-white mt-5 animate-fade-up delay-100 font-display font-light"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4.75rem)', lineHeight: 1.04, letterSpacing: '-0.02em' }}
                >
                  {t('heroTitle1')}
                  <br />
                  {t('heroTitle2')}
                  <br />
                  <span className="script-accent" style={{ fontSize: '1.25em' }}>{t('heroTitleScript')}</span>
                </h1>
                <p className="text-base sm:text-lg mt-7 max-w-md leading-relaxed text-pretty animate-fade-up delay-200" style={{ color: 'rgba(255,255,255,0.95)' }}>
                  {tAgency('description')}
                </p>

                <div className="flex flex-wrap gap-4 mt-9 animate-fade-up delay-300">
                  <Link href="/circuits" className="btn btn-primary px-7 py-3.5 text-xs inline-flex items-center gap-2">
                    {t('ctaTours')} <ArrowRight size={14} />
                  </Link>
                  <a
                    href={`https://wa.me/${site.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-white px-7 py-3.5 text-xs inline-flex items-center gap-2"
                  >
                    {t('ctaContact')} <MessageCircle size={14} />
                  </a>
                </div>

                {/* Preuve sociale */}
                <div className="flex items-center gap-4 mt-10 animate-fade-up delay-400">
                  <div className="flex -space-x-3" aria-hidden="true">
                    {featuredReviews.concat(reviews.slice(3, 4)).slice(0, 4).map((r, i) => (
                      <span
                        key={i}
                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-[0.7rem] font-bold text-white"
                        style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], borderColor: 'var(--forest-deep)' }}
                      >
                        {initials(r.author)}
                      </span>
                    ))}
                  </div>
                  <div>
                    <p className="text-white/85 text-sm font-medium">
                      {t('socialProof')}
                    </p>
                    <span className="flex gap-0.5 mt-1" aria-label={t('starsAria')}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />
                      ))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Carte confiance — mobile */}
              <div className="lg:hidden mt-10 bg-white rounded-2xl shadow-xl p-5 grid grid-cols-2 gap-4 relative z-10">
                {trustItems.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--accent-pale)' }}
                    >
                      <Icon size={16} style={{ color: 'var(--accent)' }} />
                    </span>
                    <span className="text-[0.68rem] font-bold uppercase tracking-wide leading-snug" style={{ color: 'var(--ink)' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            2. BARRE DE STATISTIQUES
        ══════════════════════════════════════════════════════ */}
        <div className="container-luxury relative z-20 -mt-8 lg:-mt-12">
          <div className="bg-white rounded-2xl shadow-xl px-6 py-8 lg:px-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-7">
              {[
                { icon: Users, num: '500+', label: t('stats.travellers'), tint: '#2E9E6B' },
                { icon: Star, num: '10+', label: t('stats.experience'), tint: '#EE9525' },
                { icon: Globe, num: '4', label: t('stats.languages'), tint: '#1E4B8F' },
                { icon: Heart, num: '100%', label: t('stats.custom'), tint: '#F0B12E' },
                { icon: Shield, num: t('stats.guaranteeNum'), label: t('stats.guarantee'), tint: '#2AB5A0' },
              ].map(({ icon: Icon, num, label, tint }) => (
                <div key={label} className="flex items-center gap-3.5">
                  <span
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: tint }}
                  >
                    <Icon size={21} className="text-white" />
                  </span>
                  <div className="leading-tight">
                    <p className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>{num}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--warm-gray)' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            2b. BANDEAU DÉFILANT
        ══════════════════════════════════════════════════════ */}
        <div className="overflow-hidden py-7 mt-4" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center flex-shrink-0">
                {marqueeItems.map((d) => (
                  <span key={d} className="flex items-center">
                    <span className="script-accent px-6" style={{ fontSize: '1.9rem', opacity: 0.85 }}>{d}</span>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="var(--gold)" opacity="0.55" aria-hidden="true">
                      <path d="M12 2L13.5 7.5L19 6L14.5 10L19 14L13.5 12.5L12 18L10.5 12.5L5 14L9.5 10L5 6L10.5 7.5Z"/>
                    </svg>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            3. QUI SOMMES-NOUS
        ══════════════════════════════════════════════════════ */}
        <section aria-labelledby="agency-title" className="section-y-lg">
          <div className="container-luxury">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              <ScrollReveal direction="left">
                <span className="text-eyebrow-accent">{t('agencyEyebrow')}</span>
                <h2 id="agency-title" className="text-display-md mt-3 text-balance">
                  {t('agencyTitle1')}
                  <br />
                  {t('agencyTitle2')} <span className="script-accent">{t('agencyTitleScript')}</span> {t('agencyTitle3')}
                </h2>

                <p className="mt-6 text-pretty leading-relaxed text-lg">
                  {tAgency('bio')}
                </p>
                <p className="mt-4 text-text-muted text-pretty leading-relaxed">
                  {tAgency('approach')}
                </p>

                <div className="flex flex-wrap gap-3 mt-7">
                  {[
                    { icon: Shield, label: t('agencyBadges.licensed') },
                    { icon: Languages, label: t('agencyBadges.languages') },
                    { icon: Users, label: t('agencyBadges.groups') },
                  ].map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
                      style={{ background: 'var(--accent-pale)', border: '1px solid rgba(224,124,58,0.25)', color: 'var(--accent-dark)' }}
                    >
                      <Icon size={13} style={{ color: 'var(--accent)' }} />
                      {label}
                    </span>
                  ))}
                </div>

                <Link href="/a-propos" className="btn btn-secondary mt-8 inline-flex items-center gap-2 text-xs">
                  {t('agencyMore')} <ArrowRight size={14} />
                </Link>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <div className="grid grid-cols-[1.4fr_1fr] gap-4">
                  <div className="relative rounded-3xl overflow-hidden shadow-lg" style={{ aspectRatio: '4/5' }}>
                    <Image
                      src="/images/riad-patio.jpg"
                      alt="Riad, Marrakech"
                      fill
                      sizes="(min-width: 1024px) 30vw, 55vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="relative rounded-3xl overflow-hidden shadow-lg flex-1" style={{ minHeight: '140px' }}>
                      <Image
                        src="/images/desert-caravane.jpg"
                        alt="Sahara"
                        fill
                        sizes="(min-width: 1024px) 20vw, 40vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative rounded-3xl overflow-hidden shadow-lg flex-1" style={{ minHeight: '140px' }}>
                      <Image
                        src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=500&q=80"
                        alt="Zellige"
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 20vw, 40vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            4. NOS CIRCUITS PHARES
        ══════════════════════════════════════════════════════ */}
        <section aria-labelledby="circuits-title" className="section-y bg-parchment-gradient">
          <div className="container-luxury">
            <ScrollReveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="text-eyebrow-accent">{t('featuredEyebrow')}</span>
                <h2 id="circuits-title" className="text-display-md mt-3 text-balance">
                  {t('featuredTitle')}
                </h2>
              </div>
              <Link
                href="/circuits"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide flex-shrink-0 transition-colors hover:opacity-75"
                style={{ color: 'var(--ink)' }}
              >
                {t('seeAllTours')} <ArrowRight size={15} style={{ color: 'var(--accent)' }} />
              </Link>
            </ScrollReveal>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 list-none p-0">
              {FEATURED.map(({ slug, key, src, alt }, i) => (
                <li key={slug}>
                  <ScrollReveal delay={i * 90}>
                    <article className="group rounded-3xl overflow-hidden shadow-lg hover-lift h-full flex flex-col" style={{ background: 'var(--forest-deep)' }}>
                      <Link href={{ pathname: '/circuits/[slug]', params: { slug } }} className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={src}
                            alt={alt}
                            fill
                            unoptimized
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                          />
                          <span
                            className="absolute top-4 left-4 text-[0.65rem] font-bold uppercase tracking-widest text-white rounded-full px-3.5 py-1.5"
                            style={{ background: 'var(--accent)' }}
                          >
                            {t(`featured.${key}.badge`)}
                          </span>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="font-display text-2xl text-white leading-snug">
                            {t(`featured.${key}.title`)}
                          </h3>
                          <p className="text-xs font-semibold uppercase tracking-wide mt-1.5" style={{ color: 'var(--accent-light)' }}>
                            {t(`featured.${key}.duration`)}
                          </p>
                          <p className="text-white/65 text-sm mt-3 leading-relaxed flex-1">
                            {t(`featured.${key}.desc`)}
                          </p>
                          <div
                            className="flex items-center justify-between mt-5 pt-4"
                            style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
                          >
                            <span className="text-white text-sm font-semibold">
                              {t(`featured.${key}.price`)} <span className="text-white/50 font-normal">{t('perPerson')}</span>
                            </span>
                            <span
                              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1"
                              style={{ background: 'var(--accent)' }}
                              aria-hidden="true"
                            >
                              <ArrowRight size={16} className="text-white" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            5. DESTINATIONS PHARES
        ══════════════════════════════════════════════════════ */}
        <section aria-labelledby="experiences-title" className="section-y">
          <div className="container-luxury">
            <ScrollReveal className="text-center mb-12">
              <span className="text-eyebrow-accent">{t('destEyebrow')}</span>
              <h2 id="experiences-title" className="text-display-md mt-3 text-balance">
                {t('destTitle1')} <span className="script-accent">{t('destTitleScript')}</span>
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {HOME_DESTS.map(({ key, src, alt, tall }, i) => (
                <ScrollReveal key={key} delay={i * 60}>
                  <Link href="/circuits" className="block group">
                    <div
                      className="relative overflow-hidden rounded-2xl"
                      style={{ aspectRatio: tall ? '3/4' : '3/3.6' }}
                    >
                      <Image
                        src={src}
                        alt={alt}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4">
                        <p className="font-display text-white text-lg font-light leading-tight">{t(`dest.${key}.label`)}</p>
                        <p className="text-xs mt-0.5 tracking-wide" style={{ color: 'var(--accent-light)' }}>{t(`dest.${key}.sub`)}</p>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            5b. BANNIÈRE PARALLAXE
        ══════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="banner-title"
          className="relative overflow-hidden parallax-banner"
          style={{ backgroundImage: 'url(/images/desert-marcheur.jpg)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(24,20,16,0.62) 0%, rgba(24,20,16,0.45) 50%, rgba(24,20,16,0.68) 100%)' }}
            aria-hidden="true"
          />
          <div className="container-narrow relative text-center py-24 lg:py-36">
            <ScrollReveal>
              <span className="script-accent block" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--accent-light)' }}>
                {t('bannerScript')}
              </span>
              <h2 id="banner-title" className="text-display-md text-white mt-4 text-balance">
                {t('bannerTitle')}
              </h2>
              <p className="text-white/75 mt-5 max-w-xl mx-auto text-pretty">
                {t('bannerText')}
              </p>
              <Link href="/circuits" className="btn btn-primary mt-9 inline-flex items-center gap-2">
                {t('bannerCta')} <ArrowRight size={14} />
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            6. TÉMOIGNAGES
        ══════════════════════════════════════════════════════ */}
        <section aria-labelledby="avis-title" className="section-y">
          <div className="container-luxury">
            <div className="rounded-3xl p-7 sm:p-10 lg:p-14" style={{ background: 'var(--forest-pale)' }}>
              <ScrollReveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div>
                  <span className="text-eyebrow-accent">{t('reviewsEyebrow')}</span>
                  <h2 id="avis-title" className="text-display-md mt-3 text-balance">
                    {t('reviewsTitle')}
                  </h2>
                </div>
                <div className="lg:text-right flex-shrink-0">
                  <span className="flex lg:justify-end gap-1" aria-label={t('starsAria')}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={19} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />
                    ))}
                  </span>
                  <p className="font-semibold mt-1.5" style={{ color: 'var(--ink)' }}>
                    5/5 <span className="font-normal" style={{ color: 'var(--warm-gray)' }}>{t('onGoogle')}</span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--warm-gray)' }}>
                    {t('basedOn')}
                  </p>
                </div>
              </ScrollReveal>

              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10 list-none p-0">
                {featuredReviews.map((review, i) => (
                  <li key={i}>
                    <ScrollReveal delay={i * 100}>
                      <blockquote
                        className="bg-white rounded-2xl p-6 h-full flex flex-col shadow-sm"
                        itemScope
                        itemType="https://schema.org/Review"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display text-4xl leading-none" style={{ color: 'var(--accent)' }} aria-hidden="true">
                            &ldquo;
                          </span>
                          <span className="flex gap-0.5">
                            {[...Array(review.rating ?? 5)].map((_, j) => (
                              <Star key={j} size={13} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />
                            ))}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed flex-1 mt-3 text-pretty" style={{ color: 'var(--ink-soft)' }} itemProp="reviewBody">
                          {review.text.length > 190 ? `${review.text.slice(0, 187).trimEnd()}…` : review.text}
                        </p>
                        <footer className="flex items-center gap-3 mt-5 pt-4" style={{ borderTop: '1px solid var(--forest-pale)' }}>
                          <span
                            className="w-10 h-10 rounded-full flex items-center justify-center text-[0.7rem] font-bold text-white flex-shrink-0"
                            style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                            aria-hidden="true"
                          >
                            {initials(review.author)}
                          </span>
                          <div className="leading-tight">
                            <cite className="not-italic font-semibold text-sm block" style={{ color: 'var(--ink)' }} itemProp="author">
                              {review.author}
                            </cite>
                            <span className="text-xs" style={{ color: 'var(--warm-gray)' }}>
                              {(review.origin ?? review.location ?? '').split(',').pop()?.trim()}
                            </span>
                          </div>
                        </footer>
                      </blockquote>
                    </ScrollReveal>
                  </li>
                ))}
              </ul>

              <ScrollReveal className="text-center mt-9">
                <Link href="/avis" className="btn btn-primary text-xs">
                  {t('readAllReviews')}
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            7. CONTACT
        ══════════════════════════════════════════════════════ */}
        <section aria-labelledby="contact-title" className="section-y-lg relative overflow-hidden" style={{ background: 'var(--cream)' }}>
          <div className="container-luxury relative">
            <ScrollReveal className="text-center mb-12">
              <span className="text-eyebrow-accent">{t('contactEyebrow')}</span>
              <h2 id="contact-title" className="text-display-md mt-3 text-balance">
                {t('contactTitle1')} <span className="script-accent">{t('contactTitleScript')}</span>
              </h2>
              <p className="text-text-muted mt-4 max-w-xl mx-auto">
                {t('contactSub')}
              </p>
            </ScrollReveal>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <ScrollReveal direction="left">
                <div
                  className="rounded-2xl p-6 sm:p-8 shadow-xl"
                  style={{ background: 'var(--forest-deep)', border: '1px solid rgba(224,124,58,0.18)' }}
                >
                  <h3 className="font-display text-2xl text-white mb-6">
                    {t('formTitle')}
                  </h3>
                  <ContactForm whatsapp={site.contact.whatsapp} />
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={150}>
                <div className="flex flex-col gap-5">
                  <a
                    href={`https://wa.me/${site.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 text-white rounded-full p-5 text-base font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    style={{ background: '#25D366' }}
                  >
                    <MessageCircle size={22} />
                    {t('writeWhatsApp')}
                  </a>

                  <div
                    className="rounded-2xl p-6 flex flex-col gap-4 bg-white"
                    style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                  >
                    {!isPlaceholder(site.contact.phone) && (
                      <a
                        href={`tel:${site.contact.phoneRaw}`}
                        className="flex items-center gap-3 transition-colors hover:opacity-70"
                        style={{ color: 'var(--text)' }}
                      >
                        <Phone size={17} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                        <span>{site.contact.phone}</span>
                      </a>
                    )}
                    {!isPlaceholder(site.contact.email) && (
                      <a
                        href={`mailto:${site.contact.email}`}
                        className="flex items-center gap-3 transition-colors hover:opacity-70"
                        style={{ color: 'var(--text)' }}
                      >
                        <Mail size={17} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                        <span className="break-all">{site.contact.email}</span>
                      </a>
                    )}
                    <div className="flex items-center gap-3 text-text-muted">
                      <MapPin size={17} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      <span className="text-sm">{site.contact.address}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 list-none p-0">
                    {checklist.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-text-muted text-sm">
                        <CheckCircle size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '0.1rem' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            8. BANDEAU ENGAGEMENTS
        ══════════════════════════════════════════════════════ */}
        <div className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--ivory)' }}>
          <div className="container-luxury py-10">
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8 list-none p-0">
              {[
                { icon: Users, key: 'guides' },
                { icon: Home, key: 'lodging' },
                { icon: Compass, key: 'experiences' },
                { icon: Clock, key: 'assistance' },
                { icon: CreditCard, key: 'payment' },
              ].map(({ icon: Icon, key }) => (
                <li key={key} className="flex items-center gap-3">
                  <span
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--accent-pale)' }}
                  >
                    <Icon size={19} style={{ color: 'var(--accent)' }} />
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{t(`engagements.${key}.title`)}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--warm-gray)' }}>{t(`engagements.${key}.sub`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </main>
    </>
  );
}
