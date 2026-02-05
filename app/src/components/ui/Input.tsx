"use client";

import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-ink-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            h-10 px-3 rounded-lg border border-border bg-surface-raised text-ink
            text-[14px] placeholder:text-ink-muted
            transition-colors duration-[100ms]
            hover:border-border-strong
            focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-negative focus:border-negative focus:ring-negative/10" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-[12px] text-negative">{error}</p>}
        {hint && !error && (
          <p className="text-[12px] text-ink-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
