/**
 * Level 5 - Task 5.1: Overdue Bug Fix & Report Page
 *
 * Verifies the Task 5.1 deliverable (see client/levels.md): a dedicated
 * overdue report page at src/app/overdue/page.tsx that lists overdue books
 * with borrower details, days overdue, and a "Mark as Returned" action.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import OverduePage from '@/app/overdue/page'
import { mockBooks, mockBorrowRecords } from '@/lib/mockData'

const overdueBooks = mockBooks.filter((book) => book.status === 'overdue')

describe('Level 5 - Task 5.1: Overdue Report Page', () => {
  beforeEach(() => {
    localStorage.setItem(
      'librarian',
      JSON.stringify({
        id: '1',
        username: 'admin',
        password: 'admin123',
        name: 'Admin Librarian',
      })
    )
  })

  it('should list every overdue book with its title and author', () => {
    render(<OverduePage />)
    overdueBooks.forEach((book) => {
      expect(screen.getByText(book.title)).toBeInTheDocument()
      expect(screen.getByText(book.author)).toBeInTheDocument()
    })
  })

  it('should display the borrower name for each overdue book', () => {
    render(<OverduePage />)
    overdueBooks.forEach((book) => {
      expect(screen.getByText(book.borrowedBy as string)).toBeInTheDocument()
    })
  })

  it('should display the borrower email for each overdue book', () => {
    render(<OverduePage />)
    overdueBooks.forEach((book) => {
      const record = mockBorrowRecords.find((r) => r.bookId === book.id)
      if (record) {
        expect(screen.getByText(record.borrowerEmail)).toBeInTheDocument()
      }
    })
  })

  it('should show how many days each book is overdue', () => {
    render(<OverduePage />)
    expect(screen.getAllByText(/days?\s*overdue/i).length).toBeGreaterThan(0)
  })

  it('should provide a "Mark as Returned" button for each overdue book', () => {
    render(<OverduePage />)
    const buttons = screen.getAllByRole('button', { name: /mark as returned/i })
    expect(buttons.length).toBe(overdueBooks.length)
  })

  it('should remove a book from the overdue list once it is marked returned', async () => {
    render(<OverduePage />)
    const firstBook = overdueBooks[0]
    const buttons = screen.getAllByRole('button', { name: /mark as returned/i })
    fireEvent.click(buttons[0])

    await waitFor(() => {
      expect(screen.queryByText(firstBook.title)).not.toBeInTheDocument()
    })
  })
})
