export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Set up the development environment",
    completed: true,
    createdAt: "2026-04-01",
  },
  {
    id: "2",
    title: "Read through the project README",
    completed: true,
    createdAt: "2026-04-01",
  },
  {
    id: "3",
    title: "Explore the folder structure",
    completed: false,
    createdAt: "2026-04-02",
  },
  {
    id: "4",
    title: "Build a new UI feature",
    completed: false,
    createdAt: "2026-04-02",
  },
  {
    id: "5",
    title: "Run the test suite",
    completed: false,
    createdAt: "2026-04-03",
  },
];
