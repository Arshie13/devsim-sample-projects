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
})
