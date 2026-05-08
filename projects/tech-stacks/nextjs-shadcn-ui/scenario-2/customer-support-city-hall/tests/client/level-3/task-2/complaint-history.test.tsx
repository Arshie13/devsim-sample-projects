/**
 * Level 3 - Task 3.2: Citizen Complaint History Page
 *
 * Verifies:
 *   - The /support/history route exists and renders past complaints from
 *     localStorage key "customerComplaints"
 *   - Submitting the support form persists a new entry
 *   - The support page links to the history page
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { mockComplaintHistory } from '../../../utils/render-utils'

describe('Level 3 - Task 3.2: Complaint History Page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render entries from localStorage "customerComplaints"', async () => {
    localStorage.setItem('customerComplaints', JSON.stringify(mockComplaintHistory))

    const HistoryPage = (await import('@/app/support/history/page')).default
    render(<HistoryPage />)

    expect(screen.getAllByText(/jane tester/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/streetlight on my block has been out/i)).toBeInTheDocument()
    expect(screen.getByText(/followup on the streetlight repair request/i)).toBeInTheDocument()
  })

  it('should show an empty-state message when no complaints exist', async () => {
    const HistoryPage = (await import('@/app/support/history/page')).default
    render(<HistoryPage />)

    expect(screen.getByText(/no complaints submitted yet/i)).toBeInTheDocument()
  })

  it('should display the city + ZIP for each complaint', async () => {
    localStorage.setItem('customerComplaints', JSON.stringify(mockComplaintHistory))

    const HistoryPage = (await import('@/app/support/history/page')).default
    render(<HistoryPage />)

    expect(screen.getAllByText(/springfield/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/12345/).length).toBeGreaterThan(0)
  })
})

describe('Level 3 - Task 3.2: Support Page Links to History', () => {
  it('should expose a "View History" affordance on the support page', async () => {
    const SupportPage = (await import('@/app/support/page')).default
    render(<SupportPage />)

    const historyAffordance =
      screen.queryByRole('link', { name: /view history/i }) ??
      screen.queryByRole('button', { name: /view history/i })

    expect(historyAffordance).not.toBeNull()
  })
})

describe('Level 3 - Task 3.2: Persisting Form Submissions', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should persist a new entry to "customerComplaints" when the form is submitted', async () => {
    const SupportPage = (await import('@/app/support/page')).default
    render(<SupportPage />)

    fireEvent.click(screen.getByRole('button', { name: /talk to agent/i }))

    fireEvent.change(screen.getByPlaceholderText(/enter your full name/i), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByPlaceholderText(/enter your address/i), {
      target: { value: '123 Test St' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^city$/i), {
      target: { value: 'Springfield' },
    })
    fireEvent.change(screen.getByPlaceholderText(/zip code/i), {
      target: { value: '12345' },
    })
    fireEvent.change(screen.getByPlaceholderText(/describe your issue/i), {
      target: { value: 'My streetlight has been broken for over two weeks now.' },
    })

    fireEvent.click(screen.getByRole('button', { name: /submit request/i }))

    await waitFor(() => {
      const stored = localStorage.getItem('customerComplaints')
      expect(stored).not.toBeNull()
      const parsed = JSON.parse(stored as string)
      expect(parsed.length).toBeGreaterThan(0)
      const last = parsed[parsed.length - 1]
      expect(last.fullName).toBe('Test User')
      expect(last.zipCode).toBe('12345')
      expect(typeof last.submittedAt).toBe('string')
    })
  })
})
