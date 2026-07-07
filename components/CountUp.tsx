'use client';

import { useEffect, useRef } from 'react';

/** Anime un nombre de 0 à sa valeur à l'entrée dans le viewport.
    Préserve préfixe/suffixe ("500+", "100%") ; les valeurs sans chiffre
    ("Garantie") sont affichées telles quelles. SSR-safe : la valeur finale
    est rendue côté serveur, seule l'animation mute le texte. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const m = value.match(/^([^\d]*)(\d+)([^\d]*)$/);
    const el = ref.current;
    if (!m || !el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const [, prefix, digits, suffix] = m;
    const target = parseInt(digits, 10);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = prefix + Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
