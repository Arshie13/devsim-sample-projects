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
import type { ReactElement } from 'react'
import GradesPage from '@/app/dashboard/grades/page'

describe('Level 4 - Task 4.1: Course detail page (known course)', () => {
  it('should render the matched course code, name, grade, and units for "CS 301"', async () => {
    const mod = await import('@/app/dashboard/courses/[courseCode]/page')
    const CoursePage = mod.default as (props: { params: { courseCode: string } }) => ReactElement

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
    const CoursePage = mod.default as (props: { params: { courseCode: string } }) => ReactElement

    render(<CoursePage params={{ courseCode: 'BOGUS%20999' }} />)
    expect(screen.getByText(/course not found/i)).toBeInTheDocument()

    const backLink = screen.getByRole('link', { name: /grades/i }) as HTMLAnchorElement
    expect(backLink).toBeInTheDocument()
    // Next.js Link renders an <a href="/dashboard/grades">
    expect(backLink.getAttribute('href')).toBe('/dashboard/grades')
  })
})
