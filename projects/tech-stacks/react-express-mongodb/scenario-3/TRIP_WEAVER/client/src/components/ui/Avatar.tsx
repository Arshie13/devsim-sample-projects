interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-14 w-14" };

export function Avatar({ src, alt = "User avatar", size = "md" }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border border-gray-200`}
      />
    );
  }
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-semibold text-sm border border-gray-200`}
    >
      {alt.charAt(0).toUpperCase()}
    </div>
  );
}
