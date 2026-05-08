/**
 * Level 1 - Task 1.2: UI Text Updates
 *
 * Tests that branding strings have been replaced with environment variable
 * values, and that button labels match the spec.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/login/page'
import DashboardLayout from '@/app/dashboard/layout'
import FeesPage from '@/app/dashboard/fees/page'

describe('Level 1 - Task 1.2: UI Text Updates', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SCHOOL_NAME = 'Riverside University'
    process.env.NEXT_PUBLIC_REGISTRAR_EMAIL = 'registrar@riverside.edu'
    process.env.NEXT_PUBLIC_ACADEMIC_YEAR = '2025-2026'
  })

  describe('Login Page', () => {
    it('should display "Log In" instead of "Sign In" on the submit button', () => {
      render(<LoginPage />)
      const loginButton = screen.getByRole('button', { name: /^log in$/i })
      expect(loginButton).toBeInTheDocument()
    })

    it('should NOT display the legacy "Sign In" button text', () => {
      render(<LoginPage />)
      const signInButtons = screen.queryAllByRole('button', { name: /^sign in$/i })
      expect(signInButtons.length).toBe(0)
    })

    it('should display the updated card description "Log in to access your academic information"', () => {
      render(<LoginPage />)
      expect(screen.getByText(/log in to access your academic information/i)).toBeInTheDocument()
    })

    it('should display the school name from NEXT_PUBLIC_SCHOOL_NAME', () => {
      render(<LoginPage />)
      const heading = screen.getByRole('heading', { level: 1, name: /riverside university/i })
      expect(heading).toBeInTheDocument()
    })
  })

  describe('Dashboard Layout', () => {
    it('should render the school name from NEXT_PUBLIC_SCHOOL_NAME in the header', () => {
      render(
        <DashboardLayout>
          <div>child content</div>
        </DashboardLayout>
      )
      // The brand label should reflect the env value, not the hard-coded "Student Portal"
      expect(screen.getByText(/riverside university/i)).toBeInTheDocument()
    })
  })

  describe('Fees Page', () => {
    it('should reflect NEXT_PUBLIC_ACADEMIC_YEAR in the total fees subtitle', () => {
      render(<FeesPage />)
      // Subtitle should read "Academic Year 2025-2026" sourced from env
      const academicYearLabels = screen.getAllByText(/academic year\s+2025-2026/i)
      expect(academicYearLabels.length).toBeGreaterThan(0)
    })
  })
})
