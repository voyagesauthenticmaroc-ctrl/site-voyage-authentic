export type LegacyKind = 'home' | 'destination' | 'excursion' | 'service' | 'index' | 'testimonials';

export interface LegacySlug {
  path: string;
  label: string;
  kind: LegacyKind;
  contentSlug?: string;
}

export const LEGACY_SLUGS: LegacySlug[] = [
  { path: '/',         label: 'Accueil',  kind: 'home' },
  { path: '/circuits', label: 'Circuits', kind: 'index' },
  { path: '/avis',     label: 'Avis',     kind: 'testimonials' },
];

export const LEGACY_PATHS: string[] = LEGACY_SLUGS.map((s) => s.path);
