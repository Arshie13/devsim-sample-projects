/**
 * Level 3 - Task 3.2: Returns Page with shadcn Dialog
 * Tests that returns page uses shadcn/ui Dialog for return confirmation
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReturnsPage from '@/app/returns/page'
import { mockBooks } from '@/lib/mockData'
import { join, resolve } from 'path'
import fs from 'fs'

describe('Level 3 - Task 3.2: Returns Page with shadcn Dialog', () => {
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

  it('should use shadcn Dialog for return confirmation', () => {
    render(<ReturnsPage />)
    const returnButton = screen.getAllByRole('button', { name: /return/i })[0]
    fireEvent.click(returnButton)

    // Dialog should open
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()

    // Dialog should have proper shadcn structure
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('role', 'dialog')

    // DialogContent should be present
    const dialogContent = dialog.closest('[data-radix-dialog-content]') || dialog
    expect(dialogContent).toBeInTheDocument()
  })

  it('should show confirmation message in Dialog', () => {
    render(<ReturnsPage />)
    const returnButton = screen.getAllByRole('button', { name: /return/i })[0]
    fireEvent.click(returnButton)

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
  })

  it('should have Confirm and Cancel buttons in Dialog', () => {
    render(<ReturnsPage />)
    const returnButton = screen.getAllByRole('button', { name: /return/i })[0]
    fireEvent.click(returnButton)

    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    expect(confirmButton).toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
  })

  it('should process return and update book status when confirmed', async () => {
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

  it('should close Dialog when Cancel is clicked', () => {
    render(<ReturnsPage />)
    const returnButton = screen.getAllByRole('button', { name: /return/i })[0]
    fireEvent.click(returnButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should import Dialog from @/components/ui/dialog in returns page', () => {
    const returnsPath = join(
      process.cwd(),
      'src',
      'app',
      'returns',
      'page.tsx'
    )
    expect(fs.existsSync(returnsPath)).toBe(true)
    const source = fs.readFileSync(returnsPath, 'utf-8')
    expect(source).toMatch(/from\s+['"]@\/components\/ui\/dialog['"]/)
    expect(source).toMatch(/Dialog(?:Trigger|Content|Header|Title|Description)?/)
  })
})