import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Wrappers de navigation "locale-aware" : à utiliser À LA PLACE de
 * next/link et next/navigation dans les composants.
 * `<Link href="/circuits">` pointe automatiquement vers /circuits (fr)
 * ou /en/private-morocco-tours (en) selon la langue active.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
