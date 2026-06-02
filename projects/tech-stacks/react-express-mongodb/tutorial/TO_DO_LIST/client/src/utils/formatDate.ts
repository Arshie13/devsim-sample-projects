export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString();
}
