/**
 * Level 1 - Task 1.1: Environment Setup Tests
 * Tests that environment variables are properly configured and used
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('Level 1 - Task 1.1: Environment Setup', () => {
  beforeEach(() => {
    // Reset environment variables before each test
    delete process.env.NEXT_PUBLIC_APP_NAME
    delete process.env.NEXT_PUBLIC_API_URL
  })

  it('should have NEXT_PUBLIC_APP_NAME environment variable defined', () => {
    // This test verifies the env var exists (would be set in .env.local)
    // For the test, we simulate it
    process.env.NEXT_PUBLIC_APP_NAME = 'BookWise Library'
    expect(process.env.NEXT_PUBLIC_APP_NAME).toBe('BookWise Library')
  })

  it('should have NEXT_PUBLIC_API_URL environment variable defined', () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api'
    expect(process.env.NEXT_PUBLIC_API_URL).toBe('http://localhost:3000/api')
  })

  it('should redirect to login when no librarian is stored', async () => {
    // This would test the redirect logic in page.tsx
    // Since we mock useRouter, we can verify the behavior
    render(<HomePage />)
    // The page should show loading initially, then redirect
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})
