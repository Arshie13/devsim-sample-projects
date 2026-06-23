/**
 * Level 2 - Task 2.1: Bug Fix – Status Badge Color Logic
 * Tests that badge colors are distinct for each book status
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'

describe('Level 2 - Task 2.1: Status Badge Colors', () => {
  beforeEach(() => {
    const mockLibrarian = {
      id: '1',
      username: 'admin',
      password: 'admin123',
      name: 'Admin Librarian',
    }
    localStorage.setItem('librarian', JSON.stringify(mockLibrarian))
  })

  it('should display "available" books with a green badge', () => {
    render(<DashboardPage />)
    // Find all available status badges (scoped to table cells so the
    // "Available" stats-card label and tab labels are not matched)
    const availableBadges = screen
      .getAllByText(/available/i)
      .filter((el: HTMLElement) => el.closest('td'))
    expect(availableBadges.length).toBeGreaterThan(0)
    // Check that they have the correct variant class (green)
    availableBadges.forEach((badge: HTMLElement) => {
      expect(badge).toHaveClass('bg-green-100', 'text-green-800')
    })
  })

  it('should display "borrowed" books with a blue badge', () => {
    render(<DashboardPage />)
    const borrowedBadges = screen
      .getAllByText(/borrowed/i)
      .filter((el: HTMLElement) => el.closest('td'))
    expect(borrowedBadges.length).toBeGreaterThan(0)
    borrowedBadges.forEach((badge: HTMLElement) => {
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800')
    })
  })

  it('should display "overdue" books with a red badge', () => {
    render(<DashboardPage />)
    const overdueBadges = screen
      .getAllByText(/overdue/i)
      .filter((el: HTMLElement) => el.closest('td'))
    expect(overdueBadges.length).toBeGreaterThan(0)
    overdueBadges.forEach((badge: HTMLElement) => {
      expect(badge).toHaveClass('bg-red-100', 'text-red-800')
    })
  })
})
