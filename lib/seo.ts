import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';

export const SITE_URL = 'https://voyages-authentic-maroc.com';
export const SITE_NAME = 'Voyages Authentiques Maroc';
const DEFAULT_OG_IMAGE = '/images/og-default.jpg';

/** Locales Open Graph par langue du site. Compléter en ajoutant une langue. */
export const OG_LOCALES: Record<string, string> = {
  fr: 'fr_FR',
  en: 'en_US',
  es: 'es_ES',
};

/**
 * Traduit un chemin français réel (ex. « /circuits/marrakech-merzouga-3j »)
 * vers son équivalent dans une autre langue, préfixe de locale inclus
 * (ex. « /en/private-morocco-tours/marrakech-merzouga-3j »),
 * en s'appuyant sur la table `pathnames` de i18n/routing.ts.
 */
export function localizePath(frPath: string, locale: Locale): string {
  for (const value of Object.values(routing.pathnames)) {
    const frPattern = typeof value === 'string' ? value : value.fr;
    const target = typeof value === 'string' ? value : value[locale];
    const regex = new RegExp(`^${frPattern.replace(/\[[^\]]+\]/g, '([^/]+)')}$`);
    const match = frPath.match(regex);
    if (match) {
      let i = 1;
      const localized = target.replace(/\[[^\]]+\]/g, () => match[i++]);
      if (locale === routing.defaultLocale) return localized;
      return localized === '/' ? `/${locale}` : `/${locale}${localized}`;
    }
  }
  // Chemin hors table (blog dynamique, etc.) : préfixe simple
  if (locale === routing.defaultLocale) return frPath;
  return frPath === '/' ? `/${locale}` : `/${locale}${frPath}`;
}

/** URLs hreflang complètes pour un chemin français donné (+ x-default → fr). */
export function hreflangAlternates(frPath: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${SITE_URL}${localizePath(frPath, locale)}`;
  }
  languages['x-default'] = `${SITE_URL}${frPath}`;
  return languages;
}

export interface SeoParams {
  title: string;
  description: string;
  /** Chemin FRANÇAIS canonique de la page (ex. « /circuits »). */
  path: string;
  /** Langue de la page rendue — détermine canonical et og:locale. */
  locale?: Locale;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateMetadata({
  title,
  description,
  path,
  locale = routing.defaultLocale,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  publishedTime,
  modifiedTime,
}: SeoParams): Metadata {
  const canonicalUrl = `${SITE_URL}${localizePath(path, locale)}`;
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;
  // Évite le double suffixe si le titre contient déjà le nom du site
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const ogLocale = OG_LOCALES[locale] ?? 'fr_FR';
  const alternateOgLocales = Object.entries(OG_LOCALES)
    .filter(([code]) => code !== locale)
    .map(([, og]) => og);

  return {
    // `absolute` empêche le template du layout d'ajouter un 2e suffixe
    title: { absolute: fullTitle },
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: ogLocale,
      alternateLocale: alternateOgLocales,
      type: ogType,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}
