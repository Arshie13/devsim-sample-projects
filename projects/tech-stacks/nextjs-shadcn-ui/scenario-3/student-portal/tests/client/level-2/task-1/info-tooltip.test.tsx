/**
 * Level 2 - Task 2.1: InfoTooltip Primitive on Standing Badges
 *
 * Verifies:
 *   - src/components/InfoTooltip.tsx exists and renders a role="tooltip" element
 *   - The tooltip's `label` is exposed in the DOM
 *   - The standing page wraps each status badge with InfoTooltip + the spec text
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StandingPage from '@/app/dashboard/standing/page'

describe('Level 2 - Task 2.1: InfoTooltip primitive', () => {
  it('should expose role="tooltip" with the passed label', async () => {
    const { InfoTooltip } = await import('@/components/InfoTooltip')
    render(
      <InfoTooltip label="hello tooltip">
        <span>trigger</span>
      </InfoTooltip>
    )

    const tooltip = screen.getByRole('tooltip', { hidden: true })
    expect(tooltip).toBeInTheDocument()
    expect(tooltip.textContent).toMatch(/hello tooltip/i)
  })

  it('should keep the tooltip hidden by default via opacity-0 / pointer-events-none', async () => {
    const { InfoTooltip } = await import('@/components/InfoTooltip')
    const { container } = render(
      <InfoTooltip label="initially hidden">
        <span>trigger</span>
      </InfoTooltip>
    )

    const tooltip = container.querySelector('[role="tooltip"]') as HTMLElement | null
    expect(tooltip, 'role="tooltip" element missing').not.toBeNull()
    expect(
      /opacity-0/.test(tooltip!.className),
      'InfoTooltip should be hidden by default (expected class `opacity-0`).'
    ).toBe(true)
    expect(
      /pointer-events-none/.test(tooltip!.className),
      'InfoTooltip default state should include `pointer-events-none`.'
    ).toBe(true)
  })

  it('should reveal the tooltip on group-hover via Tailwind classes', async () => {
    const { InfoTooltip } = await import('@/components/InfoTooltip')
    const { container } = render(
      <InfoTooltip label="reveal on hover">
        <span>trigger</span>
      </InfoTooltip>
    )

    const wrapper = container.firstElementChild as HTMLElement | null
    expect(wrapper, 'wrapper element missing').not.toBeNull()
    expect(
      /\bgroup\b/.test(wrapper!.className),
      'InfoTooltip wrapper should expose Tailwind `group` class.'
    ).toBe(true)

    const tooltip = container.querySelector('[role="tooltip"]') as HTMLElement | null
    expect(
      /group-hover:opacity-100/.test(tooltip!.className),
      'Tooltip should become visible on group-hover (expected class `group-hover:opacity-100`).'
    ).toBe(true)
  })
})

describe('Level 2 - Task 2.1: Standing page wires tooltips around status badges', () => {
  it('should wrap the academic status badge with an InfoTooltip whose label matches the status', () => {
    render(<StandingPage />)

    // The mockData currentStanding.academicStatus is "good" so the "Good Standing" tooltip text must appear.
    const goodTooltip = screen.getByRole('tooltip', {
      hidden: true,
      name: /good standing.*cumulative gpa.*3\.0/i,
    })
    expect(goodTooltip).toBeInTheDocument()
  })

  it('should document the three status-tier tooltip strings in standing/page.tsx', async () => {
    // We accept either: all three tooltip strings rendered through getStatusBadge,
    // or all three present as static strings in the source. The static-string check
    // is a strong proxy for the spec compliance even when only one status is rendered.
    const fs = await import('fs')
    const path = await import('path')
    const standingPath = path.resolve(
      __dirname,
      '../../../..',
      'client',
      'src',
      'app',
      'dashboard',
      'standing',
      'page.tsx'
    )
    const contents = fs.readFileSync(standingPath, 'utf-8')

    expect(
      /good standing[^"']*cumulative gpa[^"']*3\.0/i.test(contents),
      'standing/page.tsx must include the "Good Standing" tooltip copy.'
    ).toBe(true)
    expect(
      /warning[^"']*gpa[^"']*2\.0[^"']*2\.99/i.test(contents),
      'standing/page.tsx must include the "Warning" tooltip copy.'
    ).toBe(true)
    expect(
      /probation[^"']*gpa below 2\.0[^"']*advisor/i.test(contents),
      'standing/page.tsx must include the "Probation" tooltip copy.'
    ).toBe(true)
  })
})
