"use client";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, className = "", padding = "md", hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-surface-raised rounded-xl border border-border
        ${paddingStyles[padding]}
        ${hover ? "transition-all duration-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-border-strong hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
