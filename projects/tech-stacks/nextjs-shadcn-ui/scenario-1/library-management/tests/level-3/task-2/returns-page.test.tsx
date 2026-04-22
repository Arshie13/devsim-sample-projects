/**
 * Level 3 - Task 3.2: Returns Page
 * Tests that returns page exists and processes returns correctly
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReturnsPage from '@/app/returns/page'

describe('Level 3 - Task 3.2: Returns Page', () => {
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
    expect(screen.getByText(/book title/i)).toBeInTheDocument()
  })

  it('should display all currently borrowed books', () => {
    render(<ReturnsPage />)
    expect(screen.getByText('To Kill a Mockingbird')).toBeInTheDocument()
  })

  it('should have a Return button for each borrowed book', () => {
    render(<ReturnsPage />)
    const returnButtons = screen.getAllByRole('button', { name: /return/i })
    expect(returnButtons.length).toBeGreaterThan(0)
  })

  it('should show confirmation dialog when Return button is clicked', () => {
    render(<ReturnsPage />)
    const returnButton = screen.getAllByRole('button', { name: /return/i })[0]
    fireEvent.click(returnButton)
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
  })

  it('should process return and update book status to available', async () => {
    render(<ReturnsPage />)
    const returnButton = screen.getAllByRole('button', { name: /return/i })[0]
    fireEvent.click(returnButton)
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

    await waitFor(() => {
      expect(screen.queryByText('To Kill a Mockingbird')).not.toBeInTheDocument()
    })
  })
})
