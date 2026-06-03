import { prisma } from '@/lib/prisma';
import { TodoApp } from '@/components/TodoApp';

export default async function TodosPage() {
  const todos = await prisma.todo.findMany({
    orderBy: { created_at: 'desc' },
  });

  const serializedTodos = todos.map((todo) => ({
    ...todo,
    created_at: todo.created_at.toISOString(),
  }));

  return <TodoApp initialTodos={serializedTodos} />;
}
