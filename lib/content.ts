/**
 * Chargeurs de contenu (server-only).
 * Lit les fichiers JSON de /content. À utiliser dans des Server Components,
 * `generateStaticParams`, `generateMetadata`, etc.
 */
import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

/* ------------------------------- Types ---------------------------------- */

export interface Seo {
  title: string;
  description: string;
}

export interface Hero {
  image: string;
  tagline?: string;
}

export interface Highlight {
  name: string;
  description: string;
}

export interface ProgramDay {
  label: string;
  items: string[];
}

export interface Program {
  title: string;
  duration?: string;
  description?: string;
  items?: string[];
  days?: ProgramDay[];
}

export interface Destination {
  slug: string;
  type: 'destination';
  legacyPath: string;
  name: string;
  seo: Seo;
  hero: Hero;
  intro: string;
  areas?: Highlight[];
  highlights: Highlight[];
  relatedExcursions?: string[];
  gallery: string[];
  practicalInfo?: PracticalInfo;
  faq?: FaqEntry[];
}

export interface Excursion {
  slug: string;
  type: 'excursion' | 'service';
  category: string;
  legacyPath: string;
  name: string;
  seo: Seo;
  hero: Hero;
  intro: string;
  experience?: string;
  programs?: Program[];
  dayTrips?: Program[];
  options?: Highlight[];
  details?: Record<string, unknown>;
  coverage?: Record<string, unknown>;
  vehicleTypes?: string[];
  relatedDestinations?: string[];
  gallery: string[];
  difficulty?: string;
  priceFrom?: string;
  included?: string[];
  excluded?: string[];
  faq?: FaqEntry[];
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface PracticalInfo {
  bestPeriod: string;
  daysRecommended: string;
  tips: string[];
}

export interface Review {
  author: string;
  location?: string;
  origin?: string;
  circuit?: string;
  date?: string;
  rating?: number;
  text: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  agency?: { name: string; role: string; bio: string; approach: string };
  /** @deprecated use agency */
  guide?: { name: string; role: string; bio: string; approach: string };
  contact: { email: string; phone: string; phoneRaw: string; whatsapp: string; address: string };
  social: { facebookPageName: string; facebookUrl: string | null; instagramUrl?: string | null };
  languages: string[];
  pricingNote: string;
  nav: { label: string; path: string }[];
}

/* ------------------------------ Helpers --------------------------------- */

async function readJson<T>(...segments: string[]): Promise<T> {
  const file = path.join(CONTENT_DIR, ...segments);
  return JSON.parse(await fs.readFile(file, 'utf8')) as T;
}

async function readJsonIfExists<T>(...segments: string[]): Promise<T | null> {
  try {
    return await readJson<T>(...segments);
  } catch {
    return null;
  }
}

async function readDir(...segments: string[]): Promise<string[]> {
  const dir = path.join(CONTENT_DIR, ...segments);
  const entries = await fs.readdir(dir);
  return entries.filter((f) => f.endsWith('.json'));
}

/* ---------------------------- i18n contenu ------------------------------ */
/**
 * Les traductions de contenu vivent dans `content/i18n/{locale}/{type}/{slugFr}.json`
 * (ex. content/i18n/en/excursions/marrakech-merzouga-3j.json) et SURCHARGENT
 * le fichier français champ par champ. Champs non traduits → fallback français.
 *
 * Le champ `slug` de l'override définit l'URL localisée
 * (ex. "marrakech-desert-tour-3-days" → /en/private-morocco-tours/marrakech-desert-tour-3-days).
 * `baseSlug` reste toujours le slug français (clé stable interne).
 */

const DEFAULT_LOCALE = 'fr';

function mergeTranslation<T extends { seo?: Seo; hero?: Hero }>(
  base: T,
  override: (Partial<T> & { seo?: Partial<Seo>; hero?: Partial<Hero> }) | null
): T & { baseSlug: string } {
  const baseSlug = (base as { slug?: string }).slug ?? '';
  if (!override) return { ...base, baseSlug };
  const merged = { ...base, ...override } as T;
  if (base.seo && override.seo) merged.seo = { ...base.seo, ...override.seo };
  if (base.hero && override.hero) merged.hero = { ...base.hero, ...override.hero };
  return { ...merged, baseSlug };
}

/* ------------------------------ Loaders --------------------------------- */

export function getSite(): Promise<SiteConfig> {
  return readJson<SiteConfig>('site.json');
}

export async function getDestinations(
  locale: string = DEFAULT_LOCALE
): Promise<(Destination & { baseSlug: string })[]> {
  const files = await readDir('destinations');
  return Promise.all(
    files.map(async (f) => {
      const base = await readJson<Destination>('destinations', f);
      const override =
        locale === DEFAULT_LOCALE
          ? null
          : await readJsonIfExists<Partial<Destination>>('i18n', locale, 'destinations', f);
      return mergeTranslation(base, override);
    })
  );
}

export async function getDestination(
  slug: string,
  locale: string = DEFAULT_LOCALE
): Promise<Destination & { baseSlug: string }> {
  if (locale === DEFAULT_LOCALE) {
    const base = await readJson<Destination>('destinations', `${slug}.json`);
    return mergeTranslation(base, null);
  }
  // Le slug demandé peut être un slug traduit : résolution via la liste complète.
  const all = await getDestinations(locale);
  const found = all.find((d) => d.slug === slug || d.baseSlug === slug);
  if (!found) throw new Error(`Destination introuvable: ${slug} (${locale})`);
  return found;
}

export async function getExcursions(
  locale: string = DEFAULT_LOCALE
): Promise<(Excursion & { baseSlug: string })[]> {
  const files = await readDir('excursions');
  return Promise.all(
    files.map(async (f) => {
      const base = await readJson<Excursion>('excursions', f);
      const override =
        locale === DEFAULT_LOCALE
          ? null
          : await readJsonIfExists<Partial<Excursion>>('i18n', locale, 'excursions', f);
      return mergeTranslation(base, override);
    })
  );
}

export async function getExcursion(
  slug: string,
  locale: string = DEFAULT_LOCALE
): Promise<Excursion & { baseSlug: string }> {
  if (locale === DEFAULT_LOCALE) {
    const base = await readJson<Excursion>('excursions', `${slug}.json`);
    return mergeTranslation(base, null);
  }
  const all = await getExcursions(locale);
  const found = all.find((e) => e.slug === slug || e.baseSlug === slug);
  if (!found) throw new Error(`Excursion introuvable: ${slug} (${locale})`);
  return found;
}

export async function getReviews(): Promise<Review[]> {
  const data = await readJson<{ reviews: Review[] }>('testimonials', 'reviews.json');
  return data.reviews;
}
