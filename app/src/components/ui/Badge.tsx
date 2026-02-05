"use client";

type BadgeVariant = "default" | "positive" | "negative" | "warning" | "info";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-overlay text-ink-secondary",
  positive: "bg-positive-bg text-positive",
  negative: "bg-negative-bg text-negative",
  warning: "bg-warning-bg text-warning",
  info: "bg-info-bg text-info",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center h-5 px-2 rounded-full
        text-[11px] font-semibold uppercase tracking-wider
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
