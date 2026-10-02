/**
 * Level 2 - Task 2.1: Academic Probation Alert Banner
 *
 * The standing page shows status badges but no immediate visual warning
 * when a student is on academic probation. This task adds a prominent
 * Alert banner at the top of the standing page when probation status
 * is detected.
 *
 * Implementation requirements:
 * - Use the shadcn/ui Alert component (destructive variant)
 * - Show the alert only when academic status is "probation"
 * - Display the current GPA and the minimum required GPA
 * - Include a link to schedule an advisor meeting
 * - Alert should be visually prominent at the top of the page
 */

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { resolve } from 'path'
import StandingPage from '@/app/dashboard/standing/page'

describe('Level 2 - Task 2.1: Academic Probation Alert Banner', () => {
  it('shows a probation alert banner when status is probation', () => {
    render(<StandingPage />)

    // Alert banner should be present
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()

    // Uses destructive variant for probation warning
    expect(alert).toHaveClass('border-l-4')
    expect(alert).toHaveClass('border-l-red-500')
    expect(alert).toHaveClass('bg-red-50')
    expect(alert).toHaveClass('text-red-900')

    // AlertTitle mentions academic probation
    const title = screen.getByRole('heading', { level: 5 })
    expect(title).toBeInTheDocument()
    expect(title.textContent).toMatch(/probation|academic standing/i)
  })

  it('displays current GPA and minimum required GPA', () => {
    render(<StandingPage />)

    // Scoped to the alert: the page also has a "GPA by Semester" card.
    const alert = screen.getByRole('alert')
    const alertDesc = within(alert).getByText(/gpa|grade point/i)
    expect(alertDesc).toBeInTheDocument()
    // Should mention the threshold (typically 2.0)
    expect(alertDesc.textContent).toMatch(/2\.0|minimum|required/i)
  })

  it('includes a link to schedule an advisor meeting', () => {
    render(<StandingPage />)

    const advisorLink = screen.getByRole('link', { name: /advisor|schedule|meeting/i })
    expect(advisorLink).toBeInTheDocument()
    expect(advisorLink).toHaveAttribute('href', expect.stringMatching(/advisor|schedule/))
  })

  it('imports Alert from @/components/ui/alert in standing page', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const standingPath = path.resolve(
      process.env.DEVSIM_PROJECT_ROOT ?? resolve(__dirname, '../../..'),
      'src',
      'app',
      'dashboard',
      'standing',
      'page.tsx'
    )
    const contents = fs.readFileSync(standingPath, 'utf-8')

    expect(contents).toMatch(/from\s+['"]@\/components\/ui\/alert['"]/)
    expect(contents).toMatch(/Alert(?:Title|Description)?/)
  })
})