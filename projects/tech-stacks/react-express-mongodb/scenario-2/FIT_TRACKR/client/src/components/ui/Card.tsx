import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses: Record<string, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export function Card({ padding = "md", className = "", children, ...rest }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${paddingClasses[padding]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
