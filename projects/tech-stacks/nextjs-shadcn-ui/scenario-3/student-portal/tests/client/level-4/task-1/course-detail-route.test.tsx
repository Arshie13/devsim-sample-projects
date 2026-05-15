/**
 * Level 4 - Task 4.1: Dynamic Course Detail Route
 *
 * Verifies:
 *   - /dashboard/courses/[courseCode]/page.tsx renders details for a known course
 *   - Unknown courses render "Course not found" and a link back to grades
 *   - Grades page rows include a "View Details" link to /dashboard/courses/<courseCode>
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GradesPage from '@/app/dashboard/grades/page'

describe('Level 4 - Task 4.1: Course detail page (known course)', () => {
  it('should render the matched course code, name, grade, and units for "CS 301"', async () => {
    const mod = await import('@/app/dashboard/courses/[courseCode]/page')
    const CoursePage = mod.default as (props: { params: { courseCode: string } }) => JSX.Element

    render(<CoursePage params={{ courseCode: 'CS%20301' }} />)

    expect(screen.getByText(/cs\s*301/i)).toBeInTheDocument()
    expect(screen.getByText(/data structures and algorithms/i)).toBeInTheDocument()
    // Grade A in mockData for CS 301
    expect(screen.getAllByText(/\bA\b/).length).toBeGreaterThan(0)
    // Schedule professor for CS 301
    expect(screen.getByText(/dr\.\s*sarah johnson/i)).toBeInTheDocument()
  })

  it('should render "Course not found" with a link back to grades for unknown codes', async () => {
    const mod = await import('@/app/dashboard/courses/[courseCode]/page')
    const CoursePage = mod.default as (props: { params: { courseCode: string } }) => JSX.Element

    render(<CoursePage params={{ courseCode: 'BOGUS%20999' }} />)
    expect(screen.getByText(/course not found/i)).toBeInTheDocument()

    const backLink = screen.getByRole('link', { name: /grades/i }) as HTMLAnchorElement
    expect(backLink).toBeInTheDocument()
    // Next.js Link renders an <a href="/dashboard/grades">
    expect(backLink.getAttribute('href')).toBe('/dashboard/grades')
  })
})

describe('Level 4 - Task 4.1: Grades page exposes View Details links', () => {
  it('should render a "View Details" link per grade row pointing to /dashboard/courses/<encoded>', () => {
    render(<GradesPage />)

    const links = screen.getAllByRole('link', { name: /view details/i }) as HTMLAnchorElement[]
    expect(links.length).toBeGreaterThan(0)

    // Each link should point at /dashboard/courses/<something>
    for (const link of links) {
      const href = link.getAttribute('href') ?? ''
      expect(href.startsWith('/dashboard/courses/')).toBe(true)
    }

    // At least one link must be the URL-encoded CS 301 entry.
    const csLink = links.find((a) =>
      (a.getAttribute('href') ?? '').toLowerCase().includes('cs%20301')
    )
    expect(
      csLink,
      'Expected a "View Details" link pointing to /dashboard/courses/CS%20301.'
    ).toBeTruthy()
  })
})
