/**
 * Level 3 - Task 3.2: Returns Page
 * Tests that returns page exists and processes returns correctly
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReturnsPage from '@/app/returns/page'
import { mockBooks } from '@/lib/mockData'

describe('Level 3 - Task 3.2: Returns Page', () => {
  beforeEach(() => {
    const mockLibrarian = {
      id: '1',
      username: 'admin',
      password: 'admin123',
      name: 'Admin Librarian',
    }
    localStorage.setItem('librarian', JSON.stringify(mockLibrarian))
  })

  it('should render the returns page with borrowed books table', () => {
    render(<ReturnsPage />)
    expect(screen.getByText(/returns/i)).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: /title/i })
    ).toBeInTheDocument()
  })

  it('should display all currently borrowed books', () => {
    render(<ReturnsPage />)
    const borrowedBook = mockBooks.find(book => book.status === 'borrowed')
    if (borrowedBook) {
      expect(screen.getByText(borrowedBook.title)).toBeInTheDocument()
    }
  })

  it('should have a Return button for each borrowed book', () => {
    render(<ReturnsPage />)
    const returnButtons = screen.getAllByRole('button', { name: /return/i })
    const expectedBorrowedBooks = mockBooks.filter(book => book.status === 'borrowed').length
    expect(returnButtons.length).toBe(expectedBorrowedBooks)
  })

  it('should show confirmation dialog when Return button is clicked', () => {
    render(<ReturnsPage />)
    const returnButton = screen.getAllByRole('button', { name: /return/i })[0]
    fireEvent.click(returnButton)
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
  })

  it('should process return and update book status to available', async () => {
    render(<ReturnsPage />)
    const returnButton = screen.getAllByRole('button', { name: /return/i })[0]
    const borrowedBook = mockBooks.find(book => book.status === 'borrowed')
    fireEvent.click(returnButton)
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

    if (borrowedBook) {
      await waitFor(() => {
        expect(screen.queryByText(borrowedBook.title)).not.toBeInTheDocument()
      })
    }
  })
})
