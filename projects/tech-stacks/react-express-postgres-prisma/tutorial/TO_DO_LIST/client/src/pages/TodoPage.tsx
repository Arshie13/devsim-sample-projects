import { FormEvent, useEffect, useMemo, useState } from "react";
import { TodoForm } from "../components/TodoForm";
import { TodoList } from "../components/TodoList";
import { todoService } from "../services/todoService";
import type { Todo } from "../types/todo";

export function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remainingCount = useMemo(() => todos.filter((todo) => !todo.completed).length, [todos]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load todos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTodos();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const created = await todoService.createTodo(trimmedTitle);
      setTodos((current) => [created, ...current]);
      setTitle("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to create todo.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      setError(null);
      const updated = await todoService.toggleTodo(id);
      setTodos((current) => current.map((todo) => (todo.id === id ? updated : todo)));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to update todo.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await todoService.deleteTodo(id);
      setTodos((current) => current.filter((todo) => todo.id !== id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to delete todo.");
    }
  };

  return (
    <main className="page">
      <section className="todo-card">
        <h1>To-Do List Tutorial</h1>
        <p className="subheading">One page, minimal PERN stack sample.</p>

        <TodoForm
          title={title}
          submitting={submitting}
          onTitleChange={setTitle}
          onSubmit={handleSubmit}
        />

        <div className="todo-summary">
          <span>{remainingCount} remaining</span>
          <button type="button" onClick={loadTodos} className="ghost-button" disabled={loading}>
            Refresh
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {loading ? (
          <p className="loading-text">Loading todos...</p>
        ) : todos.length === 0 ? (
          <p className="empty-text">No todos yet. Add your first one.</p>
        ) : (
          <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
        )}
      </section>
    </main>
  );
}
