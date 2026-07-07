'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist';

interface WishlistButtonProps {
  slug: string;
  label?: string;
  className?: string;
  variant?: 'overlay' | 'inline';
  /** Position par défaut si non surchargée via className. */
  position?: 'top-right' | 'top-left' | 'bottom-right';
}

const POSITIONS: Record<NonNullable<WishlistButtonProps['position']>, string> = {
  'top-right':    'top-3 right-3',
  'top-left':     'top-3 left-3',
  'bottom-right': 'bottom-3 right-3',
};

/** Bouton coeur qui ajoute/retire un circuit de la wishlist locale. */
export function WishlistButton({ slug, label, className = '', variant = 'overlay', position = 'top-right' }: WishlistButtonProps) {
  const { has, toggle, mounted } = useWishlist();
  const active = mounted && has(slug);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(slug);
  };

  if (variant === 'inline') {
    return (
      <button
        onClick={onClick}
        aria-label={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        aria-pressed={active}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-all ${className}`}
        style={{
          background: active ? 'var(--accent)' : 'transparent',
          color: active ? '#fff' : 'var(--ink)',
          border: `1.5px solid ${active ? 'var(--accent)' : 'var(--cream-deep)'}`,
        }}
      >
        <Heart size={14} fill={active ? '#fff' : 'transparent'} strokeWidth={2} />
        {label ?? (active ? 'Dans mes favoris' : 'Ajouter aux favoris')}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-pressed={active}
      className={`absolute ${POSITIONS[position]} z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 ${className}`}
      style={{
        background: active ? 'var(--accent)' : 'rgba(255,255,255,0.85)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <Heart
        size={17}
        fill={active ? '#fff' : 'transparent'}
        strokeWidth={2}
        style={{ color: active ? '#fff' : 'var(--ink)' }}
      />
    </button>
  );
}
