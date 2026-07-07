'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Heart, ArrowRight, CheckCircle, XCircle, MessageCircle, Sparkles, MapPin } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist';
import type { SearchItem } from '@/app/[locale]/search-index.json/route';

const T: Record<string, Record<string, string>> = {
  fr: {
    title: 'Mes circuits favoris',
    subtitle: 'Comparez vos circuits côte à côte, choisissez celui qui vous correspond, et demandez votre devis en un clic.',
    empty: 'Aucun favori pour le moment',
    emptySub: 'Ajoutez des circuits à vos favoris en cliquant sur le ♥ pour les retrouver ici et les comparer.',
    exploreCta: 'Explorer nos circuits',
    clearAll: 'Tout vider',
    category: 'Catégorie',
    duration: 'Durée',
    price: 'Prix',
    itinerary: 'Itinéraire',
    included: 'Inclus',
    excluded: 'Non inclus',
    seeCircuit: 'Voir ce circuit',
    quote: 'Demander un devis',
    remove: 'Retirer',
  },
  en: {
    title: 'My favourite tours',
    subtitle: 'Compare your tours side by side, pick the one that fits, and request a quote in one click.',
    empty: 'No favourites yet',
    emptySub: 'Add tours to your favourites by clicking the ♥ to find them here and compare.',
    exploreCta: 'Explore our tours',
    clearAll: 'Clear all',
    category: 'Category',
    duration: 'Duration',
    price: 'Price',
    itinerary: 'Itinerary',
    included: 'Included',
    excluded: 'Not included',
    seeCircuit: 'See this tour',
    quote: 'Request a quote',
    remove: 'Remove',
  },
  es: {
    title: 'Mis circuitos favoritos',
    subtitle: 'Compara tus circuitos uno al lado del otro, elige el que te convenga y pide presupuesto con un clic.',
    empty: 'Aún no hay favoritos',
    emptySub: 'Añade circuitos a tus favoritos pulsando el ♥ para encontrarlos aquí y compararlos.',
    exploreCta: 'Explorar nuestros circuitos',
    clearAll: 'Vaciar todo',
    category: 'Categoría',
    duration: 'Duración',
    price: 'Precio',
    itinerary: 'Itinerario',
    included: 'Incluido',
    excluded: 'No incluido',
    seeCircuit: 'Ver este circuito',
    quote: 'Pedir presupuesto',
    remove: 'Quitar',
  },
};

