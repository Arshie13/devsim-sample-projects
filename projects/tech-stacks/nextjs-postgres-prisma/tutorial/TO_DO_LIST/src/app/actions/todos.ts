'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createTodo(title: string) {
  const trimmed = title.trim();
  if (!trimmed) throw new Error('Title is required');

  const todo = await prisma.todo.create({
    data: { title: trimmed },
  });
  revalidatePath('/todos');
  return todo;
}

export async function toggleTodo(id: string) {
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) throw new Error('Todo not found');

  const updated = await prisma.todo.update({
    where: { id },
    data: { completed: !todo.completed },
  });
  revalidatePath('/todos');
  return updated;
}

export async function deleteTodo(id: string) {
  await prisma.todo.delete({ where: { id } });
  revalidatePath('/todos');
}
