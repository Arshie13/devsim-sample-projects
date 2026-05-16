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

// NOTE: Date utilities (formatDate / isOverdue) are intentionally NOT defined
// here. They are a candidate deliverable — Level 5 Task 5.2 tests import them
// from '@/lib/dateUtils' so the candidate's own implementation is exercised.
