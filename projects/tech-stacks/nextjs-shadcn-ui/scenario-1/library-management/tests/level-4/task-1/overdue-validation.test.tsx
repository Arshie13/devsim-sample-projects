/**
 * Level 4 - Task 4.1: Prevent Borrowing Overdue Books with shadcn Alert
 * Tests that overdue books show shadcn Alert warnings and Borrow buttons are disabled
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'
import { mockBooks } from '@/lib/mockData'
import { join, resolve } from 'path'
import fs from 'fs'

describe('Level 4 - Task 4.1: Overdue Book Validation with shadcn Alert', () => {
  beforeEach(() => {
    const mockLibrarian = {
      id: '1',
      username: 'admin',
      password: 'admin123',
      name: 'Admin Librarian',
    }
    localStorage.setItem('librarian', JSON.stringify(mockLibrarian))
  })

  it('should show shadcn Alert for overdue books in overdue tab', () => {
    render(<DashboardPage />)

    // Switch to overdue tab
    const overdueTab = screen.getByRole('tab', { name: /overdue/i })
    fireEvent.click(overdueTab)

    // Should show Alert for overdue books
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()

    // Uses destructive variant for overdue warning
    expect(alert).toHaveClass('border-l-4')
    expect(alert).toHaveClass('border-red-500')
    expect(alert).toHaveClass('bg-red-50')
    expect(alert).toHaveClass('text-red-900')

    // AlertTitle should be present
    const title = screen.getByRole('heading', { level: 5 })
    expect(title).toBeInTheDocument()
    expect(title.textContent).toMatch(/overdue/i)
  })

  it('should disable Borrow button for overdue books', () => {
    render(<DashboardPage />)

    // Switch to overdue tab
    const overdueTab = screen.getByRole('tab', { name: /overdue/i })
    fireEvent.click(overdueTab)

    // Overdue books should not have Borrow button
    const overdueBook = mockBooks.find(book => book.status === 'overdue')
    if (overdueBook) {
      expect(screen.getByText(overdueBook.title)).toBeInTheDocument()
    }

    // No borrow button should be present for overdue books
    const borrowButtons = screen.queryAllByRole('button', { name: /borrow/i })
    expect(borrowButtons.length).toBe(0)
  })

  it('should show overdue badge on overdue books', () => {
    render(<DashboardPage />)
    const overdueTab = screen.getByRole('tab', { name: /overdue/i })
    fireEvent.click(overdueTab)

    expect(screen.getAllByText(/overdue/i).length).toBeGreaterThan(0)
  })

  it('should still show Borrow button for available books', () => {
    render(<DashboardPage />)
    const availableTab = screen.getByRole('tab', { name: /all books/i })
    fireEvent.click(availableTab)

    const borrowButtons = screen.getAllByRole('button', { name: /borrow/i })
    const expectedAvailableBooks = mockBooks.filter(book => book.status === 'available').length
    expect(borrowButtons.length).toBe(expectedAvailableBooks)
  })

  it('should import Alert from @/components/ui/alert in dashboard page', () => {
    const dashboardPath = join(
      process.cwd(),
      'src',
      'app',
      'dashboard',
      'page.tsx'
    )
    expect(fs.existsSync(dashboardPath)).toBe(true)
    const source = fs.readFileSync(dashboardPath, 'utf-8')
    expect(source).toMatch(/from\s+['"]@\/components\/ui\/alert['"]/)
    expect(source).toMatch(/Alert(?:Title|Description)?/)
  })
})