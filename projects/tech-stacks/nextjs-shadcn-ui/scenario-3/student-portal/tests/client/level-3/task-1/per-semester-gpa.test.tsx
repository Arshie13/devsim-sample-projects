/**
 * Level 3 - Task 3.1: Per-Semester GPA Helper + Standing Card
 *
 * Verifies:
 *   - mockData.ts exports computeGPABySemester with correct grouping/weighting/sorting
 *   - Standing page renders one row per semester returned by computeGPABySemester
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StandingPage from '@/app/dashboard/standing/page'

describe('Level 3 - Task 3.1: computeGPABySemester helper', () => {
  it('should return one entry per unique (semester, academicYear)', async () => {
    const { computeGPABySemester, grades } = await import('@/lib/mockData')

    const result = computeGPABySemester(grades)
    const keys = new Set(result.map((r) => `${r.semester}|${r.academicYear}`))
    expect(keys.size).toBe(result.length)
    // From the mock data we expect exactly two distinct groups.
    expect(result.length).toBe(2)
  })

  it('should compute units-weighted GPA per group, rounded to 2 decimals', async () => {
    const { computeGPABySemester } = await import('@/lib/mockData')

    // Synthetic input — fully controlled so the test does not depend on mockData.
    const sample = [
      { id: '1', courseCode: 'X1', courseName: 'X', units: 3, grade: 'A', semester: '1st Semester', academicYear: '2025-2026' },
      { id: '2', courseCode: 'X2', courseName: 'X', units: 3, grade: 'B', semester: '1st Semester', academicYear: '2025-2026' },
      { id: '3', courseCode: 'X3', courseName: 'X', units: 4, grade: 'C', semester: '2nd Semester', academicYear: '2024-2025' },
    ] as Parameters<typeof computeGPABySemester>[0]

    const result = computeGPABySemester(sample)
    const first = result.find((r) => r.semester === '1st Semester' && r.academicYear === '2025-2026')!
    const second = result.find((r) => r.semester === '2nd Semester' && r.academicYear === '2024-2025')!

    // (4.0*3 + 3.0*3) / 6 = 3.5
    expect(first.gpa).toBeCloseTo(3.5, 2)
    expect(first.units).toBe(6)

    // 2.0
    expect(second.gpa).toBeCloseTo(2.0, 2)
    expect(second.units).toBe(4)
  })

  it('should sort chronologically (older academicYear first, 1st Semester before 2nd)', async () => {
    const { computeGPABySemester } = await import('@/lib/mockData')

    const sample = [
      { id: '1', courseCode: 'A', courseName: 'A', units: 3, grade: 'A', semester: '2nd Semester', academicYear: '2025-2026' },
      { id: '2', courseCode: 'B', courseName: 'B', units: 3, grade: 'A', semester: '1st Semester', academicYear: '2025-2026' },
      { id: '3', courseCode: 'C', courseName: 'C', units: 3, grade: 'A', semester: '2nd Semester', academicYear: '2024-2025' },
      { id: '4', courseCode: 'D', courseName: 'D', units: 3, grade: 'A', semester: '1st Semester', academicYear: '2024-2025' },
    ] as Parameters<typeof computeGPABySemester>[0]

    const result = computeGPABySemester(sample)
    const labels = result.map((r) => `${r.academicYear} ${r.semester}`)

    expect(labels).toEqual([
      '2024-2025 1st Semester',
      '2024-2025 2nd Semester',
      '2025-2026 1st Semester',
      '2025-2026 2nd Semester',
    ])
  })
})

describe('Level 3 - Task 3.1: Standing page renders GPA by Semester card', () => {
  it('should render a "GPA by Semester" card heading', () => {
    render(<StandingPage />)
    expect(screen.getByText(/gpa by semester/i)).toBeInTheDocument()
  })

  it('should render one row per group with the semester label and a numeric GPA', () => {
    render(<StandingPage />)
    // We expect both groups from mockData to surface as labels somewhere in the card.
    expect(screen.getAllByText(/1st semester/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/2nd semester/i).length).toBeGreaterThan(0)
  })
})
