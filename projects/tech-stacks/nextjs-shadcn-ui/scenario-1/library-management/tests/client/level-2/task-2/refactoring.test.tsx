/**
 * Level 2 - Task 2.2: Refactor & Extract Component
 *
 * Verifies the Task 2.2 deliverables (see client/levels.md):
 *  - A reusable BookRow component extracted to src/components/BookRow.tsx
 *  - The dashboard still renders every book using the extracted component
 *
 * NOTE: BookRow may be a default OR a named export — both are accepted.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as BookRowModule from '@/components/BookRow'
import DashboardPage from '@/app/dashboard/page'
import { mockBooks, Book } from '@/lib/mockData'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BookRow: any =
  (BookRowModule as any).default ?? (BookRowModule as any).BookRow

const mockLibrarian = {
  id: '1',
  username: 'admin',
  password: 'admin123',
  name: 'Admin Librarian',
}

// BookRow renders a table row, so it must be mounted inside a <table>.
function renderBookRow(book: Book) {
  return render(
    <table>
      <tbody>
        <BookRow book={book} />
      </tbody>
    </table>
  )
}

describe('Level 2 - Task 2.2: Refactored Book Filtering', () => {
  beforeEach(() => {
    localStorage.setItem('librarian', JSON.stringify(mockLibrarian))
  })

  describe('BookRow component', () => {
    it('should be exported from src/components/BookRow', () => {
      expect(BookRow).toBeTypeOf('function')
    })

    it('should render the title, author and ISBN of the given book', () => {
      const book = mockBooks[0]
      renderBookRow(book)
      expect(screen.getByText(book.title)).toBeInTheDocument()
      expect(screen.getByText(book.author)).toBeInTheDocument()
      expect(screen.getByText(book.isbn)).toBeInTheDocument()
    })

    it('should render the status of the given book', () => {
      const borrowed = mockBooks.find((b) => b.status === 'borrowed') as Book
      renderBookRow(borrowed)
      expect(screen.getByText(/borrowed/i)).toBeInTheDocument()
    })
  })

  describe('Dashboard uses the extracted component', () => {
    it('should render a row for every book', () => {
      render(<DashboardPage />)
      mockBooks.forEach((book) => {
        expect(screen.getByText(book.title)).toBeInTheDocument()
      })
    })

    it('should show the correct available and overdue counts', () => {
      render(<DashboardPage />)
      const available = mockBooks.filter((b) => b.status === 'available').length
      const overdue = mockBooks.filter((b) => b.status === 'overdue').length
      expect(screen.getByText(String(available))).toBeInTheDocument()
      expect(screen.getByText(String(overdue))).toBeInTheDocument()
    })
  })
})
