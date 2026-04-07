import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "gold" | "secondary";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: ButtonVariant;
}

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const baseStyles = "px-6 py-3 font-sans font-semibold uppercase tracking-widest text-sm transition-colors duration-200 ease-in-out";

  const variantStyles = {
    primary: "bg-ink-black text-white hover:bg-white hover:text-ink-black hover:border hover:border-ink-black",
    gold: "bg-brand-gold text-ink-black hover:bg-deep-gold",
    secondary: "border border-ink-black text-ink-black bg-white hover:bg-pale-grey",
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
