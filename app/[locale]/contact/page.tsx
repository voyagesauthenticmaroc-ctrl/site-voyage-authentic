import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { ContactFormFull } from '@/components/ContactFormFull';
import { generateMetadata as _gen } from '@/lib/seo';
import { schemaTravelAgency, schemaBreadcrumb, schemaWebPage, schemaContactPoint } from '@/lib/schema';
import { getSite } from '@/lib/content';
import { isPlaceholder } from '@/lib/placeholders';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.contact' });
  return _gen({
    title: t('title'),
    description: t('description'),
    path: '/contact',
    locale,
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [site, t, tCommon, tAgency, tMeta, tForm] = await Promise.all([
    getSite(),
    getTranslations({ locale, namespace: 'contactPage' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'agency' }),
    getTranslations({ locale, namespace: 'meta.contact' }),
    getTranslations({ locale, namespace: 'quoteForm' }),
  ]);

  const whatsappGreeting = encodeURIComponent(tForm('whatsappFollowUp'));

  return (
    <>
      <JsonLd data={schemaTravelAgency()} />
      <JsonLd data={schemaContactPoint()} />
      <JsonLd
        data={schemaWebPage({
          name: tMeta('title'),
          description: tMeta('description'),
          path: '/contact',
          locale,
        })}
      />
      <JsonLd data={schemaBreadcrumb([{ name: t('breadcrumb'), path: '/contact' }])} />

      <main id="main-content">
        {/* ── En-tête ────────────────────────────────────────────── */}
        <section className="pt-16 pb-16 bg-parchment-gradient">
          <div className="container-luxury">
            <nav aria-label={tCommon('breadcrumbLabel')} className="mb-8">
              <ol className="flex gap-2 text-caption list-none p-0">
                <li><Link href="/" className="hover:text-gold transition-colors">{tCommon('home')}</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-gold">{t('breadcrumb')}</li>
              </ol>
            </nav>
            <span className="text-eyebrow">{t('eyebrow')}</span>
            <h1 className="text-display-xl mt-3 text-balance">
              {t('title')}
            </h1>
            <p className="text-text-muted mt-4 max-w-2xl text-lg">
              {t('heroText')}
            </p>

            <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-sm font-medium text-gold-accessible">
              <Clock size={14} />
              {t('badge24h')}
            </div>
          </div>
        </section>

        {/* ── Formulaire + Coordonnées ───────────────────────────── */}
        <section aria-labelledby="contact-section" className="section-y">
          <div className="container-luxury">
            <div className="grid lg:grid-cols-[1fr_400px] gap-16">
              <div>
                <h2 id="contact-section" className="text-display-md mb-8">
                  {t('formTitle')}
                </h2>
                <ContactFormFull whatsapp={site.contact.whatsapp} />
              </div>

              <aside aria-labelledby="coordonnees-title" className="space-y-6">
                <h2 id="coordonnees-title" className="text-display-md">
                  {t('directContact')}
                </h2>

                {!isPlaceholder(site.contact.phone) && (
                  <div className="surface p-6 border-gold-accent">
                    <p className="text-eyebrow mb-3">{t('phoneWhatsApp')}</p>
                    <a
                      href={`tel:${site.contact.phoneRaw}`}
                      className="font-display text-3xl hover:text-gold transition-colors flex items-center gap-3"
                    >
                      <Phone size={24} className="text-gold shrink-0" />
                      {site.contact.phone}
                    </a>
                    <p className="text-caption mt-2">{t('available')}</p>
                  </div>
                )}

                <a
                  href={`https://wa.me/${site.contact.whatsapp}?text=${whatsappGreeting}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary w-full gap-3 text-base py-4"
                >
                  <MessageCircle size={20} />
                  {t('writeWhatsApp')}
                </a>

                {!isPlaceholder(site.contact.email) && (
                  <div className="surface p-5">
                    <p className="text-eyebrow mb-2">{t('email')}</p>
                    <a
                      href={`mailto:${site.contact.email}`}
                      className="flex items-center gap-2 hover:text-gold transition-colors"
                    >
                      <Mail size={16} className="text-gold shrink-0" />
                      {site.contact.email}
                    </a>
                    <p className="text-caption mt-1">{t('emailNote')}</p>
                  </div>
                )}

                <div className="surface p-5">
                  <p className="text-eyebrow mb-2">{t('address')}</p>
                  <address className="not-italic flex items-start gap-2 text-text-muted">
                    <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                    <span>{site.contact.address}</span>
                  </address>
                </div>

                <div className="surface p-5">
                  <p className="text-eyebrow mb-3">{t('hoursTitle')}</p>
                  <ul className="space-y-1 text-sm list-none p-0">
                    <li className="flex justify-between">
                      <span>{t('monFri')}</span>
                      <span className="font-medium">{t('hours')}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t('satSun')}</span>
                      <span className="font-medium">{t('hours')}</span>
                    </li>
                  </ul>
                  <p className="text-caption mt-2">{t('localTime')}</p>
                </div>

                <div className="surface p-5">
                  <p className="text-eyebrow mb-3">{t('languagesTitle')}</p>
                  <ul className="flex gap-2 flex-wrap list-none p-0">
                    {site.languages.map((lang) => (
                      <li key={lang} className="badge badge-gold">
                        {lang}
                      </li>
                    ))}
                  </ul>
                </div>

                {site.social.facebookUrl && (
                  <a
                    href={site.social.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-gold transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-gold"
                      aria-hidden="true"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    {site.social.facebookPageName}
                  </a>
                )}

                <div className="rounded-xl overflow-hidden border border-border aspect-video bg-parchment">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(site.contact.address)}&output=embed`}
                    title={t('mapTitle')}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>

                <div className="surface p-6 border-gold-accent">
                  <h3 className="font-display text-lg">{t('pricingTitle')}</h3>
                  <p className="text-text-muted mt-3 text-sm leading-relaxed">
                    {tAgency('pricingNote')}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
