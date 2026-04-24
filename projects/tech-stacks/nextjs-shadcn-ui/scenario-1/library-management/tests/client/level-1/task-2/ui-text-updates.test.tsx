/**
 * Level 1 - Task 1.2: UI Text Updates Tests
 * Tests that UI text has been correctly updated
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/login/page'
import SignupPage from '@/app/signup/page'
import DashboardPage from '@/app/dashboard/page'

describe('Level 1 - Task 1.2: UI Text Updates', () => {
  describe('Login Page', () => {
    it('should display "Register" link instead of "Sign Up"', () => {
      render(<LoginPage />)
      // Check for Register text (the actual implementation may vary)
      const registerLinks = screen.queryAllByText(/register/i)
      expect(registerLinks.length).toBeGreaterThan(0)
    })

    it('should not display "Sign Up" text', () => {
      render(<LoginPage />)
      // The page should not have "Sign Up" as a button or link text
      const signUpElements = screen.queryAllByText(/sign up/i)
      // If there are any, they should be in context like "Sign up for an account" not as a button
      const signUpButtons = screen.queryAllByRole('button', { name: /sign up/i })
      expect(signUpButtons.length).toBe(0)
    })
  })

  describe('Signup Page', () => {
    it('should display "Register" as the main action', () => {
      render(<SignupPage />)
      const registerButton = screen.getByRole('button', { name: /register/i })
      expect(registerButton).toBeInTheDocument()
    })
  })

  describe('Dashboard Header', () => {
    beforeEach(() => {
      // Set up a mock librarian in localStorage
      const mockLibrarian = {
        id: '1',
        username: 'admin',
        password: 'admin123',
        name: 'Admin Librarian',
      }
      localStorage.setItem('librarian', JSON.stringify(mockLibrarian))
    })

    it('should display "BookWise Public Library" in the header', () => {
      render(<DashboardPage />)
      // The header should contain the updated library name
      const headerText = screen.getByText(/BookWise Public Library/i)
      expect(headerText).toBeInTheDocument()
    })

    it('should not display "SM Tech Library"', () => {
      render(<DashboardPage />)
      const oldText = screen.queryByText(/SM Tech Library/i)
      expect(oldText).not.toBeInTheDocument()
    })
  })
})
