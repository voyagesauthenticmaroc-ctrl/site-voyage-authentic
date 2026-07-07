'use client';

import { Heart } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useWishlist } from '@/lib/wishlist';

/** Icône coeur avec compteur pour la navbar, lien vers /wishlist. */
export function WishlistNavItem({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const { count, mounted } = useWishlist();

  return (
    <a
      href={`/${locale}/wishlist`}
      aria-label={`Mes favoris${mounted && count ? ` (${count})` : ''}`}
      className={`relative flex items-center text-white/70 hover:text-white transition-colors ${className}`}
    >
      <Heart size={17} strokeWidth={2} />
      {mounted && count > 0 && (
        <span
          className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] rounded-full text-[0.6rem] font-bold flex items-center justify-center px-1"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          {count}
        </span>
      )}
    </a>
  );
}
