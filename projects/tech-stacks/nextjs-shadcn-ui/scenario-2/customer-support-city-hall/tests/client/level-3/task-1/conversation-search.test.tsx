/**
 * Level 3 - Task 3.1: Conversation Search & Status Filter
 *
 * Verifies:
 *   - A search input above the conversations list filters by name OR complaint
 *   - Status filter chips (All / Active / Waiting / Resolved) work alongside search
 *   - "No conversations found" appears when filters yield zero results
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AgentPage from '@/app/agent/page'

describe('Level 3 - Task 3.1: Conversation Search', () => {
  it('should render a search input with the conversation placeholder', () => {
    render(<AgentPage />)
    const searchInput = screen.getByPlaceholderText(/search conversations/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('should filter conversations by customer full name (case-insensitive)', () => {
    render(<AgentPage />)
    const searchInput = screen.getByPlaceholderText(/search conversations/i)

    fireEvent.change(searchInput, { target: { value: 'maria' } })

    expect(screen.getByText(/maria garcia/i)).toBeInTheDocument()
    expect(screen.queryByText(/john smith/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/robert johnson/i)).not.toBeInTheDocument()
  })

  it('should filter conversations by complaint text (case-insensitive)', () => {
    render(<AgentPage />)
    const searchInput = screen.getByPlaceholderText(/search conversations/i)

    fireEvent.change(searchInput, { target: { value: 'permit' } })

    // Maria's complaint mentions a business permit
    expect(screen.getByText(/maria garcia/i)).toBeInTheDocument()
    // John's complaint is about trash, should not match
    expect(screen.queryByText(/john smith/i)).not.toBeInTheDocument()
  })

  it('should show "No conversations found" when search yields no matches', () => {
    render(<AgentPage />)
    const searchInput = screen.getByPlaceholderText(/search conversations/i)

    fireEvent.change(searchInput, { target: { value: 'zzz-no-such-customer' } })

    expect(screen.getByText(/no conversations found/i)).toBeInTheDocument()
  })

  it('should clear the filter and show all conversations when input is emptied', () => {
    render(<AgentPage />)
    const searchInput = screen.getByPlaceholderText(/search conversations/i)

    fireEvent.change(searchInput, { target: { value: 'maria' } })
    fireEvent.change(searchInput, { target: { value: '' } })

    expect(screen.getByText(/john smith/i)).toBeInTheDocument()
    expect(screen.getByText(/maria garcia/i)).toBeInTheDocument()
    expect(screen.getByText(/robert johnson/i)).toBeInTheDocument()
  })
})

describe('Level 3 - Task 3.1: Conversation Status Filter', () => {
  it('should render filter chips for All, Active, Waiting, Resolved', () => {
    render(<AgentPage />)
    expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^active$/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: /^waiting$/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: /^resolved$/i }).length).toBeGreaterThan(0)
  })

  it('should hide non-matching conversations when a status chip is clicked', () => {
    render(<AgentPage />)

    // Click the Waiting filter chip (the first matching button)
    const waitingChip = screen.getAllByRole('button', { name: /^waiting$/i })[0]
    fireEvent.click(waitingChip)

    // Maria is waiting and should remain visible
    expect(screen.getByText(/maria garcia/i)).toBeInTheDocument()

    // John (active) and Robert (resolved) should be filtered out
    expect(screen.queryByText(/john smith/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/robert johnson/i)).not.toBeInTheDocument()
  })
})
