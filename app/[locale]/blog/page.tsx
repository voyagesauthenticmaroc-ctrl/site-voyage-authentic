import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { BlogGrid } from '@/components/BlogGrid';
import { generateMetadata as _gen } from '@/lib/seo';
import { schemaTravelAgency, schemaBreadcrumb, schemaWebPage } from '@/lib/schema';
import { getAllPosts } from '@/lib/blog';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.blog' });
  return _gen({
    title: t('title'),
    description: t('description'),
    path: '/blog',
    locale,
  });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = getAllPosts();

  return (
    <>
      <JsonLd data={schemaTravelAgency()} />
      <JsonLd
        data={schemaWebPage({
          name: 'Blog — Voyages au Maroc',
          description:
            'Conseils pratiques, récits et guides par destination pour préparer votre séjour au Maroc.',
          path: '/blog',
        })}
      />
      <JsonLd data={schemaBreadcrumb([{ name: 'Blog', path: '/blog' }])} />

      <main id="main-content">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section aria-labelledby="blog-title" className="pt-16 pb-16 bg-parchment-gradient">
          <div className="container-luxury">
            <nav aria-label="Fil d'Ariane" className="mb-8">
              <ol className="flex gap-2 text-caption list-none p-0">
                <li><Link href="/" className="hover:text-gold transition-colors">Accueil</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-gold">Blog</li>
              </ol>
            </nav>
            <span className="text-eyebrow">Le blog</span>
            <h1 id="blog-title" className="text-display-xl mt-3 text-balance">
              Conseils et récits de voyages au Maroc
            </h1>
            <p className="text-text-muted mt-4 max-w-2xl text-lg">
              Conseils pratiques, récits de voyages et guides par destination pour préparer votre séjour au Maroc avec Voyages Authentiques Maroc.
            </p>
          </div>
        </section>

        {/* ── Articles avec filtres ─────────────────────────────── */}
        <section aria-labelledby="articles-title" className="section-y">
          <div className="container-luxury">
            <h2 id="articles-title" className="sr-only">
              Articles du blog
            </h2>
            <BlogGrid posts={posts} />
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section aria-labelledby="cta-blog" className="section-y bg-luxury-gradient">
          <div className="container-narrow text-center">
            <h2 id="cta-blog" className="text-display-md text-white">
              Prêt à vivre votre aventure marocaine ?
            </h2>
            <p className="text-gold-muted mt-4">
              Nous organisons votre voyage sur mesure au Maroc — de Marrakech au désert du Sahara.
            </p>
            <div className="flex gap-4 justify-center flex-wrap mt-8">
              <Link href="/contact" className="btn btn-primary">
                Demander un devis
              </Link>
              <Link href="/circuits" className="btn btn-outline-white">
                Voir les circuits
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
