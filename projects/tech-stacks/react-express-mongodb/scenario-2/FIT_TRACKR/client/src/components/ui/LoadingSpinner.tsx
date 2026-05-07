export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-10 h-10" : "w-6 h-6";
  return (
    <div className={`${dim} border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin`} role="status" aria-label="loading" />
  );
}
