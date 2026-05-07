interface BadgeProps {
  label: string;
  color?: "orange" | "blue" | "green" | "red" | "gray" | "purple";
  testId?: string;
}

const colorClasses: Record<string, string> = {
  orange: "bg-orange-100 text-orange-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-gray-100 text-gray-600",
  purple: "bg-purple-100 text-purple-700",
};

const categoryColors: Record<string, string> = {
  strength: "orange",
  cardio: "blue",
  mobility: "green",
  hiit: "red",
};

export function Badge({ label, color = "gray", testId }: BadgeProps) {
  const cls = colorClasses[categoryColors[label] ?? color] ?? colorClasses.gray;
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${cls}`}
      data-testid={testId}
    >
      {label}
    </span>
  );
}
