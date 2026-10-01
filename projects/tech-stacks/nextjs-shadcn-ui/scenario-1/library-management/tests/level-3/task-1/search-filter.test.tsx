/**
 * Level 3 - Task 3.1: Add Book Search & Filter with shadcn Input
 * Tests that search functionality uses shadcn/ui Input component
 * and filters books correctly
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'
import { mockBooks } from '@/lib/mockData'
import { join, resolve } from 'path'
import fs from 'fs'

describe('Level 3 - Task 3.1: Book Search & Filter with shadcn Input', () => {
  beforeEach(() => {
    const mockLibrarian = {
      id: '1',
      username: 'admin',
      password: 'admin123',
      name: 'Admin Librarian',
    }
    localStorage.setItem('librarian', JSON.stringify(mockLibrarian))
  })

  it('should use shadcn Input component for search', () => {
    render(<DashboardPage />)

    const searchInput = screen.getByPlaceholderText(/search books/i)
    expect(searchInput).toBeInTheDocument()

    // Input should have shadcn Input classes
    expect(searchInput).toHaveClass('h-10')
    expect(searchInput).toHaveClass('px-3')
    expect(searchInput).toHaveClass('rounded-md')
    expect(searchInput).toHaveClass('border')
    expect(searchInput).toHaveClass('focus:outline-none')
    expect(searchInput).toHaveClass('focus:ring-2')
  })

  it('should import Input from @/components/ui/input in dashboard', () => {
    const dashboardPath = join(
      process.cwd(),
      'src',
      'app',
      'dashboard',
      'page.tsx'
    )
    expect(fs.existsSync(dashboardPath)).toBe(true)
    const source = fs.readFileSync(dashboardPath, 'utf-8')
    expect(source).toMatch(/from\s+['"]@\/components\/ui\/input['"]/)
  })

  it('should filter books by title when searching', () => {
    render(<DashboardPage />)
    const searchInput = screen.getByPlaceholderText(/search books/i)

    const bookToSearch = mockBooks.find(book => book.title.includes('Gatsby')) || mockBooks[0]
    const searchTerm = bookToSearch.title.split(' ')[0]

    fireEvent.change(searchInput, { target: { value: searchTerm } })

    expect(screen.getByText(bookToSearch.title)).toBeInTheDocument()

    const otherBook = mockBooks.find(book => book.id !== bookToSearch.id)
    if (otherBook && !otherBook.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      expect(screen.queryByText(otherBook.title)).not.toBeInTheDocument()
    }
  })

  it('should filter books by author when searching', () => {
    render(<DashboardPage />)
    const searchInput = screen.getByPlaceholderText(/search books/i)

    const orwellBooks = mockBooks.filter(book => book.author.includes('Orwell'))
    if (orwellBooks.length > 0) {
      fireEvent.change(searchInput, { target: { value: 'Orwell' } })

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

    mockBooks.forEach(book => {
      expect(screen.getByText(book.title)).toBeInTheDocument()
    })
  })
})