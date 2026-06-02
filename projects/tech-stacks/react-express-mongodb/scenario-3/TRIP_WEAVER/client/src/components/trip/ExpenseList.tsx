import type { Expense } from "../../types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  currency: string;
}

export function ExpenseList({ expenses, currency }: ExpenseListProps) {
  if (expenses.length === 0) {
    return <p className="text-gray-400 text-sm py-4">No expenses logged yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {expenses.map((expense) => (
        <div
          key={expense._id}
          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
        >
          <div>
            <p className="text-sm font-medium text-gray-800">
              {expense.description || "Expense"}
            </p>
            <p className="text-xs text-gray-400">
              Paid by {typeof expense.paidById === "string" ? expense.paidById : "member"} ·
              split {expense.splitBetween.length} ways
            </p>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {currency} {expense.amount.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}
