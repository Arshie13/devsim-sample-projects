/**
 * Level 4 - Task 4.2: localStorage Persistence
 *
 * Verifies:
 *   - useLocalStorage hook exists at src/hooks/useLocalStorage.ts
 *   - Agent conversations and status persist to localStorage
 *   - Support page chat messages persist to localStorage
 *   - Persisted state is hydrated on mount
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import React from 'react'
import { join, resolve } from 'path'
import fs from 'fs'

const clientRoot = process.env.DEVSIM_CLIENT_ROOT ?? resolve(__dirname, '../../../../client')
const useLocalStoragePath = join(clientRoot, 'src', 'hooks', 'useLocalStorage.ts')

describe('Level 4 - Task 4.2: useLocalStorage Hook', () => {
  it('should exist at src/hooks/useLocalStorage.ts', () => {
    expect(
      fs.existsSync(useLocalStoragePath),
      `Expected useLocalStorage hook at ${useLocalStoragePath} but it was not found.`
    ).toBe(true)
  })

  it('should export a function named useLocalStorage', () => {
    expect(fs.existsSync(useLocalStoragePath)).toBe(true)
    const source = fs.readFileSync(useLocalStoragePath, 'utf-8')
    expect(source).toMatch(/export\s+(default\s+)?function\s+useLocalStorage|export\s+const\s+useLocalStorage/)
  })

  it('should hydrate from localStorage and persist on update', async () => {
    expect(fs.existsSync(useLocalStoragePath)).toBe(true)

    const mod = await import('@/hooks/useLocalStorage')
    const useLocalStorage = (mod as Record<string, unknown>).useLocalStorage as
      | ((<T>(key: string, initial: T) => [T, (v: T) => void]))
      | undefined
    expect(typeof useLocalStorage).toBe('function')

    localStorage.setItem('hookSmokeTest', JSON.stringify('hydrated-value'))

    let renderedValue: string | null = null
    let setter: ((v: string) => void) | null = null

    function Probe() {
      const [value, setValue] = useLocalStorage!<string>('hookSmokeTest', 'initial')
      renderedValue = value
      setter = setValue
      return React.createElement('span', null, value)
    }

    render(React.createElement(Probe))

    await waitFor(() => {
      expect(renderedValue).toBe('hydrated-value')
    })

    act(() => {
      setter?.('new-value')
    })

    await waitFor(() => {
      expect(localStorage.getItem('hookSmokeTest')).toBe(JSON.stringify('new-value'))
    })
  })
})

describe('Level 4 - Task 4.2: Agent Page Persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should persist conversations to localStorage under "agentConversations"', async () => {
    const AgentPage = (await import('@/app/agent/page')).default
    render(<AgentPage />)

    await waitFor(() => {
      expect(localStorage.getItem('agentConversations')).not.toBeNull()
    })
  })

  it('should persist agent status to localStorage under "agentStatus"', async () => {
    const AgentPage = (await import('@/app/agent/page')).default
    render(<AgentPage />)

    const statusSelect = screen.getByRole('combobox') as HTMLSelectElement
    fireEvent.change(statusSelect, { target: { value: 'away' } })

    await waitFor(() => {
      const stored = localStorage.getItem('agentStatus')
      expect(stored).not.toBeNull()
      expect(stored).toMatch(/away/)
    })
  })
})

describe('Level 4 - Task 4.2: Support Page Persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should persist chat messages to localStorage under "supportMessages"', async () => {
    const SupportPage = (await import('@/app/support/page')).default
    render(<SupportPage />)

    await waitFor(() => {
      expect(localStorage.getItem('supportMessages')).not.toBeNull()
    })
  })

  it('should hydrate persisted chat messages on mount', async () => {
    const persistedMessages = [
      {
        id: 'persisted-1',
        role: 'user',
        content: 'Persisted user message about parking permits',
        timestamp: new Date('2026-05-07T12:00:00.000Z').toISOString(),
      },
    ]
    localStorage.setItem('supportMessages', JSON.stringify(persistedMessages))

    const SupportPage = (await import('@/app/support/page')).default
    render(<SupportPage />)

    await waitFor(() => {
      expect(screen.getByText(/persisted user message about parking permits/i)).toBeInTheDocument()
    })
  })
})
