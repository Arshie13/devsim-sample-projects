/**
 * Level 1 - Task 1.2: UI Text Updates
 *
 * Tests that branding strings have been replaced with environment variable
 * values, and that button labels match the spec.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'
import AgentLogin from '@/app/agent/login/page'
import SupportPage from '@/app/support/page'

describe('Level 1 - Task 1.2: UI Text Updates', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_NAME = 'City Hall Support'
    process.env.NEXT_PUBLIC_SUPPORT_PHONE = '(555) 123-4567'
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL = 'support@cityhall.gov'
  })

  describe('Home Page', () => {
    it('should render the heading from NEXT_PUBLIC_APP_NAME', () => {
      render(<HomePage />)
      const heading = screen.getByRole('heading', { level: 1, name: /city hall support/i })
      expect(heading).toBeInTheDocument()
    })

    it('should render footer phone and email from environment variables', () => {
      render(<HomePage />)
      const footerLine = screen.getByText(/\(555\) 123-4567/)
      expect(footerLine).toBeInTheDocument()
      expect(footerLine.textContent).toContain('support@cityhall.gov')
    })
  })

  describe('Agent Login Page', () => {
    it('should display "Login" instead of "Sign In" on the submit button', () => {
      render(<AgentLogin />)
      const loginButton = screen.getByRole('button', { name: /^login$/i })
      expect(loginButton).toBeInTheDocument()
    })

    it('should NOT display the legacy "Sign In" button text', () => {
      render(<AgentLogin />)
      const signInButtons = screen.queryAllByRole('button', { name: /^sign in$/i })
      expect(signInButtons.length).toBe(0)
    })
  })

  describe('Support Page', () => {
    it('should label the header logout button as "Logout"', () => {
      render(<SupportPage />)
      const logoutButton = screen.getByRole('button', { name: /^logout$/i })
      expect(logoutButton).toBeInTheDocument()
    })

    it('should NOT display the legacy "Return to menu" label', () => {
      render(<SupportPage />)
      const returnButtons = screen.queryAllByRole('button', { name: /return to menu/i })
      expect(returnButtons.length).toBe(0)
    })
  })
})
