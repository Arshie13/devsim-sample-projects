import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ variant = "primary", className = "", ...rest }: Props) {
  const base = "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-brand-500 text-white hover:bg-brand-600",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };
  return <button {...rest} className={`${base} ${variants[variant]} ${className}`} />;
}
