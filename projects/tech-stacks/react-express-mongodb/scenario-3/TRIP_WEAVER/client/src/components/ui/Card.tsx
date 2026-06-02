import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
}

export function Card({ padding = "md", className = "", children, ...rest }: CardProps) {
  const paddingClasses = { sm: "p-3", md: "p-4", lg: "p-6" };
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${paddingClasses[padding]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
