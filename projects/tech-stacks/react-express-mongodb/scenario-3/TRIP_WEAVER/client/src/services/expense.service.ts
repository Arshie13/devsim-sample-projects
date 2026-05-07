import api from "./api";
import type { Expense, CreateExpensePayload } from "../types/expense";

export async function listExpenses(tripId: string): Promise<Expense[]> {
  const res = await api.get<{ success: boolean; data: Expense[] }>(
    `/trips/${tripId}/expenses`
  );
  return res.data.data;
}

export async function createExpense(
  tripId: string,
  payload: CreateExpensePayload
): Promise<Expense> {
  const res = await api.post<{ success: boolean; data: Expense }>(
    `/trips/${tripId}/expenses`,
    payload
  );
  return res.data.data;
}
