'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/** Scroll inertiel fluide (Lenis) — désactivé si prefers-reduced-motion.
    Le tactile reste natif (syncTouch: false par défaut) : zéro impact mobile. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
