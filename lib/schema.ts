import { SITE_URL, SITE_NAME } from './seo';

const AGENCY_ID = `${SITE_URL}/#agency`;

/* ── Types ─────────────────────────────────────────────────────── */

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ReviewItem {
  author: string;
  rating: number;
  text: string;
  date?: string;
}

export interface ArticleParams {
  title: string;
  description: string;
  path: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  locale?: string;
}

/* ── Helpers ─────────────────────────────────────────────────────*/

export function schemaTravelAgency() {
  return {
    '@context': 'https://schema.org',
    '@type': ['TravelAgency', 'LocalBusiness'],
    '@id': AGENCY_ID,
    name: SITE_NAME,
    alternateName: 'Voyagesauthentiquemaroc',
    description:
      'Voyages Authentiques Maroc est un opérateur touristique marocain agréé, spécialisé dans les circuits privés et en petits groupes à travers le Maroc. Circuits sur mesure, désert du Sahara, villes impériales, excursions à la journée.',
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512.png`,
    image: `${SITE_URL}/images/og-default.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: "Résidence Soraya, Bloc A, Immeuble M'Hamid 9",
      addressLocality: 'Marrakech',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.6295,
      longitude: -7.9811,
    },
    priceRange: '$$',
    currenciesAccepted: 'EUR, MAD',
    paymentAccepted: 'Virement bancaire, Espèces',
    areaServed: {
      '@type': 'Country',
      name: 'Maroc',
    },
    availableLanguage: [
      { '@type': 'Language', name: 'Français' },
      { '@type': 'Language', name: 'Anglais' },
      { '@type': 'Language', name: 'Espagnol' },
      { '@type': 'Language', name: 'Italien' },
      { '@type': 'Language', name: 'Arabe' },
    ],
    sameAs: [
      'https://www.facebook.com/voyagesauthentiquesmaroc',
      'https://www.instagram.com/voyagesauthentiquesmaroc',
      'https://www.linkedin.com/company/voyages-authentiques-maroc',
      'https://share.google/27b0YuFSPf5iQoI5e',
    ],
    knowsAbout: [
      'Circuits privés au Maroc',
      'Désert du Sahara — Erg Chebbi, Merzouga',
      'Villes impériales — Marrakech, Fès, Meknès',
      'Chefchaouen — Ville bleue',
      'Aït Ben Haddou — UNESCO',
      'Excursions à la journée',
      'Trekking Atlas',
    ],
  };
}

export function schemaBreadcrumb(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: SITE_URL,
      },
      ...items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: item.name,
        item: `${SITE_URL}${item.path}`,
      })),
    ],
  };
}

export function schemaTouristDestination(params: {
  name: string;
  description: string;
  path: string;
  image?: string;
  country?: string;
  locale?: string;
}) {
  const locale = params.locale ?? 'fr';
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: params.name,
    description: params.description,
    url: `${SITE_URL}${params.path}`,
    ...(params.image && { image: params.image.startsWith('http') ? params.image : `${SITE_URL}${params.image}` }),
    inLanguage: locale,
    touristType: {
      '@type': 'Audience',
      audienceType: locale === 'fr' ? 'Touristes francophones' : 'International tourists',
    },
    containedInPlace: {
      '@type': 'Country',
      name: params.country ?? 'Maroc',
    },
    publicAccess: true,
  };
}

export function schemaTouristTrip(params: {
  name: string;
  description: string;
  path: string;
  image?: string;
  duration?: string;
  locale?: string;
}) {
  const locale = params.locale ?? 'fr';
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: params.name,
    description: params.description,
    url: `${SITE_URL}${params.path}`,
    ...(params.image && { image: params.image.startsWith('http') ? params.image : `${SITE_URL}${params.image}` }),
    ...(params.duration && { duration: params.duration }),
    provider: {
      '@id': AGENCY_ID,
      '@type': 'TravelAgency',
      name: SITE_NAME,
    },
    touristType: {
      '@type': 'Audience',
      audienceType: locale === 'fr' ? 'Touristes francophones' : 'International tourists',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'PriceSpecification',
        description: locale === 'fr' ? 'Sur devis personnalisé' : 'Custom quote',
      },
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}${locale === 'fr' ? '' : `/${locale}`}/contact`,
    },
    inLanguage: locale,
    availableLanguage: [
      { '@type': 'Language', name: 'Français' },
      { '@type': 'Language', name: 'English' },
    ],
  };
}

export function schemaFaqPage(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function schemaAggregateRating(reviews: ReviewItem[]) {
  const rated = reviews.filter((r) => r.rating > 0);
  if (rated.length === 0) return null;
  const avg = rated.reduce((sum, r) => sum + r.rating, 0) / rated.length;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': AGENCY_ID,
    name: SITE_NAME,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avg.toFixed(1),
      reviewCount: rated.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: rated.slice(0, 10).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.text,
      ...(r.date && { datePublished: r.date }),
    })),
  };
}

export function schemaArticle(params: ArticleParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.title,
    description: params.description,
    url: `${SITE_URL}${params.path}`,
    ...(params.image && { image: params.image.startsWith('http') ? params.image : `${SITE_URL}${params.image}` }),
    datePublished: params.publishedTime,
    dateModified: params.modifiedTime ?? params.publishedTime,
    author: {
      '@type': 'Organization',
      name: params.author ?? SITE_NAME,
    },
    publisher: {
      '@id': AGENCY_ID,
      '@type': 'Organization',
      name: SITE_NAME,
    },
    inLanguage: params.locale ?? 'fr',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${params.path}`,
    },
  };
}

export function schemaContactPoint() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': AGENCY_ID,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        url: `${SITE_URL}/contact`,
        availableLanguage: [
          { '@type': 'Language', name: 'Français' },
          { '@type': 'Language', name: 'Arabe' },
        ],
        areaServed: { '@type': 'Country', name: 'Maroc' },
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '08:00',
          closes: '20:00',
        },
      },
    ],
  };
}

export function schemaPerson(params: {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image?: string;
  languages: string[];
  knowsAbout: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: params.name,
    jobTitle: params.jobTitle,
    description: params.description,
    url: params.url,
    ...(params.image && {
      image: params.image.startsWith('http') ? params.image : `${SITE_URL}${params.image}`,
    }),
    worksFor: { '@id': AGENCY_ID, '@type': 'TravelAgency', name: SITE_NAME },
    knowsLanguage: params.languages.map((l) => ({ '@type': 'Language', name: l })),
    knowsAbout: params.knowsAbout,
    nationality: { '@type': 'Country', name: 'Maroc' },
    homeLocation: { '@type': 'Place', name: 'Marrakech, Maroc' },
  };
}

export function schemaWebPage(params: {
  name: string;
  description: string;
  path: string;
  locale?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: params.name,
    description: params.description,
    url: `${SITE_URL}${params.path}`,
    isPartOf: { '@id': SITE_URL },
    about: { '@id': AGENCY_ID },
    inLanguage: params.locale ?? 'fr',
  };
}
