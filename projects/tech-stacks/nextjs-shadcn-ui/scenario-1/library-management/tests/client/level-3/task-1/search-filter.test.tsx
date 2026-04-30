/**
 * Level 3 - Task 3.1: Add Book Search & Filter
 * Tests that search functionality filters books correctly
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'
import { mockBooks } from '@/lib/mockData'

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

    // Find a book to search for
    const bookToSearch = mockBooks.find(book => book.title.includes('Gatsby')) || mockBooks[0]
    const searchTerm = bookToSearch.title.split(' ')[0] // Use first word of title

    // Type search term in the search field
    fireEvent.change(searchInput, { target: { value: searchTerm } })

    // Should show the searched book
    expect(screen.getByText(bookToSearch.title)).toBeInTheDocument()

    // Should not show other books (assuming search works correctly)
    const otherBook = mockBooks.find(book => book.id !== bookToSearch.id)
    if (otherBook && !otherBook.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      expect(screen.queryByText(otherBook.title)).not.toBeInTheDocument()
    }
  })

  it('should filter books by author when searching', () => {
    render(<DashboardPage />)
    const searchInput = screen.getByPlaceholderText(/search books/i)

    // Find books by the same author
    const orwellBooks = mockBooks.filter(book => book.author.includes('Orwell'))
    if (orwellBooks.length > 0) {
      fireEvent.change(searchInput, { target: { value: 'Orwell' } })

      // Should show books by George Orwell
      orwellBooks.forEach(book => {
        expect(screen.getByText(book.title)).toBeInTheDocument()
      })
    }
  })

  it('should be case-insensitive', () => {
    render(<DashboardPage />)
    const searchInput = screen.getByPlaceholderText(/search books/i)

    const bookToSearch = mockBooks.find(book => book.title.includes('Gatsby')) || mockBooks[0]
    const searchTerm = bookToSearch.title.split(' ')[0].toLowerCase()

    fireEvent.change(searchInput, { target: { value: searchTerm } })
    expect(screen.getByText(bookToSearch.title)).toBeInTheDocument()
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
    mockBooks.forEach(book => {
      expect(screen.getByText(book.title)).toBeInTheDocument()
    })
  })
})
