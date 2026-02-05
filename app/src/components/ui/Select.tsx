"use client";

import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", id, ...props }, ref) => {
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
        <select
          ref={ref}
          id={inputId}
          className={`
            h-10 px-3 rounded-lg border border-border bg-surface-raised text-ink
            text-[14px] appearance-none
            bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%238a8a8a%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')]
            bg-[position:right_12px_center] bg-no-repeat
            transition-colors duration-[100ms]
            hover:border-border-strong
            focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10
            ${error ? "border-negative" : ""}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[12px] text-negative">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
