"use client";

import { useRef, useEffect, useState, type ReactNode, type ElementType } from "react";

type Spacing = "md" | "lg" | "xl";
type BgVariant = "transparent" | "cream" | "ivory" | "nil" | "gold";

const spacingClass: Record<Spacing, string> = {
  md: "section-y",
  lg: "section-y-lg",
  xl: "section-y-xl",
};

const bgClass: Record<BgVariant, string> = {
  transparent: "",
  cream:  "bg-[var(--cream)]",
  ivory:  "bg-[var(--ivory)]",
  nil:    "bg-luxury-gradient text-white",
  gold:   "bg-gold-gradient text-[var(--ink)]",
};

interface SectionProps {
  as?: ElementType;
  spacing?: Spacing;
  bg?: BgVariant;
  children: ReactNode;
  className?: string;
  animate?: boolean;
  id?: string;
}

export function Section({
  as: Tag = "section",
  spacing = "lg",
  bg = "transparent",
  children,
  className = "",
  animate = true,
  id,
}: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!animate || prefersReduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: '-80px 0px 0px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate, prefersReduced]);

  const classes = [spacingClass[spacing], bgClass[bg], className]
    .filter(Boolean)
    .join(" ");

  if (!animate || prefersReduced) {
    return (
      <Tag id={id} className={classes}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag id={id} className={classes}>
      <div
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(32px)',
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: visible ? 'auto' : 'opacity, transform',
        }}
      >
        {children}
      </div>
    </Tag>
  );
}

/* ── SectionHeader ── */
interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col gap-4 mb-12 ${alignClass} ${className}`}>
      {eyebrow && <span className="text-eyebrow">{eyebrow}</span>}
      <div className={align === "center" ? "divider-gold-center" : "divider-gold"} />
      <h2 className="text-balance">{title}</h2>
      {subtitle && (
        <p className="text-[var(--warm-gray)] max-w-2xl text-pretty leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
