interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "blue" | "green" | "yellow" | "red" | "purple";
  className?: string;
  [key: string]: unknown;
}

const variantClasses: Record<string, string> = {
  default: "bg-gray-100 text-gray-700",
  blue: "bg-sky-100 text-sky-700",
  green: "bg-emerald-100 text-emerald-700",
  yellow: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700",
};

export function Badge({ children, variant = "default", className = "", ...rest }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
