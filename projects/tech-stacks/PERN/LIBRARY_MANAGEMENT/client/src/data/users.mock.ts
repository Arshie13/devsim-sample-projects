import type { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-001',
    email: 'admin@bookwise.com',
    password: 'admin123',
    name: 'Alice Admin',
    role: 'ADMIN',
    createdAt: '2024-01-01T08:00:00.000Z',
  },
  {
    id: 'user-002',
    email: 'librarian@bookwise.com',
    password: 'lib123',
    name: 'Larry Librarian',
    role: 'LIBRARIAN',
    createdAt: '2024-01-05T08:00:00.000Z',
  },
  {
    id: 'user-003',
    email: 'john@example.com',
    password: 'member123',
    name: 'John Doe',
    role: 'MEMBER',
    createdAt: '2024-02-01T08:00:00.000Z',
  },
  {
    id: 'user-004',
    email: 'jane@example.com',
    password: 'member123',
    name: 'Jane Smith',
    role: 'MEMBER',
    createdAt: '2024-02-10T08:00:00.000Z',
  },
  {
    id: 'user-005',
    email: 'bob@example.com',
    password: 'member123',
    name: 'Bob Wilson',
    role: 'MEMBER',
    createdAt: '2024-03-01T08:00:00.000Z',
  },
];
