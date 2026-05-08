/**
 * Level 4 - Task 4.2: localStorage Persistence
 *
 * Verifies:
 *   - useLocalStorage hook exists at src/hooks/useLocalStorage.ts
 *   - Sidebar open/closed state persists to localStorage
 *   - Notes page uses the hook to persist studentNotes
 *   - Login page persists last successful student ID
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import React from 'react'
import { join, resolve } from 'path'
import fs from 'fs'

const projectRoot = process.env.DEVSIM_PROJECT_ROOT ?? resolve(__dirname, '../../../..')
const useLocalStoragePath = join(projectRoot, 'src', 'hooks', 'useLocalStorage.ts')
const notesPagePath = join(projectRoot, 'src', 'app', 'dashboard', 'notes', 'page.tsx')

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
    expect(source).toMatch(
      /export\s+(default\s+)?function\s+useLocalStorage|export\s+const\s+useLocalStorage/
    )
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

describe('Level 4 - Task 4.2: Dashboard Sidebar Persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should persist the sidebar open state to localStorage under "sidebarOpen"', async () => {
    const DashboardLayout = (await import('@/app/dashboard/layout')).default
    render(
      <DashboardLayout>
        <div>child</div>
      </DashboardLayout>
    )

    // Click the sidebar toggle button (aria-label "Menu" via the lucide icon)
    const toggle = screen.getAllByRole('button')[0]
    fireEvent.click(toggle)

    await waitFor(() => {
      expect(localStorage.getItem('sidebarOpen')).not.toBeNull()
    })
  })
})

describe('Level 4 - Task 4.2: Notes Page Uses useLocalStorage', () => {
  it('should import useLocalStorage from the hooks module', () => {
    expect(fs.existsSync(notesPagePath)).toBe(true)
    const source = fs.readFileSync(notesPagePath, 'utf-8')
    expect(source).toMatch(
      /import\s+\{?[^}]*useLocalStorage[^}]*\}?\s+from\s+['"][^'"]*useLocalStorage['"]/
    )
  })
})

describe('Level 4 - Task 4.2: Login Page Persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should persist a successful student ID to localStorage under "lastStudentId"', async () => {
    const LoginPage = (await import('@/app/login/page')).default
    render(<LoginPage />)

    const studentIdInput = screen.getByPlaceholderText(/student id/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)

    fireEvent.change(studentIdInput, { target: { value: '12-346-78' } })
    fireEvent.change(passwordInput, { target: { value: 'sample' } })

    const submit = screen.getByRole('button', { name: /^log in$/i })
    fireEvent.click(submit)

    await waitFor(() => {
      const stored = localStorage.getItem('lastStudentId')
      expect(stored).not.toBeNull()
      expect(stored).toMatch(/12-346-78/)
    })
  })

  it('should pre-fill the student ID from "lastStudentId" on next visit', async () => {
    localStorage.setItem('lastStudentId', JSON.stringify('12-346-78'))

    const LoginPage = (await import('@/app/login/page')).default
    render(<LoginPage />)

    const studentIdInput = screen.getByPlaceholderText(/student id/i) as HTMLInputElement
    await waitFor(() => {
      expect(studentIdInput.value).toBe('12-346-78')
    })
  })
})
