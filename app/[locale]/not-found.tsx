import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Compass } from 'lucide-react';

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'notFound' });

  return (
    <main id="main-content" className="min-h-screen bg-luxury-gradient flex items-center">
      <div className="container-narrow text-center py-32">
        <Compass size={56} className="text-gold mx-auto mb-6 opacity-80" strokeWidth={1.5} />

        <p className="text-gold text-sm font-body tracking-[0.2em] uppercase mb-4">{t('code')}</p>

        <h1 className="font-display text-5xl md:text-6xl text-white font-light text-balance">
          {t('title')}
        </h1>

        <p className="text-white/60 mt-6 text-lg max-w-md mx-auto text-pretty">
          {t('text')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link href="/circuits" className="btn btn-primary inline-flex items-center gap-2">
            {t('ctaTours')} <ArrowRight size={16} />
          </Link>
          <Link href="/" className="btn btn-outline-white inline-flex">
            {t('ctaHome')}
          </Link>
        </div>
      </div>
    </main>
  );
}
