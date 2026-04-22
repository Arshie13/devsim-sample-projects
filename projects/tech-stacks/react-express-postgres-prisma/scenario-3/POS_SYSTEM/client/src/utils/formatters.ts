export type StockLevel = 'OUT_OF_STOCK' | 'LOW_STOCK' | 'IN_STOCK';

export function getStockLevel(
  quantity: number,
  lowStockThreshold: number
): StockLevel {
  if (quantity <= 0) return 'OUT_OF_STOCK';
  if (quantity <= lowStockThreshold) return 'LOW_STOCK';
  return 'IN_STOCK';
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
