import { redirect } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function ExcursionsRedirect({ params }: Props) {
  const { locale } = await params;
  redirect({ href: '/circuits', locale });
}