export function WishlistClient({ locale }: { locale: string }) {
  const t = T[locale] ?? T.fr;
  const { slugs, toggle, clear, mounted } = useWishlist();
  const [circuits, setCircuits] = useState<SearchItem[] | null>(null);

  useEffect(() => {
    fetch(`/${locale}/search-index.json`)
      .then((r) => r.json())
      .then((d: { items: SearchItem[] }) => {
        setCircuits(d.items.filter((i) => i.category === 'circuit'));
      })
      .catch(() => setCircuits([]));
  }, [locale]);

  const selected = (circuits ?? []).filter((c) => c.slug && slugs.includes(c.slug));
  const isReady = mounted && circuits !== null;

  return (
    <main id="main-content" className="pt-28 pb-20 min-h-screen" style={{ background: 'var(--parchment)' }}>
      <div className="container-luxury">
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <p className="text-eyebrow-accent flex items-center gap-2">
              <Heart size={13} fill="currentColor" /> Wishlist
            </p>
            <h1 className="text-display-md mt-3">{t.title}</h1>
            <p className="text-text-muted mt-3 max-w-xl">{t.subtitle}</p>
          </div>
          {isReady && selected.length > 0 && (
            <button
              onClick={clear}
              className="text-xs font-semibold uppercase tracking-wide px-4 py-2 rounded-full transition-colors hover:bg-black/5"
              style={{ color: 'var(--warm-gray)', border: '1px solid var(--cream-deep)' }}
            >
              {t.clearAll}
            </button>
          )}
        </div>

        {isReady && selected.length === 0 && (
          <div className="text-center py-16 rounded-3xl" style={{ background: '#fff', border: '1px solid var(--cream-deep)' }}>
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center" style={{ background: 'var(--accent-pale)' }}>
              <Heart size={32} style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="font-display text-2xl mt-6" style={{ color: 'var(--ink)' }}>{t.empty}</h2>
            <p className="mt-3 max-w-md mx-auto" style={{ color: 'var(--warm-gray)' }}>{t.emptySub}</p>
            <Link href="/circuits" className="btn btn-primary mt-8 inline-flex items-center gap-2">
              {t.exploreCta} <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {isReady && selected.length > 0 && (
          <div>
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: `repeat(auto-fit, minmax(260px, 1fr))` }}
            >
              {selected.map((c) => (
                <article
                  key={c.slug}
                  className="rounded-3xl overflow-hidden flex flex-col"
                  style={{ background: '#fff', border: '1px solid var(--cream-deep)', boxShadow: '0 8px 32px rgba(24,20,16,0.06)' }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden" style={{ background: 'var(--forest-deep)' }}>
                    {c.image && (
                      <Image
                        src={c.image}
                        alt={c.title}
                        fill
                        unoptimized
                        sizes="320px"
                        className="object-cover"
                      />
                    )}
                    <button
                      onClick={() => toggle(c.slug!)}
                      aria-label={t.remove}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110"
                      style={{ background: 'var(--accent)' }}
                    >
                      <Heart size={16} fill="#fff" style={{ color: '#fff' }} />
                    </button>
                    {c.circuitCategory && (
                      <span
                        className="absolute top-3 left-3 text-[0.6rem] font-bold uppercase tracking-widest text-white rounded-full px-3 py-1"
                        style={{ background: 'var(--accent)' }}
                      >
                        {c.circuitCategory}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display text-lg leading-snug" style={{ color: 'var(--ink)' }}>{c.title}</h3>

                    <dl className="mt-4 space-y-3 text-sm">
                      {c.duration && (
                        <div>
                          <dt className="text-[0.6rem] font-bold uppercase tracking-widest" style={{ color: 'var(--warm-gray)' }}>{t.duration}</dt>
                          <dd className="mt-0.5 font-semibold" style={{ color: 'var(--ink)' }}>{c.duration}</dd>
                        </div>
                      )}
                      {c.priceFrom && (
                        <div>
                          <dt className="text-[0.6rem] font-bold uppercase tracking-widest" style={{ color: 'var(--warm-gray)' }}>{t.price}</dt>
                          <dd className="mt-0.5 font-semibold" style={{ color: 'var(--accent-dark)' }}>{c.priceFrom}</dd>
                        </div>
                      )}
                      {c.itinerary && c.itinerary.length > 0 && (
                        <div>
                          <dt className="text-[0.6rem] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--warm-gray)' }}>
                            <MapPin size={11} /> {t.itinerary}
                          </dt>
                          <dd className="mt-1.5 text-xs space-y-1" style={{ color: 'var(--ink)' }}>
                            {c.itinerary.slice(0, 5).map((day, i) => (
                              <div key={i} className="flex gap-2">
                                <span className="font-semibold flex-shrink-0" style={{ color: 'var(--accent)' }}>{i + 1}.</span>
                                <span className="leading-snug">{day.replace(/^Jour \d+ [—-]\s*/, '')}</span>
                              </div>
                            ))}
                          </dd>
                        </div>
                      )}
                      {c.included && c.included.length > 0 && (
                        <div>
                          <dt className="text-[0.6rem] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: '#2E7D5B' }}>
                            <CheckCircle size={11} /> {t.included}
                          </dt>
                          <dd className="mt-1.5 text-xs space-y-1" style={{ color: 'var(--ink)' }}>
                            {c.included.slice(0, 4).map((it, i) => (
                              <div key={i} className="leading-snug">✓ {it}</div>
                            ))}
                          </dd>
                        </div>
                      )}
                      {c.excluded && c.excluded.length > 0 && (
                        <div>
                          <dt className="text-[0.6rem] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--warm-gray)' }}>
                            <XCircle size={11} /> {t.excluded}
                          </dt>
                          <dd className="mt-1.5 text-xs space-y-1" style={{ color: 'var(--warm-gray)' }}>
                            {c.excluded.slice(0, 3).map((it, i) => (
                              <div key={i} className="leading-snug">· {it}</div>
                            ))}
                          </dd>
                        </div>
                      )}
                    </dl>

                    <div className="mt-6 pt-5 flex flex-col gap-2" style={{ borderTop: '1px solid var(--cream-deep)' }}>
                      <a href={c.href} className="btn btn-primary text-[0.7rem] py-2.5 inline-flex items-center justify-center gap-2">
                        {t.seeCircuit} <ArrowRight size={12} />
                      </a>
                      <Link href="/contact" className="text-xs text-center py-2 font-semibold uppercase tracking-wide transition-colors hover:opacity-70" style={{ color: 'var(--forest-deep)' }}>
                        <MessageCircle size={12} className="inline-block mr-1" /> {t.quote}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {isReady && selected.length > 0 && (
          <div className="mt-14 text-center rounded-3xl p-8" style={{ background: 'var(--forest-deep)' }}>
            <Sparkles size={22} className="mx-auto" style={{ color: 'var(--accent-light)' }} />
            <p className="font-display text-2xl text-white mt-3">
              Vous hésitez entre plusieurs circuits ?
            </p>
            <p className="text-white/70 mt-2 max-w-md mx-auto text-sm">
              Envoyez-nous vos favoris — on vous répond sous 24h avec nos conseils pour choisir.
            </p>
            <Link href="/contact" className="btn btn-primary mt-6 inline-flex items-center gap-2">
              Demander conseil <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
