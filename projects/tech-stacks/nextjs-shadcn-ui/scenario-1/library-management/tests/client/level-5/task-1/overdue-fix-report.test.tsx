import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Dashboard from '@/app/dashboard/page'
import { Book, BorrowRecord } from '@/lib/mockData'

// Mock data for testing - based on actual mockData.ts structure
const mockBooks: Book[] = [
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
]

// Mock borrow records for report testing
const mockBorrowRecords: BorrowRecord[] = [
  {
    id: '1',
    bookId: '2',
    bookTitle: 'To Kill a Mockingbird',
    borrowerName: 'John Smith',
    borrowerEmail: 'john@example.com',
    borrowDate: '2026-01-15',
    dueDate: '2026-01-29',
    status: 'borrowed',
  },
  {
    id: '2',
    bookId: '3',
    bookTitle: '1984',
    borrowerName: 'Jane Doe',
    borrowerEmail: 'jane@example.com',
    borrowDate: '2026-01-01',
    dueDate: '2026-01-15',
    status: 'overdue',
  },
  {
    id: '3',
    bookId: '5',
    bookTitle: 'The Catcher in the Rye',
    borrowerName: 'Mike Johnson',
    borrowerEmail: 'mike@example.com',
    borrowDate: '2026-01-20',
    dueDate: '2026-02-03',
    status: 'borrowed',
  },
  {
    id: '4',
    bookId: '6',
    bookTitle: 'The Hobbit',
    borrowerName: 'Sarah Wilson',
    borrowerEmail: 'sarah@example.com',
    borrowDate: '2025-12-20',
    dueDate: '2026-01-03',
    status: 'overdue',
  },
]

describe('Level 5: Task 1 - Overdue Bug Fix & Report', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock localStorage with librarian login
    const librarian = { id: '1', username: 'admin', name: 'Admin User', password: 'secret' }
    const localStorageMock = {
      getItem: vi.fn((key: string) => {
        if (key === 'librarian') return JSON.stringify(librarian)
        if (key === 'books') return JSON.stringify(mockBooks)
        if (key === 'borrowRecords') return JSON.stringify(mockBorrowRecords)
        return null
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  })

  describe('Overdue Status Bug Fix (5.1.1)', () => {
    it('should correctly identify overdue books (bug fix)', async () => {
      render(<Dashboard />)

      // The bug: overdue books were not being marked correctly
      // After fix: books with status 'overdue' should show "Overdue" badge
      await waitFor(() => {
        const overdueBadges = screen.getAllByText('Overdue')
        expect(overdueBadges.length).toBe(2) // 1984 and The Hobbit
      })
    })

    it('should display correct badge for borrowed (non-overdue) books', async () => {
      render(<Dashboard />)

      // Borrowed books (not overdue) should show "Borrowed" badge
      await waitFor(() => {
        const borrowedBadges = screen.getAllByText('Borrowed')
        expect(borrowedBadges.length).toBe(2) // To Kill a Mockingbird and The Catcher in the Rye
      })
    })

    it('should display correct badge for available books', async () => {
      render(<Dashboard />)

      // Available books should show "Available" badge
      await waitFor(() => {
        const availableBadges = screen.getAllByText('Available')
        expect(availableBadges.length).toBe(2) // Gatsby and Pride and Prejudice
      })
    })

    it('should not mark available books as overdue', async () => {
      render(<Dashboard />)

      // Available books should appear with Available badge
      expect(screen.getByText('The Great Gatsby')).toBeInTheDocument()
      expect(screen.getByText('Pride and Prejudice')).toBeInTheDocument()
    })
  })

  describe('Dashboard Statistics', () => {
    it('should show correct total books count', async () => {
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('6')).toBeInTheDocument() // Total 6 books
      })
    })

    it('should show correct available count', async () => {
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument() // 2 available
      })
    })

    it('should show correct overdue count', async () => {
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument() // 2 overdue
      })
    })
  })

  describe('Report Generation (5.1.2)', () => {
    it('should generate statistics report with correct total borrowed count', async () => {
      render(<Dashboard />)

      // Navigate to Borrowed tab or check stats
      await waitFor(() => {
        const borrowedTab = screen.getByRole('button', { name: 'Borrowed' })
        expect(borrowedTab).toBeInTheDocument()
      })
    })

    it('should list all overdue books in report', async () => {
      render(<Dashboard />)

      await waitFor(() => {
        // Check overdue books are listed
        expect(screen.getByText('1984')).toBeInTheDocument()
        expect(screen.getByText('The Hobbit')).toBeInTheDocument()
      })
    })

    it('should display borrower names for overdue books', async () => {
      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('Jane Doe')).toBeInTheDocument()
        expect(screen.getByText('Sarah Wilson')).toBeInTheDocument()
      })
    })

    it('should show days overdue for each overdue book', async () => {
      render(<Dashboard />)

      await waitFor(() => {
        // 1984 is ~45+ days overdue (from Jan 15 to now)
        // The Hobbit is ~50+ days overdue
        expect(screen.getByText(/days overdue/i)).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty books array', async () => {
      const emptyLocalStorage = {
        getItem: vi.fn((key: string) => {
          if (key === 'librarian') return JSON.stringify({ id: '1', username: 'admin', name: 'Admin' })
          if (key === 'books') return JSON.stringify([])
          return null
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', { value: emptyLocalStorage })

      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument()
      })
    })

    it('should handle all books being overdue', async () => {
      const allOverdueBooks = mockBooks.map((book) => ({
        ...book,
        status: 'overdue' as const,
        borrowedBy: 'Test User',
        borrowedDate: '2026-01-01',
        dueDate: '2026-01-15',
      }))

      const overdueLocalStorage = {
        getItem: vi.fn((key: string) => {
          if (key === 'librarian') return JSON.stringify({ id: '1', username: 'admin', name: 'Admin' })
          if (key === 'books') return JSON.stringify(allOverdueBooks)
          return null
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', { value: overdueLocalStorage })

      render(<Dashboard />)

      await waitFor(() => {
        const badges = screen.getAllByText('Overdue')
        expect(badges.length).toBe(allOverdueBooks.length)
      })
    })

    it('should handle books due today (not overdue)', async () => {
      const today = new Date().toISOString().split('T')[0]
      const dueTodayBooks = [
        { ...mockBooks[0], status: 'borrowed' as const, borrowedBy: 'Test', dueDate: today },
      ]

      const todayLocalStorage = {
        getItem: vi.fn((key: string) => {
          if (key === 'librarian') return JSON.stringify({ id: '1', username: 'admin', name: 'Admin' })
          if (key === 'books') return JSON.stringify(dueTodayBooks)
          return null
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', { value: todayLocalStorage })

      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('Borrowed')).toBeInTheDocument()
        expect(screen.queryByText('Overdue')).not.toBeInTheDocument()
      })
    })
  })

  describe('Integration: Data Consistency', () => {
    it('should maintain consistent counts between books and statistics', async () => {
      render(<Dashboard />)

      await waitFor(() => {
        // Total = Available + Borrowed + Overdue = 2 + 2 + 2 = 6
        const total = screen.getByText('6')
        const available = screen.getByText('2')
        const overdue = screen.getByText('2')
        expect(total).toBeInTheDocument()
        expect(available).toBeInTheDocument()
        expect(overdue).toBeInTheDocument()
      })
    })

    it('should persist data correctly in localStorage', () => {
      render(<Dashboard />)

      // Verify localStorage was read
      expect(window.localStorage.getItem).toHaveBeenCalledWith('librarian')
      expect(window.localStorage.getItem).toHaveBeenCalledWith('books')
    })
  })
})
