import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { generateMetadata as _gen } from '@/lib/seo';
import { schemaTravelAgency, schemaBreadcrumb, schemaFaqPage } from '@/lib/schema';
import { getFaqItems } from '@/lib/faq-data';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.faq' });
  return _gen({
    title: t('title'),
    description: t('description'),
    path: '/faq',
    locale,
  });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'faqPage' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  const FAQ_ITEMS = getFaqItems(locale);
  const ALL_FAQ_FLAT = FAQ_ITEMS.flatMap((cat) =>
    cat.questions.map((q) => ({ question: q.question, answer: q.answer })),
  );

  return (
    <>
      <JsonLd data={schemaTravelAgency()} />
      <JsonLd data={schemaFaqPage(ALL_FAQ_FLAT)} />
      <JsonLd data={schemaBreadcrumb([{ name: t('breadcrumb'), path: '/faq' }])} />

      <main id="main-content">
        {/* ── Hero ────────────────────────────────────────────── */}
        <section aria-labelledby="faq-title" className="pt-32 pb-16 bg-luxury-gradient">
          <div className="container-luxury">
            <nav aria-label={tCommon('breadcrumbLabel')} className="mb-8">
              <ol className="flex gap-2 text-caption list-none p-0">
                <li>
                  <Link href="/" className="text-white/65 hover:text-white transition-colors">
                    {tCommon('home')}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/35">›</li>
                <li aria-current="page" className="text-gold">{t('breadcrumb')}</li>
              </ol>
            </nav>
            <h1 id="faq-title" className="text-display-xl text-white text-balance">
              {t('title')}
            </h1>
            <p className="text-gold-muted mt-4 text-xl max-w-2xl">
              {t('heroText')}
            </p>
          </div>
        </section>

        {/* ── FAQ par catégorie ────────────────────────────────── */}
        <section aria-labelledby="faq-content" className="section-y">
          <div className="container-narrow">
            <h2 id="faq-content" className="sr-only">{t('title')}</h2>

            <div className="space-y-16">
              {FAQ_ITEMS.map((cat) => (
                <div key={cat.category}>
                  <h2 className="font-display text-2xl text-gold border-b border-parchment pb-4 mb-8">
                    {cat.category}
                  </h2>
                  <dl className="space-y-0">
                    {cat.questions.map((item, i) => (
                      <div
                        key={item.question}
                        className={`py-6 ${i > 0 ? 'border-t border-parchment' : ''}`}
                      >
                        <dt className="font-display text-xl font-medium text-ink">
                          {item.question}
                        </dt>
                        <dd className="mt-3 text-pretty text-text-muted leading-relaxed">
                          {item.answer}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section aria-labelledby="cta-faq" className="section-y bg-luxury-gradient">
          <div className="container-narrow text-center">
            <h2 id="cta-faq" className="text-display-md text-white">
              {t('ctaTitle')}
            </h2>
            <p className="text-gold-muted mt-4 max-w-xl mx-auto">
              {t('ctaText')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/contact" className="btn btn-primary inline-flex items-center gap-2">
                {t('ctaContact')} <ArrowRight size={16} />
              </Link>
              <Link href="/circuits" className="btn btn-outline-white inline-flex">
                {t('ctaTours')}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
