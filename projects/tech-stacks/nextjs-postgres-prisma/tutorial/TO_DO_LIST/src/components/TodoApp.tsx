'use client';

import { useState } from 'react';
import { createTodo, toggleTodo, deleteTodo } from '@/app/actions/todos';
import { formatDate } from '@/lib/format';

type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export function TodoApp({ initialTodos }: { initialTodos: TodoItem[] }) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remainingCount = todos.filter((todo) => !todo.completed).length;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setSubmitting(true);
    setError(null);

    try {
      const created = await createTodo(trimmedTitle);
      setTodos((current) => [
        {
          id: created.id,
          title: created.title,
          completed: created.completed,
          created_at: created.created_at.toISOString(),
        },
        ...current,
      ]);
      setTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    setError(null);
    try {
      const updated = await toggleTodo(id);
      setTodos((current) =>
        current.map((todo) =>
          todo.id === id ? { ...todo, completed: updated.completed } : todo
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo.');
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteTodo(id);
      setTodos((current) => current.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo.');
    }
  };

  return (
    <main className="page">
      <section className="todo-card">
        <h1>To-Do List Tutorial</h1>
        <p className="subheading">One page, minimal Next.js + PostgreSQL + Prisma sample.</p>

        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to be done?"
            maxLength={200}
            aria-label="Todo title"
          />
          <button type="submit" disabled={submitting || !title.trim()}>
            {submitting ? 'Adding...' : 'Add'}
          </button>
        </form>

        <div className="todo-summary">
          <span>{remainingCount} remaining</span>
        </div>

        {error && <p className="error-text">{error}</p>}

        {todos.length === 0 ? (
          <p className="empty-text">No todos yet. Add your first one.</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                <div className="todo-main">
                  <label>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo.id)}
                    />
                    <span>{todo.title}</span>
                  </label>
                  <small>Created: {formatDate(todo.created_at)}</small>
                </div>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
