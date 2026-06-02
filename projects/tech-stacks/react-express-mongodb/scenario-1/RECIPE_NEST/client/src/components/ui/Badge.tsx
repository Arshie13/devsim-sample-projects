import type { HTMLAttributes } from "react";

export function Badge({ className = "", ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...rest}
      className={`inline-block px-2 py-0.5 text-xs rounded-full bg-brand-50 text-brand-700 border border-brand-500/20 ${className}`}
    />
  );
}
