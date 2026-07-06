import type { ElementType, ReactNode } from "react";

type Width = "default" | "narrow" | "wide" | "full";

const widthClass: Record<Width, string> = {
  default: "container-luxury",
  narrow:  "container-narrow",
  wide:    "container-wide",
  full:    "w-full",
};

interface ContainerProps {
  width?: Width;
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

export function Container({
  width = "default",
  as: Tag = "div",
  children,
  className = "",
}: ContainerProps) {
  return (
    <Tag className={[widthClass[width], className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
