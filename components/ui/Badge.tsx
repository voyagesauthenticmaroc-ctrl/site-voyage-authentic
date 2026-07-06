import type { ReactNode } from "react";

type BadgeVariant = "gold" | "nil" | "terra" | "white";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

const variantClass: Record<BadgeVariant, string> = {
  gold:  "badge badge-gold",
  nil:   "badge badge-nil",
  terra: "badge badge-terra",
  white: "badge badge-white",
};

export function Badge({ variant = "gold", children, className = "", icon }: BadgeProps) {
  return (
    <span className={[variantClass[variant], className].join(" ")}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
