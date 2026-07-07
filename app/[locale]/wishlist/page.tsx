import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { WishlistClient } from './WishlistClient';

export const metadata: Metadata = {
  title: 'Mes favoris — comparer les circuits',
  description: 'Comparez côte à côte vos circuits favoris : prix, durée, itinéraire, ce qui est inclus ou non.',
  robots: { index: false, follow: false },
};

export default async function WishlistPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WishlistClient locale={locale} />;
}
