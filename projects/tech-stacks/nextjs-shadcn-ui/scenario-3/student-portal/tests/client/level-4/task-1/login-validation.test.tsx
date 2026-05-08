/**
 * Level 4 - Task 4.1: Login Form Validation
 *
 * Verifies the login form rejects malformed input and shows an inline error
 * for wrong credentials.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LoginPage from '@/app/login/page'

describe('Level 4 - Task 4.1: Login Form Validation', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should disable the Log In button when fields are empty', () => {
    render(<LoginPage />)

    const submit = screen.getByRole('button', { name: /^log in$/i }) as HTMLButtonElement
    expect(submit.disabled).toBe(true)
  })

  it('should display an inline error when the student ID format is wrong', () => {
    render(<LoginPage />)

    const studentIdInput = screen.getByPlaceholderText(/student id/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)

    fireEvent.change(studentIdInput, { target: { value: '12345678' } })
    fireEvent.change(passwordInput, { target: { value: 'sample' } })

    expect(screen.getByText(/student id must be in format xx-xxx-xx/i)).toBeInTheDocument()

    const submit = screen.getByRole('button', { name: /^log in$/i }) as HTMLButtonElement
    expect(submit.disabled).toBe(true)
  })

  it('should display an inline error when the password is shorter than 6 characters', () => {
    render(<LoginPage />)

    const studentIdInput = screen.getByPlaceholderText(/student id/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)

    fireEvent.change(studentIdInput, { target: { value: '12-346-78' } })
    fireEvent.change(passwordInput, { target: { value: 'abc' } })

    expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument()

    const submit = screen.getByRole('button', { name: /^log in$/i }) as HTMLButtonElement
    expect(submit.disabled).toBe(true)
  })

  it('should enable Log In when both fields are valid', () => {
    render(<LoginPage />)

    const studentIdInput = screen.getByPlaceholderText(/student id/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)

    fireEvent.change(studentIdInput, { target: { value: '12-346-78' } })
    fireEvent.change(passwordInput, { target: { value: 'sample' } })

    const submit = screen.getByRole('button', { name: /^log in$/i }) as HTMLButtonElement
    expect(submit.disabled).toBe(false)
  })

  it('should show "Invalid student ID or password" on wrong credentials submit', () => {
    render(<LoginPage />)

    const studentIdInput = screen.getByPlaceholderText(/student id/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)

    fireEvent.change(studentIdInput, { target: { value: '99-999-99' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpw' } })

    const submit = screen.getByRole('button', { name: /^log in$/i })
    fireEvent.click(submit)

    expect(screen.getByText(/invalid student id or password/i)).toBeInTheDocument()
  })
})
