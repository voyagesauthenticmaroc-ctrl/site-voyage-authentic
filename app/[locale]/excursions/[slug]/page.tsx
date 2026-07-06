import { redirect } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export default async function ExcursionSlugRedirect({ params }: Props) {
  const { locale, slug } = await params;
  redirect({ href: { pathname: '/circuits/[slug]', params: { slug } }, locale });
}
