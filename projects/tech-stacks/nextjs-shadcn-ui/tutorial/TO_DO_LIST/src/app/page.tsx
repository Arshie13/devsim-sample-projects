'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { mockTodos, type Todo } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [newTitle, setNewTitle] = useState('');

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.length - completedCount;

  const handleAdd = () => {
    const title = newTitle.trim();
    if (!title) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTodos((prev) => [newTodo, ...prev]);
    setNewTitle('');
  };

  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            My To-Do List
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Total</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                {todos.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Done</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {completedCount}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Pending</p>
              <p className="text-3xl font-bold text-yellow-500 mt-1">
                {pendingCount}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add Todo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add a new task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="What needs to be done?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button onClick={handleAdd} disabled={!newTitle.trim()}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Todo List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 p-2">
            {todos.length === 0 ? (
              <p className="text-center text-zinc-400 py-8">
                No tasks yet. Add one above!
              </p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 group"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggle(todo.id)}
                  />
                  <span
                    className={`flex-1 text-sm ${
                      todo.completed
                        ? 'line-through text-zinc-400'
                        : 'text-zinc-900 dark:text-zinc-50'
                    }`}
                  >
                    {todo.title}
                  </span>
                  <Badge variant={todo.completed ? 'success' : 'secondary'}>
                    {todo.completed ? 'Done' : 'Pending'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(todo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
