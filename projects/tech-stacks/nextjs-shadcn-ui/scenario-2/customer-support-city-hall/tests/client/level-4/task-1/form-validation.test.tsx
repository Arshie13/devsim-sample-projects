/**
 * Level 4 - Task 4.1: Form & Message Validation
 *
 * Verifies the citizen "Connect with an Agent" form rejects invalid input
 * and that the chat input cannot send whitespace-only messages.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SupportPage from '@/app/support/page'

const openAgentForm = () => {
  fireEvent.click(screen.getByRole('button', { name: /talk to agent/i }))
}

describe('Level 4 - Task 4.1: Agent Form Validation', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should disable the Submit Request button when fields are empty', () => {
    render(<SupportPage />)
    openAgentForm()

    const submit = screen.getByRole('button', { name: /submit request/i }) as HTMLButtonElement
    expect(submit.disabled).toBe(true)
  })

  it('should display an inline error when the ZIP code is not 5 digits', () => {
    render(<SupportPage />)
    openAgentForm()

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
      target: { value: '12' },
    })
    fireEvent.change(screen.getByPlaceholderText(/describe your issue/i), {
      target: { value: 'A complaint with enough characters.' },
    })

    expect(screen.getByText(/zip code must be 5 digits/i)).toBeInTheDocument()

    const submit = screen.getByRole('button', { name: /submit request/i }) as HTMLButtonElement
    expect(submit.disabled).toBe(true)
  })

  it('should display an inline error when the complaint is shorter than 10 characters', () => {
    render(<SupportPage />)
    openAgentForm()

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
      target: { value: 'short' },
    })

    expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument()

    const submit = screen.getByRole('button', { name: /submit request/i }) as HTMLButtonElement
    expect(submit.disabled).toBe(true)
  })

  it('should display an inline error when the full name is shorter than 2 characters', () => {
    render(<SupportPage />)
    openAgentForm()

    fireEvent.change(screen.getByPlaceholderText(/enter your full name/i), {
      target: { value: 'A' },
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
      target: { value: 'A complaint that is plenty long enough.' },
    })

    expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument()
  })

  it('should enable Submit when every field is valid', () => {
    render(<SupportPage />)
    openAgentForm()

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
      target: { value: 'A complaint with enough characters to pass the validator.' },
    })

    const submit = screen.getByRole('button', { name: /submit request/i }) as HTMLButtonElement
    expect(submit.disabled).toBe(false)
  })
})

describe('Level 4 - Task 4.1: Chat Whitespace Guard', () => {
  it('should keep the chat send button disabled when the input is whitespace only', () => {
    render(<SupportPage />)

    const chatInput = screen.getByPlaceholderText(/type your message to ai assistant/i)
    fireEvent.change(chatInput, { target: { value: '     ' } })

    const sendButton = chatInput.parentElement?.querySelector('button') as HTMLButtonElement | null
    expect(sendButton).not.toBeNull()
    expect(sendButton?.disabled).toBe(true)
  })
})
