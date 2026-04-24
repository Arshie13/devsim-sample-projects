/**
 * Level 4 - Task 4.2: Confirmation Dialogs & localStorage Persistence
 * Tests that confirmation dialogs appear and data persists
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'
import ReturnsPage from '@/app/returns/page'

describe('Level 4 - Task 4.2: Confirmation & Persistence', () => {
  describe('Confirmation Dialogs', () => {
    beforeEach(() => {
      const mockLibrarian = {
        id: '1',
        username: 'admin',
        password: 'admin123',
        name: 'Admin Librarian',
      }
      localStorage.setItem('librarian', JSON.stringify(mockLibrarian))
    })

    it('should show confirmation dialog before borrowing a book', () => {
      render(<DashboardPage />)
      const borrowButton = screen.getAllByRole('button', { name: /borrow/i })[0]
      fireEvent.click(borrowButton)
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
    })

    it('should show confirmation dialog before returning a book', () => {
      render(<ReturnsPage />)
      const returnButton = screen.getAllByRole('button', { name: /return/i })[0]
      fireEvent.click(returnButton)
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    })

    it('should close dialog when Cancel is clicked', () => {
      render(<DashboardPage />)
      const borrowButton = screen.getAllByRole('button', { name: /borrow/i })[0]
      fireEvent.click(borrowButton)
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument()
    })
  })

  describe('localStorage Persistence', () => {
    beforeEach(() => {
      const mockLibrarian = {
        id: '1',
        username: 'admin',
        password: 'admin123',
        name: 'Admin Librarian',
      }
      localStorage.setItem('librarian', JSON.stringify(mockLibrarian))
    })

    it('should persist books state to localStorage after borrow', async () => {
      render(<DashboardPage />)
      const borrowButton = screen.getAllByRole('button', { name: /borrow/i })[0]
      fireEvent.click(borrowButton)

      const nameInput = screen.getByLabelText(/borrower name/i)
      const emailInput = screen.getByLabelText(/borrower email/i)
      fireEvent.change(nameInput, { target: { value: 'Test' } })
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

      await waitFor(() => {
        const savedBooks = localStorage.getItem('books')
        expect(savedBooks).not.toBeNull()
      })
    })

    it('should load books from localStorage on mount', () => {
      const books = [{ id: '1', title: 'Test Book', author: 'Test', isbn: '123', status: 'available' }]
      localStorage.setItem('books', JSON.stringify(books))
      render(<DashboardPage />)
      expect(screen.getByText('Test Book')).toBeInTheDocument()
    })

    it('should clear librarian on logout', async () => {
      render(<DashboardPage />)
      fireEvent.click(screen.getByRole('button', { name: /logout/i }))
      expect(localStorage.getItem('librarian')).toBeNull()
    })
  })
})
