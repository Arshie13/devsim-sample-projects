/**
 * Level 5 - Task 5.2: Dashboard Accessibility Sweep
 *
 * Verifies:
 *   - Skip link is the first focusable element and targets #main-content
 *   - <main> has id="main-content" and tabIndex={-1}
 *   - Sidebar <nav> exposes role="navigation" + aria-label="Primary"
 *   - Active sidebar item exposes aria-current="page"
 *   - Icon-only buttons have aria-label
 *   - Header includes an sr-only <h1> with the school name
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

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

  it('should render the sidebar nav with role="navigation" and aria-label="Primary"', async () => {
    const DashboardLayout = (await import('@/app/dashboard/layout')).default
    render(
      <DashboardLayout>
        <div>child</div>
      </DashboardLayout>
    )

    const nav = screen.getByRole('navigation', { name: /primary/i })
    expect(nav).toBeInTheDocument()
  })
})

describe('Level 5 - Task 5.2: aria-current on active sidebar link', () => {
  it('should mark the active sidebar item with aria-current="page"', async () => {
    const DashboardLayout = (await import('@/app/dashboard/layout')).default
    const { container } = render(
      <DashboardLayout>
        <div>child</div>
      </DashboardLayout>
    )

    // usePathname is mocked to /dashboard/grades — the "Grades" item should be the active one.
    const activeElements = container.querySelectorAll('[aria-current="page"]')
    expect(activeElements.length).toBe(1)
    expect(activeElements[0].textContent?.toLowerCase()).toMatch(/grades/)
  })
})

describe('Level 5 - Task 5.2: Icon-only buttons have aria-labels', () => {
  it('should label the menu/hamburger button with aria-label="Toggle sidebar"', async () => {
    const DashboardLayout = (await import('@/app/dashboard/layout')).default
    render(
      <DashboardLayout>
        <div>child</div>
      </DashboardLayout>
    )

    expect(screen.getByRole('button', { name: /toggle sidebar/i })).toBeInTheDocument()
  })

  it('should label the logout button with aria-label="Sign out"', async () => {
    const DashboardLayout = (await import('@/app/dashboard/layout')).default
    render(
      <DashboardLayout>
        <div>child</div>
      </DashboardLayout>
    )

    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })
})

describe('Level 5 - Task 5.2: Screen-reader-only <h1> with school name', () => {
  it('should render an sr-only <h1> containing SCHOOL_NAME inside the header', async () => {
    const DashboardLayout = (await import('@/app/dashboard/layout')).default
    const { container } = render(
      <DashboardLayout>
        <div>child</div>
      </DashboardLayout>
    )

    const header = container.querySelector('header')
    expect(header, '<header> landmark missing.').not.toBeNull()

    const srH1 = header!.querySelector('h1')
    expect(srH1, 'Header must include an <h1> for screen readers.').not.toBeNull()
    expect(
      /\bsr-only\b/.test(srH1!.className),
      '<h1> in header must have `sr-only` so it is not visually duplicated.'
    ).toBe(true)
    expect(srH1!.textContent).toMatch(/riverside university/i)
  })
})
