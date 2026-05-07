interface Props {
  src?: string;
  name: string;
  size?: number;
}

export function Avatar({ src, name, size = 36 }: Props) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover bg-slate-200"
      />
    );
  }
  return (
    <span
      aria-label={name}
      className="inline-flex items-center justify-center rounded-full bg-brand-500 text-white font-semibold"
      style={{ width: size, height: size }}
    >
      {initials || "?"}
    </span>
  );
}
