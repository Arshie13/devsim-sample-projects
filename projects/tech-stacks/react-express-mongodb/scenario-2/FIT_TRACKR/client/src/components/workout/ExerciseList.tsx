import type { Exercise } from "../../types/workout";

interface ExerciseListProps {
  exercises: Exercise[];
}

export function ExerciseList({ exercises }: ExerciseListProps) {
  if (exercises.length === 0) return <p className="text-sm text-gray-400">No exercises logged.</p>;

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="text-left text-gray-500 border-b border-gray-100">
          <th className="pb-2 pr-4">Exercise</th>
          <th className="pb-2 pr-4">Sets</th>
          <th className="pb-2 pr-4">Reps</th>
          <th className="pb-2 pr-4">Weight</th>
        </tr>
      </thead>
      <tbody>
        {exercises.map((ex, i) => (
          <tr key={i} className="border-b border-gray-50">
            <td className="py-1.5 pr-4 font-medium">{ex.name}</td>
            <td className="py-1.5 pr-4 text-gray-600">{ex.sets}</td>
            <td className="py-1.5 pr-4 text-gray-600">{ex.reps}</td>
            <td className="py-1.5 pr-4 text-gray-600">{ex.weightKg > 0 ? `${ex.weightKg} kg` : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
