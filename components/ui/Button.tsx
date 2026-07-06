"use client";

import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementType } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "outline-white";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary:         "btn btn-primary",
  secondary:       "btn btn-secondary",
  ghost:           "btn btn-ghost",
  outline:         "btn btn-outline",
  "outline-white": "btn btn-outline-white",
};

const sizeClass: Record<Size, string> = {
  sm: "!py-2 !px-4 !text-xs",
  md: "",
  lg: "!py-4 !px-8 !text-sm",
};

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: Variant;
  size?: Size;
  as?: ElementType;
  href?: string;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      as: Tag = "button",
      href,
      loading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const classes = [variantClass[variant], sizeClass[size], className]
      .filter(Boolean)
      .join(" ");

    const extraProps = href ? { href } : {};

    return (
      <Tag
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...extraProps}
        {...props}
      >
        {loading ? (
          <>
            <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Chargement…</span>
          </>
        ) : (
          children
        )}
      </Tag>
    );
  }
);

Button.displayName = "Button";
export { Button };
export type { ButtonProps, Variant as ButtonVariant, Size as ButtonSize };
