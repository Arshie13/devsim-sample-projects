/**
 * Level 5 - Task 5.1: Production Bug Hunt
 *
 * Two interacting production bugs on the agent dashboard:
 *   Bug A — the agent status selector is cosmetic: an "Offline" agent can
 *           still type and send replies.
 *   Bug B — clicking a conversation never resets its unread count, so the
 *           red unread badge stays forever.
 *
 * Because unread count feeds the Level 3 priority score, the Bug B fix must
 * reset the count on the conversations array itself (not a stale snapshot),
 * keeping the sorted list and SLA badges consistent.
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import AgentPage from '@/app/agent/page'

const NOTICE = /set your status to online to reply/i

// Conversation rows are <button> elements; matching by role + name keeps the
// customer name shown in the chat header / details panel out of the result.
const rowButton = (name: RegExp) => screen.getByRole('button', { name })

describe('Level 5 - Task 5.1: Bug A — agent status gate', () => {
  it('should allow replying while the agent is online', () => {
    render(<AgentPage />)
    const input = screen.getByPlaceholderText(/type your response/i) as HTMLInputElement
    expect(input.disabled).toBe(false)
    expect(screen.queryByText(NOTICE)).toBeNull()
  })

  it('should disable the input and send button when the agent goes offline', () => {
    render(<AgentPage />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'offline' } })

    const input = screen.getByPlaceholderText(/type your response/i) as HTMLInputElement
    expect(input.disabled).toBe(true)

    const sendButton = input.parentElement?.querySelector('button') as HTMLButtonElement | null
    expect(sendButton).not.toBeNull()
    expect(sendButton?.disabled).toBe(true)
  })
})
