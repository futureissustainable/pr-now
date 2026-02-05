"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-ink text-surface-raised hover:bg-accent-hover active:scale-[0.98]",
  secondary:
    "bg-surface-raised text-ink border border-border hover:border-border-strong hover:bg-surface-overlay active:scale-[0.98]",
  ghost:
    "text-ink-secondary hover:text-ink hover:bg-surface-overlay active:scale-[0.98]",
  danger:
    "bg-negative text-white hover:bg-negative/90 active:scale-[0.98]",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-md",
  md: "h-10 px-4 text-[14px] gap-2 rounded-lg",
  lg: "h-12 px-6 text-[15px] gap-2.5 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, children, className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center font-medium
          transition-all duration-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          disabled:opacity-50 disabled:pointer-events-none
          cursor-pointer
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
