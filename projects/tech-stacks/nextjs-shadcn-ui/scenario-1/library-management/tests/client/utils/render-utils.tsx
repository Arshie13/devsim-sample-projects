/**
 * Test utilities for rendering components with proper providers and mocks
 */

import { ReactElement, ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Custom render wrapper that includes any necessary providers
interface WrapperProps {
  children: ReactNode
}

function AllTheProviders({ children }: WrapperProps) {
  return <>{children}</>
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: AllTheProviders,
    ...options,
  })
}

// Re-export everything from testing library
export * from '@testing-library/react'

// Override render
export { customRender as render }

// Helper to set up mock librarian in localStorage
export function setupMockLibrarian(librarian = {
  id: '1',
  username: 'admin',
  password: 'admin123',
  name: 'Admin Librarian',
}) {
  beforeEach(() => {
    localStorage.setItem('librarian', JSON.stringify(librarian))
  })
}

// Helper to set up mock books in localStorage
export function setupMockBooks(books: Array<Record<string, unknown>>) {
  beforeEach(() => {
    localStorage.setItem('books', JSON.stringify(books))
  })
}

// Helper to wait for UI updates
export async function waitForLoadingToFinish() {
  // Wait for any pending promises or state updates
  await new Promise(resolve => setTimeout(resolve, 0))
}

// Common test data
export const mockLibrarian = {
  id: '1',
  username: 'admin',
  password: 'admin123',
  name: 'Admin Librarian',
}

export const mockAvailableBook = {
  id: '1',
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  isbn: '978-0-7432-7356-5',
  status: 'available' as const,
}

export const mockBorrowedBook = {
  id: '2',
  title: 'To Kill a Mockingbird',
  author: 'Harper Lee',
  isbn: '978-0-06-112008-4',
  status: 'borrowed' as const,
  borrowedBy: 'John Smith',
  borrowedDate: '2026-01-15',
  dueDate: '2026-01-29',
}

export const mockOverdueBook = {
  id: '3',
  title: '1984',
  author: 'George Orwell',
  isbn: '978-0-452-28423-4',
  status: 'overdue' as const,
  borrowedBy: 'Jane Doe',
  borrowedDate: '2026-01-01',
  dueDate: '2026-01-15',
}

/**
 * Formats a date string (YYYY-MM-DD) to a readable format (Mon DD, YYYY)
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string or empty string if invalid
 */
export function formatDate(dateString: string): string {
  if (!dateString || typeof dateString !== 'string') {
    return ''
  }

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return ''
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }

    return date.toLocaleDateString('en-US', options)
  } catch {
    return ''
  }
}

/**
 * Checks if a date string represents an overdue date (in the past)
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns true if the date is in the past, false otherwise
 */
export function isOverdue(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') {
    return false
  }

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return false
    }

    // Set time to end of day to avoid timezone issues
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return endOfDay < today
  } catch {
    return false
  }
}
