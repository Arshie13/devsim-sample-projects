/**
 * Level 4 - Task 4.2: Agent Keyboard Shortcuts
 *
 * Verifies:
 *   - ArrowDown / ArrowUp move the selected conversation
 *   - Ctrl/Cmd+Enter in the message input sends the current message
 *   - Escape clears the message input
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AgentPage from '@/app/agent/page'

// The chat header renders the selected customer's name as a heading.
const selectedCustomer = (): string | undefined => {
  const heading = screen
    .getAllByRole('heading')
    .find((el) => /john smith|maria garcia|robert johnson/i.test(el.textContent ?? ''))
  return heading?.textContent?.trim()
}

describe('Level 4 - Task 4.2: conversation navigation', () => {
  it('should move the selected conversation with ArrowDown / ArrowUp', () => {
    render(<AgentPage />)

    const before = selectedCustomer()
    expect(before).toBeTruthy()

    fireEvent.keyDown(document.body, { key: 'ArrowDown' })
    const afterDown = selectedCustomer()
    expect(afterDown).not.toBe(before)

    fireEvent.keyDown(document.body, { key: 'ArrowUp' })
    expect(selectedCustomer()).toBe(before)
  })
})

describe('Level 4 - Task 4.2: message input shortcuts', () => {
  it('should send the message on Ctrl+Enter', () => {
    render(<AgentPage />)

    const input = screen.getByPlaceholderText(/type your response/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Looking into it now' } })
    fireEvent.keyDown(input, { key: 'Enter', ctrlKey: true })

    expect(screen.getAllByText(/looking into it now/i).length).toBeGreaterThan(0)
    expect(input.value).toBe('')
  })

  it('should clear the message input on Escape', () => {
    render(<AgentPage />)

    const input = screen.getByPlaceholderText(/type your response/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'a half-written draft' } })
    expect(input.value).toBe('a half-written draft')

    fireEvent.keyDown(input, { key: 'Escape' })
    expect(input.value).toBe('')
  })
})
