import Link from 'next/link';

interface BlogCtaProps {
  href: string;
  text: string;
  description?: string;
}

export function BlogCta({ href, text, description }: BlogCtaProps) {
  return (
    <aside className="not-prose my-10 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 to-gold/10 p-6 sm:p-8 text-center">
      {description && (
        <p className="text-lg font-display text-ink mb-4">{description}</p>
      )}
      <Link href={href} className="btn btn-primary inline-flex">
        {text}
      </Link>
      <p className="text-xs text-text-muted mt-3">
        Devis gratuit &middot; Sans engagement &middot; Réponse sous 24h
      </p>
    </aside>
  );
}
