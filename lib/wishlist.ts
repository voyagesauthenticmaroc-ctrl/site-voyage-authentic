'use client';

import { useEffect, useState, useCallback } from 'react';

const KEY = 'vam-wishlist';
const EVENT = 'wishlist-change';

function read(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(slugs: string[]) {
  localStorage.setItem(KEY, JSON.stringify(slugs));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: slugs }));
}

/** Hook réactif à la wishlist stockée en localStorage.
    Sync entre onglets via `storage` et entre composants via événement custom. */
export function useWishlist() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSlugs(read());
    setMounted(true);
    const onChange = () => setSlugs(read());
    window.addEventListener(EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const current = read();
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    write(next);
  }, []);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const clear = useCallback(() => write([]), []);

  return { slugs, toggle, has, clear, count: slugs.length, mounted };
}
