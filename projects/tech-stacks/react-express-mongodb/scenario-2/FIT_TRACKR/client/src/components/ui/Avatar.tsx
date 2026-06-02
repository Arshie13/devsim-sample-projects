interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  initials?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-14 h-14 text-lg",
};

export function Avatar({ src, alt = "", size = "md", initials }: AvatarProps) {
  const cls = `rounded-full overflow-hidden bg-orange-100 flex items-center justify-center font-semibold text-orange-600 shrink-0 ${sizeClasses[size]}`;
  if (src) {
    return <img src={src} alt={alt} className={`${cls} object-cover`} />;
  }
  return <div className={cls}>{initials ?? alt.charAt(0).toUpperCase()}</div>;
}
