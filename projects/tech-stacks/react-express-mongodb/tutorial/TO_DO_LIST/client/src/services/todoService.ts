import { apiRequest } from "../lib/apiClient";
import type { Todo } from "../types/todo";

export const todoService = {
  getTodos: () => apiRequest<Todo[]>("/api/todos"),
  createTodo: (title: string) =>
    apiRequest<Todo>("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),
  toggleTodo: (id: string) =>
    apiRequest<Todo>(`/api/todos/${id}/toggle`, {
      method: "PATCH",
    }),
  deleteTodo: (id: string) =>
    apiRequest<void>(`/api/todos/${id}`, {
      method: "DELETE",
    }),
};
