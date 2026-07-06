'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import type { BlogPost } from '@/lib/blog';
import { BLOG_CATEGORIES } from '@/lib/blog-config';
import type { BlogCategory } from '@/lib/blog-config';

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  const [category, setCategory] = useState<BlogCategory>('Tous');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = category === 'Tous' || p.category === category;
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [posts, category, query]);

  return (
    <>
      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10">
        <nav aria-label="Catégories du blog" className="flex flex-wrap gap-2">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-gold text-white'
                  : 'bg-surface border border-border hover:border-gold hover:text-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="relative w-full sm:w-64">
          <label htmlFor="blog-search" className="sr-only">
            Rechercher un article
          </label>
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            className="w-full border border-border rounded-full pl-9 pr-9 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-gold"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Effacer la recherche"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Grille articles */}
      {posts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl text-ink">Articles bientôt disponibles</p>
          <p className="text-text-muted mt-3 max-w-sm mx-auto">
            Notre équipe prépare des guides et conseils pour votre voyage au Maroc.
          </p>
          <Link href="/circuits" className="btn btn-primary mt-8 inline-flex">
            Voir nos circuits
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-text-muted py-16 text-center">
          Aucun article ne correspond à votre recherche.
        </p>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
          {filtered.map((post) => (
            <li key={post.slug}>
              <article className="card-luxury h-full flex flex-col">
                <Link href={`/blog/${post.slug}`} className="flex flex-col h-full p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="badge badge-gold">{post.category}</span>
                    <time className="text-caption" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <h3 className="font-display text-xl leading-snug flex-1">{post.title}</h3>
                  <p className="text-caption mt-3 line-clamp-3">{post.description}</p>
                  <span className="text-gold font-medium text-sm mt-5 inline-block hover:text-gold-dark transition-colors">
                    Lire l&apos;article →
                  </span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-text-muted mt-6 text-right">
        {filtered.length} article{filtered.length > 1 ? 's' : ''}
        {category !== 'Tous' || query ? ` (filtrés sur ${posts.length})` : ''}
      </p>
    </>
  );
}
