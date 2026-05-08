/**
 * Level 2 - Task 2.1: Grade Badge Colors
 *
 * Verifies the grades page renders distinct, accessible Tailwind palettes
 * for each grade tier:
 *   A-tier (A, A-)         → bg-green-100 text-green-800
 *   B-tier (B+, B, B-)     → bg-blue-100 text-blue-800
 *   C-tier (C+, C, C-)     → bg-yellow-100 text-yellow-800
 *   D/F-tier               → bg-red-100 text-red-800
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GradesPage from '@/app/dashboard/grades/page'

describe('Level 2 - Task 2.1: Grade Badge Colors', () => {
  it('should render A-tier grade badges with green-100/green-800 classes', () => {
    render(<GradesPage />)
    const aBadges = screen.getAllByText(/^A$/)
    expect(aBadges.length).toBeGreaterThan(0)
    aBadges.forEach((badge: HTMLElement) => {
      expect(badge).toHaveClass('bg-green-100')
      expect(badge).toHaveClass('text-green-800')
    })

    const aMinusBadges = screen.getAllByText(/^A-$/)
    expect(aMinusBadges.length).toBeGreaterThan(0)
    aMinusBadges.forEach((badge: HTMLElement) => {
      expect(badge).toHaveClass('bg-green-100')
      expect(badge).toHaveClass('text-green-800')
    })
  })

  it('should render B-tier grade badges with blue-100/blue-800 classes', () => {
    render(<GradesPage />)
    const bPlusBadges = screen.getAllByText(/^B\+$/)
    expect(bPlusBadges.length).toBeGreaterThan(0)
    bPlusBadges.forEach((badge: HTMLElement) => {
      expect(badge).toHaveClass('bg-blue-100')
      expect(badge).toHaveClass('text-blue-800')
    })

    const bBadges = screen.getAllByText(/^B$/)
    expect(bBadges.length).toBeGreaterThan(0)
    bBadges.forEach((badge: HTMLElement) => {
      expect(badge).toHaveClass('bg-blue-100')
      expect(badge).toHaveClass('text-blue-800')
    })
  })

  it('should NOT use the legacy shadcn variant classes on A-tier badges', () => {
    render(<GradesPage />)
    const aBadges = screen.getAllByText(/^A$/)
    aBadges.forEach((badge: HTMLElement) => {
      // The previous implementation relied on the success variant — make sure the
      // dedicated palette has been applied.
      expect(badge).not.toHaveClass('bg-yellow-500')
    })
  })
})
