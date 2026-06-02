import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantClasses: Record<string, string> = {
  primary: "bg-sky-500 text-white hover:bg-sky-600",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
