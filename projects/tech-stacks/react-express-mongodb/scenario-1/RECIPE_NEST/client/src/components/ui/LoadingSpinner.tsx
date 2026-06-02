export function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-2 text-slate-500">
      <span className="inline-block h-4 w-4 rounded-full border-2 border-slate-300 border-t-brand-500 animate-spin" />
      <span>{label}</span>
    </div>
  );
}
