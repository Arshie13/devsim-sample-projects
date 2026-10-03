/**
 * Level 5 - Task 5.2: Dashboard Accessibility Sweep & DropdownMenu Component
 * Tests for accessibility landmarks and shadcn/ui DropdownMenu component
 *
 * This task uses the DropdownMenu component installed in Level 1.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { join } from 'path'
import fs from 'fs'

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<typeof import('next/navigation')>('next/navigation')
  return {
    ...actual,
    usePathname: () => '/dashboard/grades',
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() }),
  }
})

describe('Level 5 - Task 5.2: Skip link', () => {
  it('should render a skip link as the first focusable element pointing to #main-content', async () => {
    const DashboardLayout = (await import('@/app/dashboard/layout')).default
    const { container } = render(
      <DashboardLayout>
        <div>child</div>
      </DashboardLayout>
    )

    const focusable = container.querySelectorAll('a, button, [tabindex]')
    expect(focusable.length).toBeGreaterThan(0)

    // First focusable element is the skip link
    const first = focusable[0] as HTMLElement
    expect(
      first.tagName.toLowerCase() === 'a',
      'First focusable element should be the skip-link anchor.'
    ).toBe(true)
    expect((first as HTMLAnchorElement).getAttribute('href')).toBe('#main-content')
    expect(first.textContent?.toLowerCase()).toMatch(/skip to main content/i)
    expect(
      /\bsr-only\b/.test(first.className),
      'Skip link must be visually hidden by default with `sr-only`.'
    ).toBe(true)
    expect(
      /focus:not-sr-only/.test(first.className),
      'Skip link should reveal on focus with `focus:not-sr-only`.'
    ).toBe(true)
  })
})

describe('Level 5 - Task 5.2: Landmarks & main element', () => {
  it('should expose a <main id="main-content" tabIndex={-1}>', async () => {
    const DashboardLayout = (await import('@/app/dashboard/layout')).default
    const { container } = render(
      <DashboardLayout>
        <div>child</div>
      </DashboardLayout>
    )

    const main = container.querySelector('main')
    expect(main, 'Layout must include a <main> landmark.').not.toBeNull()
    expect(main!.getAttribute('id')).toBe('main-content')
    expect(main!.getAttribute('tabindex')).toBe('-1')
  })
})