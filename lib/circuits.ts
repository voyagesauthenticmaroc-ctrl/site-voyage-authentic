/**
 * Helpers partagés pour dériver les infos des circuits (ville de départ,
 * durée, prix) à partir des données de /content/excursions.
 */
import type { Excursion } from '@/lib/content';

export function getDurationDays(exc: Excursion): number {
  if (exc.category === 'Excursion à la journée') return 1;
  const match = exc.slug.match(/-(\d+)j$/);
  if (match) return parseInt(match[1]);
  if (exc.programs?.[0]?.days) return exc.programs[0].days.length;
  return 0;
}

export function getDepartureCity(slug: string): string {
  if (slug.startsWith('marrakech-') || slug.startsWith('excursion-')) return 'Marrakech';
  if (slug.startsWith('fes-')) return 'Fès';
  if (slug.startsWith('casablanca-')) return 'Casablanca';
  if (slug.startsWith('tanger-')) return 'Tanger';
  if (slug.startsWith('rabat-')) return 'Rabat';
  if (slug.startsWith('agadir-')) return 'Agadir';
  if (slug.startsWith('or-rose-')) return 'Ouarzazate';
  return 'Maroc';
}

/** Extrait « 320 € » depuis « À partir de 320 € / personne — devis sur mesure ». */
export function parsePriceFrom(exc: Excursion): string | null {
  const match = exc.priceFrom?.match(/(\d[\d\s  ]*)€/);
  if (!match) return null;
  return `${match[1].replace(/[\s  ]+/g, ' ').trim()} €`;
}
