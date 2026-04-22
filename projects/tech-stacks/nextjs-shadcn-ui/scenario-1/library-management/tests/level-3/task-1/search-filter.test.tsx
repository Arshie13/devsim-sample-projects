/**
 * Level 3 - Task 3.1: Add Book Search & Filter
 * Tests that search functionality filters books correctly
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'

describe('Level 3 - Task 3.1: Book Search & Filter', () => {
  beforeEach(() => {
    const mockLibrarian = {
      id: '1',
      username: 'admin',
      password: 'admin123',
      name: 'Admin Librarian',
    }
    localStorage.setItem('librarian', JSON.stringify(mockLibrarian))
  })

  it('should render a search input field', () => {
    render(<DashboardPage />)
    const searchInput = screen.getByPlaceholderText(/search books/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('should filter books by title when searching', () => {
    render(<DashboardPage />)
    const searchInput = screen.getByPlaceholderText(/search books/i)

    // Type "Gatsby" in the search field
    fireEvent.change(searchInput, { target: { value: 'Gatsby' } })

    // Should show The Great Gatsby
    expect(screen.getByText('The Great Gatsby')).toBeInTheDocument()
    // Should not show other books
    expect(screen.queryByText('1984')).not.toBeInTheDocument()
  })

  it('should filter books by author when searching', () => {
    render(<DashboardPage />)
    const searchInput = screen.getByPlaceholderText(/search books/i)

    // Type "Orwell" in the search field
    fireEvent.change(searchInput, { target: { value: 'Orwell' } })

    // Should show books by George Orwell
    expect(screen.getByText('1984')).toBeInTheDocument()
    expect(screen.getByText('Animal Farm')).toBeInTheDocument()
  })

  it('should be case-insensitive', () => {
    render(<DashboardPage />)
    const searchInput = screen.getByPlaceholderText(/search books/i)

    fireEvent.change(searchInput, { target: { value: 'gatsby' } })
    expect(screen.getByText('The Great Gatsby')).toBeInTheDocument()
  })

  it('should show "No books found" when search yields no results', () => {
    render(<DashboardPage />)
    const searchInput = screen.getByPlaceholderText(/search books/i)

    fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } })
    expect(screen.getByText(/no books found/i)).toBeInTheDocument()
  })

  it('should show all books when search is empty', () => {
    render(<DashboardPage />)
    const searchInput = screen.getByPlaceholderText(/search books/i)

    // Initially all books should be visible
    expect(screen.getByText('The Great Gatsby')).toBeInTheDocument()
    expect(screen.getByText('1984')).toBeInTheDocument()
  })
})
