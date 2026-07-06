import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbListProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
  /** Dark background variant */
  variant?: "light" | "dark";
}

export function BreadcrumbList({
  items,
  showHome = true,
  className = "",
  variant = "light",
}: BreadcrumbListProps) {
  const textColor =
    variant === "dark"
      ? "text-white/60 hover:text-white"
      : "text-[var(--warm-gray)] hover:text-[var(--gold)]";
  const activeColor = variant === "dark" ? "text-white/90" : "text-[var(--ink)]";
  const sepColor = variant === "dark" ? "text-white/30" : "text-[var(--parchment)]";

  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: "Accueil", href: "/" }, ...items]
    : items;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav
        aria-label="Fil d'Ariane"
        className={`flex items-center gap-1 flex-wrap ${className}`}
      >
        <ol
          role="list"
          className="flex items-center gap-1 flex-wrap list-none m-0 p-0"
        >
          {allItems.map((item, i) => {
            const isLast = i === allItems.length - 1;
            return (
              <li key={i} className="flex items-center gap-1">
                {i === 0 && showHome && (
                  <Home
                    size={13}
                    className={`${variant === "dark" ? "text-white/40" : "text-[var(--warm-gray-light)]"} mr-0.5`}
                    aria-hidden
                  />
                )}
                {isLast ? (
                  <span
                    className={`text-xs font-medium ${activeColor}`}
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href!}
                    className={`text-xs transition-colors duration-200 ${textColor}`}
                  >
                    {item.label}
                  </Link>
                )}
                {!isLast && (
                  <ChevronRight
                    size={12}
                    className={`${sepColor} flex-shrink-0`}
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
