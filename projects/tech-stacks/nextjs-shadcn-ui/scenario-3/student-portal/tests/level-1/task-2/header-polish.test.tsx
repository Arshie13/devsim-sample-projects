/**
 * Level 1 - Task 1.2: Dashboard Header Polish
 *
 * Verifies:
 *   - Login page uses the lucide "School" icon and renders SCHOOL_NAME as the heading
 *   - Dashboard welcome block has a third muted line showing SCHOOL_TAGLINE
 *   - Dashboard header brand text is "Riverside University" (sourced from SCHOOL_NAME)
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { join, resolve } from 'path'
import fs from 'fs'
import LoginPage from '@/app/login/page'
import DashboardLayout from '@/app/dashboard/layout'
import DashboardPage from '@/app/dashboard/page'

const projectRoot = resolve(__dirname, '../../../')
const clientRoot = projectRoot

describe('Level 1 - Task 1.2: Login Page Icon & Heading', () => {
  it('should swap the GraduationCap icon for the School icon on the login page', () => {
    const loginPath = join(clientRoot, 'src', 'app', 'login', 'page.tsx')
    const contents = fs.readFileSync(loginPath, 'utf-8')

    // Match the import line specifically — students may use `School` elsewhere by coincidence
    const importMatch = contents.match(/import\s*{([^}]+)}\s*from\s*["']lucide-react["']/)
    expect(importMatch, 'Could not locate the lucide-react import in login/page.tsx').not.toBeNull()
    const imported = importMatch![1]
    expect(
      /\bSchool\b/.test(imported),
      'login/page.tsx must import the "School" icon from lucide-react.'
    ).toBe(true)
    expect(
      /\bGraduationCap\b/.test(imported),
      'login/page.tsx should no longer import GraduationCap (it was replaced by School).'
    ).toBe(false)
  })

  it('should render the school name from SCHOOL_NAME as the login heading', () => {
    render(<LoginPage />)
    const heading = screen.getByRole('heading', { level: 1, name: /riverside university/i })
    expect(heading).toBeInTheDocument()
  })
})

describe('Level 1 - Task 1.2: Dashboard Welcome Tagline', () => {
  it('should display SCHOOL_TAGLINE as a third line in the welcome block', () => {
    render(<DashboardPage />)
    expect(screen.getByText(/learn\.\s*grow\.\s*graduate\./i)).toBeInTheDocument()
  })

  it('should style the tagline as small muted text', () => {
    const { container } = render(<DashboardPage />)
    const tagline = container.querySelector('p, span, div')
    // Search the document for an element with both small + muted classes containing the tagline.
    const candidates = Array.from(container.querySelectorAll('*')).filter((el) =>
      /learn\.\s*grow\.\s*graduate\./i.test(el.textContent ?? '')
    )
    const directMatch = candidates.find(
      (el) =>
        el.children.length === 0 &&
        /text-sm/.test(el.className) &&
        /text-(gray|muted|slate)-/.test(el.className)
    )
    expect(
      directMatch,
      'Tagline should render with classes including `text-sm` and a muted text color (e.g. text-gray-500).'
    ).toBeTruthy()

    // Reference `tagline` so linters do not flag the placeholder query above.
    expect(tagline === null || tagline instanceof Element).toBe(true)
  })
})

describe('Level 1 - Task 1.2: Dashboard Header Brand', () => {
  it('should render SCHOOL_NAME ("Riverside University") in the dashboard header', () => {
    render(
      <DashboardLayout>
        <div>child content</div>
      </DashboardLayout>
    )
    expect(screen.getByText(/riverside university/i)).toBeInTheDocument()
  })
})
