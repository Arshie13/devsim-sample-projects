import type { HTMLAttributes } from "react";

export function Card({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={`bg-white rounded-lg shadow-sm border border-slate-200 ${className}`}
    />
  );
}
