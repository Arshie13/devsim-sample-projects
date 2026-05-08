/**
 * Level 5 - Task 5.1: Fix GPA Calculation + Standing Sync Bug
 *
 * Issue: cumulative GPA on the dashboard / standing page never matches the
 * grades page because standing.gpa is hard-coded. After this task, all three
 * pages must derive their cumulative GPA from a single helper.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { join, resolve } from 'path'
import fs from 'fs'

const projectRoot = process.env.DEVSIM_PROJECT_ROOT ?? resolve(__dirname, '../../../..')
const mockDataPath = join(projectRoot, 'src', 'lib', 'mockData.ts')
const standingPagePath = join(projectRoot, 'src', 'app', 'dashboard', 'standing', 'page.tsx')
const dashboardPagePath = join(projectRoot, 'src', 'app', 'dashboard', 'page.tsx')
const gradesPagePath = join(projectRoot, 'src', 'app', 'dashboard', 'grades', 'page.tsx')

const GRADE_POINTS: Record<string, number> = {
  A: 4.0, 'A-': 3.7, 'B+': 3.3, B: 3.0, 'B-': 2.7,
  'C+': 2.3, C: 2.0, 'C-': 1.7, 'D+': 1.3, D: 1.0, F: 0.0,
}

interface MockGrade { units: number; grade: string }

const expectedGPA = (entries: MockGrade[]): string => {
  let totalPoints = 0
  let totalUnits = 0
  for (const g of entries) {
    const points = GRADE_POINTS[g.grade] ?? 0
    totalPoints += points * g.units
    totalUnits += g.units
  }
  return totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : '0.00'
}

describe('Level 5 - Task 5.1: computeCumulativeGPA helper', () => {
  it('should be exported from src/lib/mockData.ts', async () => {
    expect(fs.existsSync(mockDataPath)).toBe(true)
    const mod = (await import('@/lib/mockData')) as Record<string, unknown>
    expect(typeof mod.computeCumulativeGPA).toBe('function')
  })

  it('should return the units-weighted cumulative GPA for the seeded grades', async () => {
    const mod = (await import('@/lib/mockData')) as Record<string, unknown>
    const computeCumulativeGPA = mod.computeCumulativeGPA as (g: MockGrade[]) => number
    const grades = mod.grades as MockGrade[]

    const result = computeCumulativeGPA(grades).toFixed(2)
    expect(result).toBe(expectedGPA(grades))
  })

  it('should return 0 for an empty grade list', async () => {
    const mod = (await import('@/lib/mockData')) as Record<string, unknown>
    const computeCumulativeGPA = mod.computeCumulativeGPA as (g: MockGrade[]) => number
    expect(computeCumulativeGPA([])).toBe(0)
  })
})

describe('Level 5 - Task 5.1: Standing page uses computed GPA', () => {
  it('should import computeCumulativeGPA from mockData', () => {
    expect(fs.existsSync(standingPagePath)).toBe(true)
    const source = fs.readFileSync(standingPagePath, 'utf-8')
    expect(source).toMatch(
      /import\s+\{?[^}]*computeCumulativeGPA[^}]*\}?\s+from\s+['"][^'"]*mockData['"]/
    )
  })

  it('should render the computed cumulative GPA, not the hardcoded 3.67', async () => {
    const StandingPage = (await import('@/app/dashboard/standing/page')).default
    const { grades } = await import('@/lib/mockData')
    const expected = expectedGPA(grades as MockGrade[])

    render(<StandingPage />)

    // Whatever expected value is, it should be rendered. If the seeded grades
    // happen to produce 3.67, that's fine — we still verify the source is the
    // computed helper.
    const matches = screen.getAllByText(new RegExp(expected.replace('.', '\\.')))
    expect(matches.length).toBeGreaterThan(0)
  })
})

describe('Level 5 - Task 5.1: Dashboard page uses computed GPA', () => {
  it('should import computeCumulativeGPA in the dashboard page', () => {
    expect(fs.existsSync(dashboardPagePath)).toBe(true)
    const source = fs.readFileSync(dashboardPagePath, 'utf-8')
    expect(source).toMatch(
      /import\s+\{?[^}]*computeCumulativeGPA[^}]*\}?\s+from\s+['"][^'"]*mockData['"]/
    )
  })

  it('should render the computed cumulative GPA in the Current GPA stat', async () => {
    const DashboardPage = (await import('@/app/dashboard/page')).default
    const { grades } = await import('@/lib/mockData')
    const expected = expectedGPA(grades as MockGrade[])

    render(<DashboardPage />)

    const matches = screen.getAllByText(new RegExp(expected.replace('.', '\\.')))
    expect(matches.length).toBeGreaterThan(0)
  })
})

describe('Level 5 - Task 5.1: Grades page consolidates to one helper', () => {
  it('should remove the inline getAllTimeGPA helper and use computeCumulativeGPA', () => {
    expect(fs.existsSync(gradesPagePath)).toBe(true)
    const source = fs.readFileSync(gradesPagePath, 'utf-8')
    expect(source).not.toMatch(/const\s+getAllTimeGPA\s*=/)
    expect(source).toMatch(/computeCumulativeGPA/)
  })
})
