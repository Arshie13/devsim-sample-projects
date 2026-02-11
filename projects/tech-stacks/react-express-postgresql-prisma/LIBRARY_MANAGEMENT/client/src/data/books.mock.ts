import type { Book } from '../types';

export const mockBooks: Book[] = [
  {
    id: 'book-001',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    description:
      'A novel about the American Dream, set in the Jazz Age, following the mysterious millionaire Jay Gatsby and his obsession with Daisy Buchanan.',
    isbn: '978-0743273565',
    totalCopies: 3,
    availableCopies: 2,
    createdAt: '2024-01-10T08:00:00.000Z',
  },
  {
    id: 'book-002',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    description:
      'A classic of American literature, exploring racial injustice in the Deep South through the eyes of young Scout Finch.',
    isbn: '978-0061120084',
    totalCopies: 2,
    availableCopies: 0,
    createdAt: '2024-01-12T08:00:00.000Z',
  },
  {
    id: 'book-003',
    title: '1984',
    author: 'George Orwell',
    genre: 'Science Fiction',
    description:
      'A dystopian novel set in a totalitarian society where Big Brother watches every citizen and independent thinking is a crime.',
    isbn: '978-0451524935',
    totalCopies: 4,
    availableCopies: 3,
    createdAt: '2024-02-01T08:00:00.000Z',
  },
  {
    id: 'book-004',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    description:
      'An epic science fiction saga set on the desert planet Arrakis, following Paul Atreides as he navigates politics, religion, and ecology.',
    isbn: '978-0441013593',
    totalCopies: 2,
    availableCopies: 1,
    createdAt: '2024-02-15T08:00:00.000Z',
  },
  {
    id: 'book-005',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description:
      'The adventure of Bilbo Baggins, a hobbit who joins a quest to reclaim a treasure guarded by the dragon Smaug.',
    isbn: '978-0547928227',
    totalCopies: 3,
    availableCopies: 3,
    createdAt: '2024-03-01T08:00:00.000Z',
  },
  {
    id: 'book-006',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'Non-Fiction',
    description:
      'A brief history of humankind, exploring how Homo sapiens came to dominate the world through cognitive, agricultural, and scientific revolutions.',
    isbn: '978-0062316097',
    totalCopies: 2,
    availableCopies: 2,
    createdAt: '2024-03-10T08:00:00.000Z',
  },
  {
    id: 'book-007',
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    genre: 'Biography',
    description:
      'The exclusive biography of Apple\'s creative genius, based on extensive interviews with Jobs, his family, and colleagues.',
    isbn: '978-1451648539',
    totalCopies: 1,
    availableCopies: 0,
    createdAt: '2024-04-01T08:00:00.000Z',
  },
  {
    id: 'book-008',
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    genre: 'Mystery',
    description:
      'A psychological thriller about a marriage gone terribly wrong, with twists that question everything you think you know.',
    isbn: '978-0307588371',
    totalCopies: 3,
    availableCopies: 2,
    createdAt: '2024-04-15T08:00:00.000Z',
  },
  {
    id: 'book-009',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Technology',
    description:
      'A handbook of agile software craftsmanship, teaching developers how to write code that is clean, readable, and maintainable.',
    isbn: '978-0132350884',
    totalCopies: 2,
    availableCopies: 1,
    createdAt: '2024-05-01T08:00:00.000Z',
  },
  {
    id: 'book-010',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    description:
      'A practical guide to building good habits and breaking bad ones, with proven strategies for making small changes that deliver remarkable results.',
    isbn: '978-0735211292',
    totalCopies: 4,
    availableCopies: 4,
    createdAt: '2024-05-15T08:00:00.000Z',
  },
];
