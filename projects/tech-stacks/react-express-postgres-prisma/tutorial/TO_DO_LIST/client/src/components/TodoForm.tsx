import type { FormEvent } from "react";

type TodoFormProps = {
  title: string;
  submitting: boolean;
  onTitleChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function TodoForm({ title, submitting, onTitleChange, onSubmit }: TodoFormProps) {
  return (
    <form onSubmit={onSubmit} className="todo-form">
      <input
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        placeholder="What needs to be done?"
        maxLength={200}
        aria-label="Todo title"
      />
      <button type="submit" disabled={submitting || !title.trim()}>
        {submitting ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
