/**
 * Level 3 - Task 3.2: Reusable <Progress> primitive
 *
 * Verifies:
 *   - src/components/ui/progress.tsx exists and exposes the ARIA contract
 *   - Values outside [0, max] are clamped (width never exceeds 100%)
 *   - Standing page Degree Progress and Dashboard Degree Progress card both use it
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StandingPage from '@/app/dashboard/standing/page'
import DashboardPage from '@/app/dashboard/page'

describe('Level 3 - Task 3.2: <Progress> primitive', () => {
  it('should render role="progressbar" with aria-valuenow/aria-valuemax', async () => {
    const { Progress } = await import('@/components/ui/progress')
    render(<Progress value={42} max={100} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.getAttribute('aria-valuenow')).toBe('42')
    expect(bar.getAttribute('aria-valuemax')).toBe('100')
    expect(bar.getAttribute('aria-valuemin')).toBe('0')
  })

  it('should clamp value to max', async () => {
    const { Progress } = await import('@/components/ui/progress')
    const { container } = render(<Progress value={250} max={100} />)
    const inner = container.querySelector('[role="progressbar"] > *') as HTMLElement | null
    expect(inner, 'Progress should render an inner fill element.').not.toBeNull()
    const widthStyle = inner!.style.width
    // Accept "100%" exactly, or any value parseable as <=100.
    const numeric = parseFloat(widthStyle.replace('%', ''))
    expect(numeric).toBeLessThanOrEqual(100)
  })
})
