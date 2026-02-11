export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function isOverdue(dueDate: string, returnedAt: string | null): boolean {
  if (returnedAt) return false;
  return new Date(dueDate) < new Date();
}

export function getDaysOverdue(dueDate: string): number {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = now.getTime() - due.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getDueDate(borrowDate: string, days: number = 14): string {
  const date = new Date(borrowDate);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
