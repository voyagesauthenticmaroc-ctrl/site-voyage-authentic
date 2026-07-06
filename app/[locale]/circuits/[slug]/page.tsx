import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { ExcursionTemplate } from '@/components/ExcursionTemplate';
import { generateMetadata as _gen } from '@/lib/seo';
import { getExcursion, getExcursions, getDestinations, getReviews, getSite } from '@/lib/content';

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const excursions = await getExcursions(locale);
    for (const e of excursions) {
      params.push({ locale, slug: e.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const exc = await getExcursion(slug, locale);
    return _gen({
      title: exc.seo.title,
      description: exc.seo.description,
      // Canonical/hreflang construits à partir du slug FRANÇAIS (clé stable)
      path: `/circuits/${exc.baseSlug}`,
      locale,
    });
  } catch {
    return {};
  }
}

export default async function CircuitPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let exc;
  try {
    exc = await getExcursion(slug, locale);
  } catch {
    notFound();
  }

  const [allDestinations, reviews, site] = await Promise.all([
    getDestinations(locale),
    getReviews(),
    getSite(),
  ]);

  const relatedDestinations = allDestinations.filter((d) =>
    exc.relatedDestinations?.includes(d.baseSlug)
  );

  return (
    <ExcursionTemplate
      exc={exc}
      relatedDestinations={relatedDestinations}
      reviews={reviews}
      path={`/circuits/${exc.slug}`}
      whatsapp={site.contact.whatsapp}
      locale={locale}
    />
  );
}
