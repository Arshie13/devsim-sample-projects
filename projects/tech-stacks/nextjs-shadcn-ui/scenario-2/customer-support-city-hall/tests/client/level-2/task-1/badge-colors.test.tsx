/**
 * Level 2 - Task 2.1: Conversation Status Badge Colors
 *
 * Verifies the agent dashboard renders distinct, accessible Tailwind palettes
 * for each conversation status:
 *   active   → bg-green-100 text-green-800
 *   waiting  → bg-yellow-100 text-yellow-800
 *   resolved → bg-gray-100 text-gray-800
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AgentPage from '@/app/agent/page'

describe('Level 2 - Task 2.1: Status Badge Colors', () => {
  it('should render the "Active" badge with green-100/green-800 classes', () => {
    render(<AgentPage />)
    const activeBadges = screen.getAllByText(/^active$/i)
    expect(activeBadges.length).toBeGreaterThan(0)
    activeBadges.forEach((badge: HTMLElement) => {
      expect(badge).toHaveClass('bg-green-100')
      expect(badge).toHaveClass('text-green-800')
    })
  })

  it('should render the "Waiting" badge with yellow-100/yellow-800 classes', () => {
    render(<AgentPage />)
    const waitingBadges = screen.getAllByText(/^waiting$/i)
    expect(waitingBadges.length).toBeGreaterThan(0)
    waitingBadges.forEach((badge: HTMLElement) => {
      expect(badge).toHaveClass('bg-yellow-100')
      expect(badge).toHaveClass('text-yellow-800')
    })
  })

  it('should render the "Resolved" badge with gray-100/gray-800 classes', () => {
    render(<AgentPage />)
    const resolvedBadges = screen.getAllByText(/^resolved$/i)
    expect(resolvedBadges.length).toBeGreaterThan(0)
    resolvedBadges.forEach((badge: HTMLElement) => {
      expect(badge).toHaveClass('bg-gray-100')
      expect(badge).toHaveClass('text-gray-800')
    })
  })

  it('should NOT use the legacy bg-yellow-500 class on the waiting badge', () => {
    render(<AgentPage />)
    const waitingBadges = screen.getAllByText(/^waiting$/i)
    waitingBadges.forEach((badge: HTMLElement) => {
      expect(badge).not.toHaveClass('bg-yellow-500')
    })
  })
})
