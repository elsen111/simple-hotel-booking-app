import type { ButtonHTMLAttributes, ReactNode } from "react"
import clsx from "clsx"

type ButtonVariant = "primary" | "secondary" | "outline" | "accent";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-coral text-white hover:bg-coral-dark",
  secondary: "bg-sand-dark text-ink hover:bg-sand-darker",
  outline: "border border-sand-darker bg-white text-ink hover:bg-sand-dark",
  accent: "bg-teal text-white hover:bg-teal-dark",
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-md px-4 py-2 font-medium transition disabled:cursor-not-allowed cursor-pointer disabled:opacity-50",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

