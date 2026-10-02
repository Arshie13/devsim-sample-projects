/**
 * Level 2 - Task 2.2: SemesterGroup with shadcn Collapsible (Accordion)
 * Tests that SemesterGroup uses shadcn Collapsible/Accordion component
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GradesPage from '@/app/dashboard/grades/page'
import { join } from 'path'
import fs from 'fs'

function selectTab(name: RegExp) {
  const tab = screen.getByRole('tab', { name })
  fireEvent.mouseDown(tab)
  fireEvent.focus(tab)
}

describe('Level 2 - Task 2.2: SemesterGroup with shadcn Collapsible', () => {
  it('should have Collapsible component installed from shadcn', () => {
    const collapsiblePath = join(
      process.cwd(),
      'src',
      'components',
      'ui',
      'collapsible.tsx'
    )
    expect(fs.existsSync(collapsiblePath)).toBe(true)
    const content = fs.readFileSync(collapsiblePath, 'utf-8')
    expect(content).toMatch(/\bCollapsible\b/)
    expect(content).toMatch(/\bCollapsibleTrigger\b/)
    expect(content).toMatch(/\bCollapsibleContent\b/)
  })

  it('should render Collapsible trigger with aria-expanded', async () => {
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

describe('Level 2 - Task 2.2: Grades page uses Collapsible for semester groups', () => {
  it('should render one Collapsible trigger per unique (semester, academicYear)', () => {
    render(<GradesPage />)
    selectTab(/all semesters/i)

    const triggerA = screen.getByRole('button', {
      name: /1st semester[^a-z0-9]*2025-2026/i,
    })
    const triggerB = screen.getByRole('button', {
      name: /2nd semester[^a-z0-9]*2024-2025/i,
    })

    expect(triggerA).toBeInTheDocument()
    expect(triggerB).toBeInTheDocument()
  })

  it('should use Collapsible component with proper classes', () => {
    render(<GradesPage />)
    selectTab(/all semesters/i)

    const triggers = screen
      .getAllByRole('button')
      .filter((btn) => /\d(st|nd|rd|th)?\s*semester/i.test(btn.textContent ?? ''))

    expect(triggers.length).toBeGreaterThanOrEqual(2)

    // Each trigger should have CollapsibleTrigger classes
    triggers.forEach(trigger => {
      expect(trigger).toHaveClass('flex')
      expect(trigger).toHaveClass('w-full')
      expect(trigger).toHaveClass('items-center')
      expect(trigger).toHaveClass('justify-between')
      expect(trigger).toHaveClass('py-2')
      expect(trigger).toHaveClass('px-4')
      expect(trigger).toHaveClass('rounded-md')
      expect(trigger).toHaveClass('hover:bg-accent')
    })
  })

  it('should mark the first semester group as open by default', () => {
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

  it('should import Collapsible from @/components/ui/collapsible in SemesterGroup', () => {
    const semesterGroupPath = join(
      process.cwd(),
      'src',
      'components',
      'SemesterGroup.tsx'
    )
    expect(fs.existsSync(semesterGroupPath)).toBe(true)
    const source = fs.readFileSync(semesterGroupPath, 'utf-8')
    expect(source).toMatch(/from\s+['"]@\/components\/ui\/collapsible['"]/)
    expect(source).toMatch(/Collapsible(?:Trigger|Content)?/)
  })
})
