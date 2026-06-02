interface Props {
  value: number;
  outOf?: number;
}

export function RatingStars({ value, outOf = 5 }: Props) {
  const stars: string[] = [];
  for (let i = 1; i <= outOf; i++) {
    stars.push(i <= Math.round(value) ? "★" : "☆");
  }
  return (
    <span aria-label={`${value.toFixed(1)} out of ${outOf}`} className="text-amber-500">
      {stars.join("")}
    </span>
  );
}
