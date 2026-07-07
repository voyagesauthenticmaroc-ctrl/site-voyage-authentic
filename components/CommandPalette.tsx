'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { Search, Compass, MapPin, FileText, Sparkles, ArrowRight, X, Command } from 'lucide-react';
import type { SearchItem } from '@/app/[locale]/search-index.json/route';

const CATEGORY_META: Record<SearchItem['category'], { icon: typeof Compass; label: { fr: string; en: string; es: string }; color: string }> = {
  circuit:     { icon: Compass,  label: { fr: 'Circuit',     en: 'Tour',        es: 'Circuito' },   color: 'var(--accent)' },
  destination: { icon: MapPin,   label: { fr: 'Destination', en: 'Destination', es: 'Destino' },    color: '#1E4B8F' },
  article:     { icon: FileText, label: { fr: 'Article',     en: 'Article',     es: 'Artículo' },   color: '#2E7D5B' },
  page:        { icon: Sparkles, label: { fr: 'Page',        en: 'Page',        es: 'Página' },     color: '#6B3F99' },
};

const PLACEHOLDER: Record<string, string> = {
  fr: 'Rechercher un circuit, une destination, un article…',
  en: 'Search for a tour, destination, article…',
  es: 'Buscar un circuito, destino, artículo…',
};

const EMPTY: Record<string, string> = {
  fr: 'Aucun résultat. Essayez « Sahara », « Chefchaouen » ou « 3 jours ».',
  en: 'No results. Try "Sahara", "Chefchaouen" or "3 days".',
  es: 'Sin resultados. Prueba «Sahara», «Chefchaouen» o «3 días».',
};

const HINT: Record<string, string> = {
  fr: 'Astuce : appuyez sur ⌘K partout pour ouvrir la recherche',
  en: 'Tip: press ⌘K anywhere to open search',
  es: 'Consejo: pulsa ⌘K en cualquier lugar para abrir la búsqueda',
};

export function CommandPalette() {
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* Raccourci clavier ⌘K / Ctrl+K et Esc pour fermer */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /* Écoute l'événement global déclenché par le bouton loupe de la navbar */
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('open-command-palette', onOpen);
    return () => window.removeEventListener('open-command-palette', onOpen);
  }, []);

  /* Chargement paresseux de l'index à la 1ère ouverture */
  useEffect(() => {
    if (!open || items) return;
    fetch(`/${locale}/search-index.json`)
      .then((r) => r.json())
      .then((d) => setItems(d.items))
      .catch(() => setItems([]));
  }, [open, items, locale]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setActiveIdx(0);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const fuse = useMemo(() => {
    if (!items) return null;
    return new Fuse(items, {
      keys: [
        { name: 'title', weight: 0.55 },
        { name: 'description', weight: 0.25 },
        { name: 'keywords', weight: 0.2 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [items]);

  const results: SearchItem[] = useMemo(() => {
    if (!items) return [];
    if (!query.trim()) {
      // Vue par défaut : quelques suggestions phares
      const featured = ['circuit', 'destination'] as const;
      return items.filter((i) => featured.includes(i.category as never)).slice(0, 8);
    }
    return fuse!.search(query, { limit: 12 }).map((r) => r.item);
  }, [items, query, fuse]);

  useEffect(() => setActiveIdx(0), [query]);

  const go = useCallback(
    (item: SearchItem) => {
      setOpen(false);
      router.push(item.href);
    },
    [router],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIdx]) {
      e.preventDefault();
      go(results[activeIdx]);
    }
  };

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Recherche"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="absolute inset-0 backdrop-blur-md" style={{ background: 'rgba(24,20,16,0.72)' }} />
      <div
        className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        style={{ background: 'var(--parchment)', border: '1px solid rgba(196,163,90,0.35)' }}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--cream-deep)' }}>
          <Search size={19} style={{ color: 'var(--warm-gray)' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={PLACEHOLDER[locale] ?? PLACEHOLDER.fr}
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: 'var(--ink)' }}
            aria-label="Champ de recherche"
          />
          <button
            onClick={() => setOpen(false)}
            aria-label="Fermer la recherche"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-colors hover:opacity-70"
            style={{ background: 'var(--cream-deep)', color: 'var(--warm-gray)' }}
          >
            <X size={14} />
            <span className="text-[0.65rem] font-semibold">ESC</span>
          </button>
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
          {items === null && (
            <div className="px-5 py-8 text-center text-sm" style={{ color: 'var(--warm-gray)' }}>…</div>
          )}
          {items !== null && results.length === 0 && (
            <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--warm-gray)' }}>
              {EMPTY[locale] ?? EMPTY.fr}
            </div>
          )}
          {results.map((item, idx) => {
            const meta = CATEGORY_META[item.category];
            const Icon = meta.icon;
            const active = idx === activeIdx;
            return (
              <button
                key={item.id}
                data-idx={idx}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => go(item)}
                className="w-full flex items-center gap-4 px-5 py-3 text-left transition-colors"
                style={{ background: active ? 'var(--cream-deep)' : 'transparent' }}
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${meta.color}18`, color: meta.color }}
                >
                  <Icon size={17} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-semibold truncate" style={{ color: 'var(--ink)' }}>{item.title}</p>
                    <span className="text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: `${meta.color}18`, color: meta.color }}>
                      {meta.label[locale as 'fr' | 'en' | 'es'] ?? meta.label.fr}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--warm-gray)' }}>{item.description}</p>
                  )}
                </div>
                <ArrowRight size={14} style={{ color: active ? 'var(--accent)' : 'var(--warm-gray)', opacity: active ? 1 : 0.4 }} />
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-5 py-2.5 border-t text-[0.65rem]" style={{ borderColor: 'var(--cream-deep)', background: 'rgba(255,255,255,0.4)', color: 'var(--warm-gray)' }}>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">↑↓ naviguer</span>
            <span>↵ ouvrir</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Command size={11} />
            <span>{HINT[locale] ?? HINT.fr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Bouton loupe qui déclenche l'ouverture du palette via événement global. */
export function CommandPaletteButton({ className = '' }: { className?: string }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
      className={`flex items-center text-white/70 hover:text-white transition-colors ${className}`}
      aria-label="Ouvrir la recherche"
      title="Rechercher (⌘K)"
    >
      <Search size={17} />
    </button>
  );
}
