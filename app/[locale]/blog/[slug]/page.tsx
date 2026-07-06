import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { JsonLd } from '@/components/JsonLd';
import { generateMetadata as _gen } from '@/lib/seo';
import { schemaArticle, schemaBreadcrumb, schemaTravelAgency } from '@/lib/schema';
import { getAllPosts, getPost, extractToc } from '@/lib/blog';
import { SITE_URL } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const mdxComponents = {
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 id={slugify(String(children))} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 id={slugify(String(children))} {...props}>
      {children}
    </h3>
  ),
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith('http');
    return (
      <a
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
};

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return _gen({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    locale,
    ogImage: post.image,
    ogType: 'article',
    publishedTime: post.date,
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPost(slug);
  if (!post) notFound();

  const toc = extractToc(post.content);
  const allPosts = getAllPosts();
  const related = post.related
    ? allPosts.filter((p) => post.related!.includes(p.slug))
    : allPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2);

  const publishedFormatted = new Date(post.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const shareUrl = `${SITE_URL}/blog/${slug}`;
  const shareText = encodeURIComponent(post.title);

  return (
    <>
      <JsonLd data={schemaTravelAgency()} />
      <JsonLd
        data={schemaArticle({
          title: post.title,
          description: post.description,
          path: `/blog/${slug}`,
    locale,
          image: post.image,
          publishedTime: post.date,
          author: post.author,
        })}
      />
      <JsonLd
        data={schemaBreadcrumb([
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${slug}` },
        ])}
      />

      <main id="main-content">
        <article aria-labelledby="article-title">
          {/* ── En-tête ──────────────────────────────────────── */}
          <header className="pt-16 pb-16 bg-parchment-gradient">
            <div className="container-narrow">
              <nav aria-label="Fil d'Ariane" className="mb-6">
                <ol className="flex gap-2 text-caption list-none p-0 flex-wrap">
                  <li><Link href="/" className="hover:text-gold transition-colors">Accueil</Link></li>
                  <li aria-hidden="true">›</li>
                  <li><Link href="/blog" className="hover:text-gold transition-colors">Blog</Link></li>
                  <li aria-hidden="true">›</li>
                  <li aria-current="page" className="text-gold truncate max-w-xs">{post.title}</li>
                </ol>
              </nav>
              <div className="flex items-center gap-3 mb-6">
                <span className="badge badge-gold">{post.category}</span>
                <time className="text-caption" dateTime={post.date}>
                  {publishedFormatted}
                </time>
              </div>
              <h1 id="article-title" className="text-display-xl text-balance">
                {post.title}
              </h1>
              <p className="text-text-muted mt-4 text-xl text-pretty">{post.description}</p>
              <div className="flex items-center gap-3 mt-6">
                <span className="text-caption">Par</span>
                <cite className="not-italic font-medium">{post.author}</cite>
                <span className="text-caption">— Voyages Authentiques Maroc</span>
              </div>
            </div>
          </header>

          {/* ── Corps de l'article ────────────────────────────── */}
          <div className="section-y">
            <div className="container-luxury">
              <div className="grid lg:grid-cols-[1fr_260px] gap-12 items-start">
                {/* Contenu */}
                <div className="prose prose-lg max-w-none prose-headings:font-display prose-h2:text-2xl prose-h3:text-xl prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground">
                  <MDXRemote source={post.content} components={mdxComponents} />
                </div>

                {/* Table des matières + partage */}
                <aside className="lg:sticky lg:top-8 space-y-6" aria-label="Navigation article">
                  {toc.length > 0 && (
                    <nav aria-labelledby="toc-title" className="surface p-5">
                      <h2 id="toc-title" className="text-sm font-semibold uppercase tracking-wide text-gold mb-4">
                        Sommaire
                      </h2>
                      <ol className="space-y-2 list-none p-0">
                        {toc.map((item) => (
                          <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
                            <a
                              href={`#${item.id}`}
                              className="text-sm text-text-muted hover:text-gold transition-colors leading-snug block"
                            >
                              {item.text}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  )}

                  {/* Partage social */}
                  <div className="surface p-5">
                    <p className="text-sm font-semibold uppercase tracking-wide text-gold mb-4">
                      Partager
                    </p>
                    <div className="flex flex-col gap-2">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline text-sm py-2"
                        aria-label="Partager sur Facebook"
                      >
                        Facebook
                      </a>
                      <a
                        href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline text-sm py-2"
                        aria-label="Partager sur WhatsApp"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={`mailto:?subject=${shareText}&body=${encodeURIComponent(shareUrl)}`}
                        className="btn btn-outline text-sm py-2"
                        aria-label="Partager par email"
                      >
                        Email
                      </a>
                    </div>
                  </div>

                  {/* CTA contextuel */}
                  {post.ctaHref && (
                    <div className="surface p-5 border-gold-accent">
                      <p className="text-sm font-semibold text-gold mb-3">Prêt à partir ?</p>
                      <Link href={post.ctaHref} className="btn btn-primary w-full text-sm">
                        {post.ctaText ?? 'Demander un devis'}
                      </Link>
                    </div>
                  )}
                </aside>
              </div>
            </div>
          </div>

          {/* ── Articles similaires ───────────────────────────── */}
          {related.length > 0 && (
            <section aria-labelledby="related-title" className="section-y bg-parchment-gradient">
              <div className="container-luxury">
                <h2 id="related-title" className="text-display-md mb-8">
                  Articles similaires
                </h2>
                <ul className="grid sm:grid-cols-2 gap-6 list-none p-0">
                  {related.map((rp) => (
                    <li key={rp.slug}>
                      <article className="card-luxury">
                        <Link href={`/blog/${rp.slug}`} className="block p-6">
                          <span className="badge badge-gold mb-3">{rp.category}</span>
                          <h3 className="font-display text-xl leading-snug mt-2">{rp.title}</h3>
                          <p className="text-caption mt-3 line-clamp-2">{rp.description}</p>
                          <span className="text-gold font-medium text-sm mt-4 inline-block">
                            Lire l&apos;article →
                          </span>
                        </Link>
                      </article>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* ── CTA final ─────────────────────────────────────── */}
          <footer className="section-y bg-luxury-gradient">
            <div className="container-narrow text-center">
              <h2 className="text-display-md text-white">Vous souhaitez visiter le Maroc ?</h2>
              <p className="text-gold-muted mt-4">
                Nous organisons votre voyage sur mesure au Maroc — transferts, hébergements, circuits et
                guide inclus.
              </p>
              <div className="flex gap-4 justify-center flex-wrap mt-8">
                <Link href="/contact" className="btn btn-primary">
                  Demander un devis gratuit
                </Link>
                <Link href="/blog" className="btn btn-outline-white">
                  Lire d&apos;autres articles
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </main>
    </>
  );
}
