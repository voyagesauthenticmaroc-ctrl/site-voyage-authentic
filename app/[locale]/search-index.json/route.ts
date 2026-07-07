import { NextResponse } from 'next/server';
import { getDestinations, getExcursions } from '@/lib/content';
import { getAllPosts } from '@/lib/blog';
import { routing, type Locale } from '@/i18n/routing';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export interface SearchItem {
  id: string;
  category: 'circuit' | 'destination' | 'article' | 'page';
  title: string;
  description: string;
  href: string;
  keywords: string;
  /** Champs enrichis pour la wishlist / comparateur — circuits uniquement. */
  slug?: string;
  image?: string;
  priceFrom?: string;
  duration?: string;
  circuitCategory?: string;
  included?: string[];
  excluded?: string[];
  itinerary?: string[];
}

const STATIC_PAGES: Record<Locale, { title: string; description: string; href: string; keywords: string }[]> = {
  fr: [
    { title: 'Nos circuits', description: 'Tous nos circuits privés au Maroc', href: '/fr/circuits', keywords: 'voyages tours sur mesure' },
    { title: 'Destinations', description: 'Toutes les destinations marocaines', href: '/fr/destinations', keywords: 'villes régions maroc' },
    { title: 'À propos', description: "L'agence Voyages Authentiques Maroc", href: '/fr/a-propos', keywords: 'équipe histoire' },
    { title: 'Avis clients', description: 'Ce que disent nos voyageurs', href: '/fr/avis', keywords: 'témoignages notes google' },
    { title: 'Blog', description: 'Nos guides et conseils voyage', href: '/fr/blog', keywords: 'articles conseils' },
    { title: 'FAQ', description: 'Questions fréquentes', href: '/fr/faq', keywords: 'questions réponses aide' },
    { title: 'Contact', description: 'Demander un devis gratuit', href: '/fr/contact', keywords: 'devis email téléphone whatsapp' },
  ],
  en: [
    { title: 'Our tours', description: 'All private tours in Morocco', href: '/en/circuits', keywords: 'travel packages custom' },
    { title: 'Destinations', description: 'All Moroccan destinations', href: '/en/destinations', keywords: 'cities regions morocco' },
    { title: 'About us', description: 'Voyages Authentiques Maroc agency', href: '/en/a-propos', keywords: 'team story' },
    { title: 'Reviews', description: 'What our travellers say', href: '/en/avis', keywords: 'testimonials ratings google' },
    { title: 'Blog', description: 'Our travel guides and tips', href: '/en/blog', keywords: 'articles advice' },
    { title: 'FAQ', description: 'Frequently asked questions', href: '/en/faq', keywords: 'questions answers help' },
    { title: 'Contact', description: 'Request a free quote', href: '/en/contact', keywords: 'quote email phone whatsapp' },
  ],
  es: [
    { title: 'Nuestros circuitos', description: 'Todos los circuitos privados en Marruecos', href: '/es/circuits', keywords: 'viajes tours a medida' },
    { title: 'Destinos', description: 'Todos los destinos marroquíes', href: '/es/destinations', keywords: 'ciudades regiones marruecos' },
    { title: 'Sobre nosotros', description: 'La agencia Voyages Authentiques Maroc', href: '/es/a-propos', keywords: 'equipo historia' },
    { title: 'Opiniones', description: 'Lo que dicen nuestros viajeros', href: '/es/avis', keywords: 'testimonios notas google' },
    { title: 'Blog', description: 'Nuestras guías y consejos de viaje', href: '/es/blog', keywords: 'artículos consejos' },
    { title: 'FAQ', description: 'Preguntas frecuentes', href: '/es/faq', keywords: 'preguntas respuestas ayuda' },
    { title: 'Contacto', description: 'Solicitar un presupuesto gratis', href: '/es/contact', keywords: 'presupuesto email teléfono whatsapp' },
  ],
};

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };

  const [excursions, destinations] = await Promise.all([
    getExcursions(locale),
    getDestinations(locale),
  ]);
  const posts = getAllPosts();

  const items: SearchItem[] = [];

  for (const e of excursions) {
    const days = e.programs?.[0]?.days;
    items.push({
      id: `circuit-${e.slug}`,
      category: 'circuit',
      title: e.name,
      description: e.intro?.slice(0, 160) ?? '',
      href: `/${locale}/circuits/${e.slug}`,
      keywords: [e.category, e.difficulty, e.priceFrom].filter(Boolean).join(' '),
      slug: e.slug,
      image: e.hero?.image,
      priceFrom: e.priceFrom,
      duration: e.programs?.[0]?.duration,
      circuitCategory: e.category,
      included: e.included,
      excluded: e.excluded,
      itinerary: days?.map((d) => d.label),
    });
  }

  for (const d of destinations) {
    items.push({
      id: `destination-${d.slug}`,
      category: 'destination',
      title: d.name,
      description: d.intro?.slice(0, 160) ?? '',
      href: `/${locale}/destinations/${d.slug}`,
      keywords: (d.highlights ?? []).map((h) => h.name).join(' '),
    });
  }

  // Le blog est uniquement disponible en français (fichiers .mdx source)
  if (locale === 'fr') {
    for (const p of posts) {
      items.push({
        id: `article-${p.slug}`,
        category: 'article',
        title: p.title,
        description: p.description,
        href: `/${locale}/blog/${p.slug}`,
        keywords: [p.category, ...(p.tags ?? [])].join(' '),
      });
    }
  }

  for (const p of STATIC_PAGES[locale]) {
    items.push({
      id: `page-${p.href}`,
      category: 'page',
      title: p.title,
      description: p.description,
      href: p.href,
      keywords: p.keywords,
    });
  }

  return NextResponse.json({ items });
}
