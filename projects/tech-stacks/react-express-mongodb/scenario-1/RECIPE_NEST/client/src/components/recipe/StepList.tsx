import type { Step } from "../../types/recipe";

export function StepList({ steps }: { steps: Step[] }) {
  const sorted = [...steps].sort((a, b) => a.order - b.order);
  return (
    <ol className="list-decimal pl-5 space-y-2">
      {sorted.map((s) => (
        <li key={s.order}>{s.text}</li>
      ))}
    </ol>
  );
}
