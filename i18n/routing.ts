import { defineRouting } from 'next-intl/routing';

/**
 * Configuration multilingue du site.
 *
 * - Le français est la langue par défaut, SANS préfixe d'URL :
 *   les URLs existantes (/circuits, /destinations…) ne changent pas.
 * - Les autres langues sont préfixées (/en/…, /es/…) avec des URLs TRADUITES
 *   pour le SEO (ex. /en/private-morocco-tours, /es/tours-privados-marruecos).
 *
 * ── Ajouter une nouvelle langue ──────────────────────────────
 * 1. Ajouter le code dans `locales` (ex. 'de')
 * 2. Ajouter les chemins traduits dans chaque entrée de `pathnames`
 * 3. Créer messages/de.json (copier en.json et traduire)
 * 4. Ajouter la locale dans LOCALE_LABELS et OG_LOCALES (lib/seo.ts)
 */
export const routing = defineRouting({
  locales: ['fr', 'en', 'es'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/circuits': {
      fr: '/circuits',
      en: '/private-morocco-tours',
      es: '/tours-privados-marruecos',
    },
    '/circuits/[slug]': {
      fr: '/circuits/[slug]',
      en: '/private-morocco-tours/[slug]',
      es: '/tours-privados-marruecos/[slug]',
    },
    '/destinations': {
      fr: '/destinations',
      en: '/morocco-destinations',
      es: '/destinos-marruecos',
    },
    '/destinations/[slug]': {
      fr: '/destinations/[slug]',
      en: '/morocco-destinations/[slug]',
      es: '/destinos-marruecos/[slug]',
    },
    '/contact': '/contact',
    '/a-propos': {
      fr: '/a-propos',
      en: '/about-us',
      es: '/sobre-nosotros',
    },
    '/avis': {
      fr: '/avis',
      en: '/reviews',
      es: '/opiniones',
    },
    '/faq': '/faq',
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/mentions-legales': {
      fr: '/mentions-legales',
      en: '/legal-notice',
      es: '/aviso-legal',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;

/** Libellés affichés dans le sélecteur de langue. */
export const LOCALE_LABELS: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
};
