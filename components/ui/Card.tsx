"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "./Badge";

interface CardProps {
  href?: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
  aspectRatio?: "card" | "portrait" | "hero";
}

const aspectClass = {
  card:     "aspect-card",
  portrait: "aspect-portrait",
  hero:     "aspect-hero",
};

export function Card({
  href,
  image,
  imageAlt = "",
  badge,
  eyebrow,
  title,
  description,
  footer,
  className = "",
  aspectRatio = "card",
}: CardProps) {
  const cardContent = (
    <article className={`card-luxury group cursor-pointer ${className}`}>
      {image && (
        <div className={`relative ${aspectClass[aspectRatio]} overflow-hidden`}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {badge && (
            <div className="absolute top-4 left-4">
              <Badge variant="white">{badge}</Badge>
            </div>
          )}
        </div>
      )}

      <div className="p-6 flex flex-col gap-3">
        {eyebrow && <span className="text-eyebrow">{eyebrow}</span>}
        <h3 className="text-xl font-[400] leading-tight text-[var(--ink)] group-hover:text-[var(--gold)] transition-colors duration-300">
          {title}
        </h3>
        {description && (
          <p className="text-caption text-[var(--warm-gray)] leading-relaxed line-clamp-3">
            {description}
          </p>
        )}
        {footer && (
          <div className="pt-3 mt-auto border-t border-[var(--border)]">
            {footer}
          </div>
        )}
      </div>

      <div className="h-0.5 w-0 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] group-hover:w-full transition-all duration-500 ease-out" />
    </article>
  );

  if (href) {
    return <Link href={href} className="block">{cardContent}</Link>;
  }

  return cardContent;
}
