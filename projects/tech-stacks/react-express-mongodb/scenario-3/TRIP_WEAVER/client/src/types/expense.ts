export interface Expense {
  _id: string;
  tripId: string;
  paidById: string | { _id: string; name: string; username: string };
  amount: number;
  currency: string;
  description?: string;
  splitBetween: Array<string | { _id: string; name: string; username: string }>;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpensePayload {
  amount: number;
  currency?: string;
  description?: string;
  splitBetween: string[];
  paidAt?: string;
}

export interface BalanceSummary {
  paid: number;
  owes: number;
  net: number;
}
