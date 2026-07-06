import type { MetadataRoute } from 'next';
import { SITE_URL, localizePath, hreflangAlternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';
import { getExcursions, getDestinations } from '@/lib/content';
import { getAllPosts } from '@/lib/blog';

/**
 * Sitemap multilingue : chaque URL est déclinée dans toutes les langues,
 * avec les alternates hreflang (xhtml:link) générés par Next.
 */
const STATIC_PATHS = [
  '/',
  '/circuits',
  '/destinations',
  '/a-propos',
  '/avis',
  '/faq',
  '/blog',
  '/contact',
  '/mentions-legales',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [excursions, destinations] = await Promise.all([getExcursions(), getDestinations()]);
  const posts = getAllPosts();

  const frPaths = [
    ...STATIC_PATHS,
    ...excursions.map((e) => `/circuits/${e.slug}`),
    ...destinations.map((d) => `/destinations/${d.slug}`),
    ...posts.map((p) => `/blog/${p.slug}`),
  ];

  const entries: MetadataRoute.Sitemap = [];
  for (const frPath of frPaths) {
    const languages = hreflangAlternates(frPath);
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}${localizePath(frPath, locale)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: frPath === '/' ? 1 : 0.8,
        alternates: { languages },
      });
    }
  }
  return entries;
}
