import type { BalanceSummary } from "../../types/expense";

interface BalancePanelProps {
  balances: Record<string, BalanceSummary>;
  currency: string;
}

export function BalancePanel({ balances, currency }: BalancePanelProps) {
  const entries = Object.entries(balances);

  if (entries.length === 0) {
    return <p className="text-gray-400 text-sm py-4">No balances to show yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map(([userId, { paid, owes, net }]) => (
        <div
          key={userId}
          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
        >
          <p className="text-sm text-gray-700 font-medium">{userId}</p>
          <div className="text-right text-xs text-gray-500">
            <p>Paid: {currency} {paid.toFixed(2)}</p>
            <p>Owes: {currency} {owes.toFixed(2)}</p>
            <p className={`font-semibold ${net >= 0 ? "text-green-600" : "text-red-500"}`}>
              Net: {net >= 0 ? "+" : ""}{currency} {net.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
