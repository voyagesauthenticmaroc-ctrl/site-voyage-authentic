import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { generateMetadata as _gen } from '@/lib/seo';
import Link from 'next/link';
import { getSite } from '@/lib/content';
import { isPlaceholder } from '@/lib/placeholders';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.legalNotice' });
  return _gen({
    title: t('title'),
    description: t('description'),
    path: '/mentions-legales',
    locale,
  });
}

export default async function MentionsLegalesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getSite();
  return (
    <main id="main-content" className="pt-24 pb-20">
      <div className="container-narrow">
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex gap-2 text-caption list-none p-0">
            <li><Link href="/" className="hover:text-gold transition-colors">Accueil</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-gold">Mentions légales</li>
          </ol>
        </nav>

        <h1 className="text-display-md mb-2">Mentions légales</h1>
        <p className="text-text-muted text-sm mb-10">Dernière mise à jour : juillet 2026</p>

        <div className="prose-luxury space-y-10">

          <section>
            <h2 className="font-display text-2xl mb-4">Éditeur du site</h2>
            <div className="surface p-6 rounded-xl space-y-2 text-text-muted">
              <p><strong className="text-ink">Nom :</strong> {site.name}</p>
              <p><strong className="text-ink">Activité :</strong> Opérateur de voyages et circuits touristiques privés au Maroc</p>
              <p><strong className="text-ink">Adresse :</strong> {site.contact.address}</p>
              {!isPlaceholder(site.contact.phone) && (
                <p><strong className="text-ink">Téléphone :</strong>{' '}
                  <a href={`tel:${site.contact.phoneRaw}`} className="text-gold hover:underline">{site.contact.phone}</a>
                </p>
              )}
              {!isPlaceholder(site.contact.email) && (
                <p><strong className="text-ink">E-mail :</strong>{' '}
                  <a href={`mailto:${site.contact.email}`} className="text-gold hover:underline">
                    {site.contact.email}
                  </a>
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Hébergement</h2>
            <div className="surface p-6 rounded-xl space-y-2 text-text-muted">
              <p><strong className="text-ink">Hébergeur :</strong> Vercel Inc.</p>
              <p><strong className="text-ink">Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
              <p><strong className="text-ink">Site :</strong>{' '}
                <span className="text-gold">vercel.com</span>
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Propriété intellectuelle</h2>
            <p className="text-text-muted leading-relaxed">
              L&apos;ensemble du contenu de ce site (textes, photos, descriptions, structure) est la propriété exclusive de {site.name}. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.
            </p>
            <p className="text-text-muted leading-relaxed mt-3">
              Les photographies illustrant les destinations sont la propriété de l&apos;agence ou proviennent
              de la banque d&apos;images Unsplash, utilisées conformément à la licence Unsplash.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Données personnelles</h2>
            <p className="text-text-muted leading-relaxed">
              Ce site collecte uniquement les données que vous soumettez volontairement via le formulaire de contact (nom, e-mail, message). Ces données sont utilisées exclusivement pour répondre à votre demande et ne sont jamais transmises à des tiers.
            </p>
            <p className="text-text-muted leading-relaxed mt-3">
              Conformément aux dispositions applicables, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour exercer ce droit,{' '}
              {isPlaceholder(site.contact.email) ? (
                <Link href="/contact" className="text-gold hover:underline">contactez-nous via le formulaire</Link>
              ) : (
                <a href={`mailto:${site.contact.email}`} className="text-gold hover:underline">
                  {site.contact.email}
                </a>
              )}.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Cookies</h2>
            <p className="text-text-muted leading-relaxed">
              Ce site n&apos;utilise pas de cookies de traçage ou publicitaires. Des cookies techniques strictement nécessaires au fonctionnement du site (navigation, formulaire) peuvent être déposés.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Responsabilité</h2>
            <p className="text-text-muted leading-relaxed">
              Les informations présentes sur ce site sont fournies à titre indicatif. {site.name} s&apos;efforce de maintenir ces informations à jour mais ne peut garantir leur exhaustivité ou leur exactitude à tout moment. Les tarifs, disponibilités et programmes des circuits peuvent varier — nous vous invitons à nous contacter directement pour confirmation.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Droit applicable</h2>
            <p className="text-text-muted leading-relaxed">
              Ce site est édité depuis le Maroc. En cas de litige, et à défaut de résolution amiable, le droit marocain s&apos;applique.
            </p>
          </section>

          <div className="pt-4 border-t border-gold/20">
            <Link href="/" className="btn btn-outline inline-flex items-center gap-2">
              ← Retour à l&apos;accueil
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
