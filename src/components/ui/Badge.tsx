import clsx from "clsx";
import { ReactNode } from "react";

type BadgeVariant = "sale" | "sold-out" | "category";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
  const baseStyles = "px-2 py-1 text-xs font-bold uppercase";

  const variantStyles = {
    sale: "bg-brand-gold text-white",
    "sold-out": "bg-light-grey text-white",
    category: "bg-off-white border border-light-grey text-ink-black",
  };

  return (
    <span className={clsx(baseStyles, variantStyles[variant], className)}>
      {children}
    </span>
  );
}
