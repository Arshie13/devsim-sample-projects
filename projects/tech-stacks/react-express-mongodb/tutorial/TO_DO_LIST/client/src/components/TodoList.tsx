import type { Todo } from "../types/todo";
import { formatDate } from "../utils/formatDate";

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id} className={todo.completed ? "completed" : ""}>
          <div className="todo-main">
            <label>
              <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
              <span>{todo.title}</span>
            </label>
            <small>Created: {formatDate(todo.createdAt)}</small>
          </div>
          <button type="button" className="ghost-button" onClick={() => onDelete(todo.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
