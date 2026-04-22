/**
 * Level 4 - Task 4.1: Prevent Borrowing Overdue Books
 * Tests that overdue books cannot be borrowed
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'

describe('Level 4 - Task 4.1: Overdue Book Validation', () => {
  beforeEach(() => {
    const mockLibrarian = {
      id: '1',
      username: 'admin',
      password: 'admin123',
      name: 'Admin Librarian',
    }
    localStorage.setItem('librarian', JSON.stringify(mockLibrarian))
  })

  it('should disable Borrow button for overdue books', () => {
    render(<DashboardPage />)
    // Find the Borrow button for an overdue book (if any are shown as available)
    // Actually overdue books should not be available for borrowing
    // Check that overdue books are shown in overdue tab
    const overdueTab = screen.getByRole('tab', { name: /overdue/i })
    fireEvent.click(overdueTab)

    // Overdue books should be visible but without Borrow button
    expect(screen.getByText('1984')).toBeInTheDocument()
    // No borrow button should be present for overdue books
    const borrowButtons = screen.queryAllByRole('button', { name: /borrow/i })
    expect(borrowButtons.length).toBe(0)
  })

  it('should show appropriate message for overdue books', () => {
    render(<DashboardPage />)
    // Switch to overdue tab
    const overdueTab = screen.getByRole('tab', { name: /overdue/i })
    fireEvent.click(overdueTab)

    // Should display message that book is overdue
    expect(screen.getByText(/overdue/i)).toBeInTheDocument()
  })

  it('should still show Borrow button for available books', () => {
    render(<DashboardPage />)
    const availableTab = screen.getByRole('tab', { name: /available/i })
    fireEvent.click(availableTab)

    const borrowButtons = screen.getAllByRole('button', { name: /borrow/i })
    expect(borrowButtons.length).toBeGreaterThan(0)
  })
})
