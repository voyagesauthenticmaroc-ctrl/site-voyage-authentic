import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { DestinationTemplate } from '@/components/DestinationTemplate';
import { generateMetadata as _gen } from '@/lib/seo';
import { getDestination, getDestinations, getExcursions, getSite } from '@/lib/content';

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const destinations = await getDestinations(locale);
    for (const d of destinations) {
      params.push({ locale, slug: d.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const dest = await getDestination(slug, locale);
    return _gen({
      title: dest.seo.title,
      description: dest.seo.description,
      path: `/destinations/${dest.baseSlug}`,
      locale,
    });
  } catch {
    return {};
  }
}

export default async function DestinationPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let dest;
  try {
    dest = await getDestination(slug, locale);
  } catch {
    notFound();
  }

  const [allDestinations, excursions, site] = await Promise.all([
    getDestinations(locale),
    getExcursions(locale),
    getSite(),
  ]);

  const relatedExcursions = excursions.filter((e) => dest.relatedExcursions?.includes(e.baseSlug));
  const otherDestinations = allDestinations.filter((d) => d.baseSlug !== dest.baseSlug).slice(0, 4);

  return (
    <DestinationTemplate
      dest={dest}
      relatedExcursions={relatedExcursions}
      otherDestinations={otherDestinations}
      path={`/destinations/${dest.slug}`}
      whatsapp={site.contact.whatsapp}
      locale={locale}
    />
  );
}
