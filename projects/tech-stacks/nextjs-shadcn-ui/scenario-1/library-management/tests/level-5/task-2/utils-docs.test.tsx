/**
 * Level 5 - Task 5.2: Date Utilities & Dialog Component
 * Tests for date utility functions and shadcn/ui Dialog component usage
 *
 * This task uses the Dialog component installed in Level 1.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { formatDate, isOverdue } from '@/lib/dateUtils'
import { render, screen, fireEvent } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'
import { join, resolve } from 'path'
import fs from 'fs'

describe('Level 5 - Task 5.2: Utilities & Dialog Component', () => {
  describe('Date Utilities', () => {
    it('should format date string to readable format', () => {
      const formatted = formatDate('2026-01-15')
      expect(formatted).toBe('Jan 15, 2026')
    })

    it('should return false for invalid dates', () => {
      expect(formatDate('invalid')).toBe('')
      expect(formatDate('')).toBe('')
    })

    it('should identify overdue dates', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      expect(isOverdue(pastDate)).toBe(true)
    })

    it('should identify non-overdue dates', () => {
      const futureDate = new Date(Date.now() + 1209600000).toISOString().split('T')[0]
      expect(isOverdue(futureDate)).toBe(false)
    })

    it('should handle invalid date strings gracefully', () => {
      expect(isOverdue('invalid')).toBe(false)
      expect(isOverdue('')).toBe(false)
    })
  })

  describe('shadcn/ui Dialog Component (installed in Level 1)', () => {
    beforeEach(() => {
      const mockLibrarian = {
        id: '1',
        username: 'admin',
        password: 'admin123',
        name: 'Admin Librarian',
      }
      localStorage.setItem('librarian', JSON.stringify(mockLibrarian))
    })

    it('should use the Dialog component installed in Level 1', () => {
      const dialogPath = join(
        process.cwd(),
        'src',
        'components',
        'ui',
        'dialog.tsx'
      )
      expect(fs.existsSync(dialogPath)).toBe(true)
      const content = fs.readFileSync(dialogPath, 'utf-8')
      expect(content).toMatch(/\bDialog\b/)
      expect(content).toMatch(/\bDialogTrigger\b/)
      expect(content).toMatch(/\bDialogContent\b/)
      expect(content).toMatch(/\bDialogHeader\b/)
      expect(content).toMatch(/\bDialogTitle\b/)
      expect(content).toMatch(/\bDialogDescription\b/)
    })

    it('should render a Dialog for book details on the dashboard', () => {
      render(<DashboardPage />)

      // Click on a book row to open the dialog
      const firstBookRow = screen.getByRole('row', { name: /book/i })
      fireEvent.click(firstBookRow)

      // Dialog should open
      const dialogContent = screen.getByRole('dialog')
      expect(dialogContent).toBeInTheDocument()

      // Dialog should have title
      const dialogTitle = screen.getByRole('heading', { level: 2 })
      expect(dialogTitle).toBeInTheDocument()
      expect(dialogTitle.textContent).toMatch(/book details/i)

      // Dialog should have close button
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()
    })

    it('should import Dialog from @/components/ui/dialog in dashboard page', () => {
      const dashboardPath = join(
        process.cwd(),
        'src',
        'app',
        'dashboard',
        'page.tsx'
      )
      expect(fs.existsSync(dashboardPath)).toBe(true)
      const source = fs.readFileSync(dashboardPath, 'utf-8')
      expect(source).toMatch(/from\s+['"]@\/components\/ui\/dialog['"]/)
      expect(source).toMatch(/Dialog(?:Trigger|Content|Header|Title|Description)?/)
    })
  })
})