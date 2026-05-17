/**
 * Level 2 - Task 2.2: SemesterGroup Accordion on Grades Page
 *
 * Verifies:
 *   - src/components/SemesterGroup.tsx renders an aria-expanded button with the title
 *   - Clicking the button toggles content visibility
 *   - defaultOpen=true starts expanded
 *   - Grades page All Semesters tab groups rows into one SemesterGroup per (semester, academicYear)
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GradesPage from '@/app/dashboard/grades/page'

// Radix Tabs activates a tab on mousedown/focus, not on a bare click event.
// fireEvent.click dispatches only a click, so use this helper to actually switch tabs.
function selectTab(name: RegExp) {
  const tab = screen.getByRole('tab', { name })
  fireEvent.mouseDown(tab)
  fireEvent.focus(tab)
}

describe('Level 2 - Task 2.2: SemesterGroup primitive', () => {
  it('should render a button labeled by `title` exposing aria-expanded', async () => {
    const { SemesterGroup } = await import('@/components/SemesterGroup')
    render(
      <SemesterGroup title="1st Semester — 2025-2026">
        <p>hidden body</p>
      </SemesterGroup>
    )

    const trigger = screen.getByRole('button', { name: /1st semester — 2025-2026/i })
    expect(trigger).toBeInTheDocument()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('should hide body content by default and reveal on click', async () => {
    const { SemesterGroup } = await import('@/components/SemesterGroup')
    render(
      <SemesterGroup title="Section A">
        <p>secret-body-text</p>
      </SemesterGroup>
    )

    expect(screen.queryByText(/secret-body-text/)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /section a/i }))

    expect(screen.getByText(/secret-body-text/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /section a/i }).getAttribute('aria-expanded')
    ).toBe('true')
  })

  it('should respect defaultOpen=true', async () => {
    const { SemesterGroup } = await import('@/components/SemesterGroup')
    render(
      <SemesterGroup title="Default Open" defaultOpen>
        <p>already-visible</p>
      </SemesterGroup>
    )

    expect(screen.getByText(/already-visible/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /default open/i }).getAttribute('aria-expanded')
    ).toBe('true')
  })
})

describe('Level 2 - Task 2.2: Grades page wires SemesterGroup into All Semesters tab', () => {
  it('should render one accordion trigger per unique (semester, academicYear)', () => {
    render(<GradesPage />)

    // Switch to "All Semesters" tab so its content is in the DOM.
    selectTab(/all semesters/i)

    // From mockData: ("1st Semester", "2025-2026") and ("2nd Semester", "2024-2025")
    const triggerA = screen.getByRole('button', {
      name: /1st semester[^a-z0-9]*2025-2026/i,
    })
    const triggerB = screen.getByRole('button', {
      name: /2nd semester[^a-z0-9]*2024-2025/i,
    })

    expect(triggerA).toBeInTheDocument()
    expect(triggerB).toBeInTheDocument()
  })

  it('should mark the first accordion group as open by default', () => {
    render(<GradesPage />)
    selectTab(/all semesters/i)

    const semesterTriggers = screen
      .getAllByRole('button')
      .filter((btn) => /\d(st|nd|rd|th)?\s*semester/i.test(btn.textContent ?? ''))

    expect(semesterTriggers.length).toBeGreaterThanOrEqual(2)
    expect(
      semesterTriggers[0].getAttribute('aria-expanded'),
      'First semester group must be expanded by default.'
    ).toBe('true')
  })
})
