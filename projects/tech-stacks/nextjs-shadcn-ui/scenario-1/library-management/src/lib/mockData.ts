// Mock data for the library book management system

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  status: 'available' | 'borrowed' | 'overdue';
  borrowedBy?: string;
  borrowedDate?: string;
  dueDate?: string;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowDate: string;
  dueDate: string;
  status: 'borrowed' | 'returned' | 'overdue';
}

export interface Librarian {
  id: string;
  username: string;
  password: string;
  name: string;
}

// Mock books data
export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    status: 'available',
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    status: 'borrowed',
    borrowedBy: 'John Smith',
    borrowedDate: '2026-01-15',
    dueDate: '2026-01-29',
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0-452-28423-4',
    status: 'overdue',
    borrowedBy: 'Jane Doe',
    borrowedDate: '2026-01-01',
    dueDate: '2026-01-15',
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0-14-143951-8',
    status: 'available',
  },
  {
    id: '5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '978-0-316-76948-0',
    status: 'borrowed',
    borrowedBy: 'Mike Johnson',
    borrowedDate: '2026-01-20',
    dueDate: '2026-02-03',
  },
  {
    id: '6',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '978-0-547-92822-7',
    status: 'overdue',
    borrowedBy: 'Sarah Wilson',
    borrowedDate: '2025-12-20',
    dueDate: '2026-01-03',
  },
  {
    id: '7',
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    isbn: '978-1-4516-7330-4',
    status: 'available',
  },
  {
    id: '8',
    title: 'Animal Farm',
    author: 'George Orwell',
    isbn: '978-0-452-28424-1',
    status: 'borrowed',
    borrowedBy: 'Tom Brown',
    borrowedDate: '2026-01-25',
    dueDate: '2026-02-08',
  },
];

// Mock borrow records
export const mockBorrowRecords: BorrowRecord[] = [
  {
    id: '1',
    bookId: '2',
    bookTitle: 'To Kill a Mockingbird',
    borrowerName: 'John Smith',
    borrowerEmail: 'john.smith@email.com',
    borrowDate: '2026-01-15',
    dueDate: '2026-01-29',
    status: 'borrowed',
  },
  {
    id: '2',
    bookId: '3',
    bookTitle: '1984',
    borrowerName: 'Jane Doe',
    borrowerEmail: 'jane.doe@email.com',
    borrowDate: '2026-01-01',
    dueDate: '2026-01-15',
    status: 'overdue',
  },
  {
    id: '3',
    bookId: '5',
    bookTitle: 'The Catcher in the Rye',
    borrowerName: 'Mike Johnson',
    borrowerEmail: 'mike.johnson@email.com',
    borrowDate: '2026-01-20',
    dueDate: '2026-02-03',
    status: 'borrowed',
  },
  {
    id: '4',
    bookId: '6',
    bookTitle: 'The Hobbit',
    borrowerName: 'Sarah Wilson',
    borrowerEmail: 'sarah.wilson@email.com',
    borrowDate: '2025-12-20',
    dueDate: '2026-01-03',
    status: 'overdue',
  },
  {
    id: '5',
    bookId: '8',
    bookTitle: 'Animal Farm',
    borrowerName: 'Tom Brown',
    borrowerEmail: 'tom.brown@email.com',
    borrowDate: '2026-01-25',
    dueDate: '2026-02-08',
    status: 'borrowed',
  },
];

// Mock librarian credentials
export const mockLibrarians: Librarian[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Admin Librarian',
  },
  {
    id: '2',
    username: 'librarian',
    password: 'lib123',
    name: 'Staff Librarian',
  },
];
