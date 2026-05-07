/**
 * Level 5 - Task 5.1: Fix Unread Count Bug
 *
 * Issue: when an agent clicks a conversation, the unread badge stays visible
 * because the unread count is never reset. The selected conversation state
 * also drifts from the underlying conversations array.
 *
 * Verifies:
 *   - Clicking a conversation clears its unreadCount to 0
 *   - The unread badge disappears for the selected conversation
 *   - Resolving a conversation updates header stats
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import AgentPage from '@/app/agent/page'

describe('Level 5 - Task 5.1: Unread Count Reset', () => {
  it('should remove the unread badge after the conversation is opened', async () => {
    render(<AgentPage />)

    // John Smith has an unread badge of 2 in the seed data
    const johnButton = screen.getByText(/john smith/i).closest('button')
    expect(johnButton).not.toBeNull()

    // The unread badge "2" should be visible inside John's row to start with
    expect(within(johnButton as HTMLElement).getByText('2')).toBeInTheDocument()

    fireEvent.click(johnButton as HTMLElement)

    await waitFor(() => {
      expect(within(johnButton as HTMLElement).queryByText('2')).not.toBeInTheDocument()
    })
  })

  it('should keep unread counts for conversations the agent has not opened', async () => {
    render(<AgentPage />)

    // Click into Maria (no unread) so John's badge state shouldn't be touched.
    const mariaButton = screen.getByText(/maria garcia/i).closest('button')
    fireEvent.click(mariaButton as HTMLElement)

    const johnButton = screen.getByText(/john smith/i).closest('button')
    expect(johnButton).not.toBeNull()
    expect(within(johnButton as HTMLElement).getByText('2')).toBeInTheDocument()
  })

  it('should keep header active count consistent after resolving a conversation', async () => {
    render(<AgentPage />)

    // Seed: 1 active (John), 1 waiting (Maria), 1 resolved (Robert)
    // Header shows the active count under the "Active" stat label.
    const activeStat = screen.getByText(/^active$/i, { selector: 'p' })
    const activeValue = activeStat.previousElementSibling as HTMLElement
    expect(activeValue.textContent?.trim()).toBe('1')

    // Open John (the only active conversation) and resolve it
    const johnButton = screen.getByText(/john smith/i).closest('button')
    fireEvent.click(johnButton as HTMLElement)

    fireEvent.click(screen.getByRole('button', { name: /^resolve$/i }))

    await waitFor(() => {
      const updatedActive = screen
        .getByText(/^active$/i, { selector: 'p' })
        .previousElementSibling as HTMLElement
      expect(updatedActive.textContent?.trim()).toBe('0')
    })
  })

  it('should keep selectedConversation in sync with conversations after click', async () => {
    render(<AgentPage />)

    // Open John (unread = 2), then send an agent message — the customer-details
    // panel should still show John's name (state did not drift to a stale snapshot).
    const johnButton = screen.getByText(/john smith/i).closest('button')
    fireEvent.click(johnButton as HTMLElement)

    const messageInput = screen.getByPlaceholderText(/type your response/i) as HTMLInputElement
    fireEvent.change(messageInput, { target: { value: 'Hello John, looking into it now.' } })

    const sendButton = messageInput.parentElement?.querySelector('button') as HTMLButtonElement | null
    fireEvent.click(sendButton as HTMLButtonElement)

    await waitFor(() => {
      // The "Customer Details" sidebar still shows John's name and ZIP
      expect(screen.getAllByText(/john smith/i).length).toBeGreaterThan(0)
      expect(screen.getByText(/12345/)).toBeInTheDocument()
    })

    // And John's unread badge should still be cleared
    const johnButtonAfter = screen.getByText(/john smith/i).closest('button') as HTMLElement
    expect(within(johnButtonAfter).queryByText('2')).not.toBeInTheDocument()
  })
})
