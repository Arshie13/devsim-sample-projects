export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoString));
}

export function formatBudget(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function formatDateShort(isoString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(isoString));
}
