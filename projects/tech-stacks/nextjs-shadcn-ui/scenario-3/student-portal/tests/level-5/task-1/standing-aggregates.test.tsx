/**
 * Level 5 - Task 5.1: Replace Hard-Coded Standing Aggregates
 *
 * Verifies:
 *   - computeCurrentSemesterUnits + computeEarnedCredits exported from mockData
 *   - Standing page no longer reads `currentStanding.totalUnits` or `currentStanding.earnedCredits`
 *   - Dashboard page no longer reads `currentStanding.totalUnits` (it should derive from grades)
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { join, resolve } from 'path'
import fs from 'fs'
import StandingPage from '@/app/dashboard/standing/page'
import DashboardPage from '@/app/dashboard/page'

const projectRoot = resolve(__dirname, '../../../')
const clientRoot = projectRoot

describe('Level 5 - Task 5.1: computeCurrentSemesterUnits + computeEarnedCredits helpers', () => {
  it('should export computeCurrentSemesterUnits returning current-semester unit total', async () => {
    const mod = await import('@/lib/mockData')
    expect(typeof mod.computeCurrentSemesterUnits).toBe('function')

    const result = mod.computeCurrentSemesterUnits(mod.grades)
    // From mockData: 4 courses in 1st Sem 2025-2026 × 3 units = 12
    expect(result).toBe(12)
  })

  it('should export computeEarnedCredits summing all non-F grades', async () => {
    const mod = await import('@/lib/mockData')
    expect(typeof mod.computeEarnedCredits).toBe('function')

    // mockData grades: 8 entries × 3 units, none is F → 24
    const result = mod.computeEarnedCredits(mod.grades)
    expect(result).toBe(24)
  })

  it('should exclude F grades from computeEarnedCredits', async () => {
    const { computeEarnedCredits } = await import('@/lib/mockData')

    const sample = [
      { id: '1', courseCode: 'A', courseName: '', units: 3, grade: 'A', semester: 's', academicYear: 'y' },
      { id: '2', courseCode: 'F', courseName: '', units: 4, grade: 'F', semester: 's', academicYear: 'y' },
      { id: '3', courseCode: 'C', courseName: '', units: 2, grade: 'C-', semester: 's', academicYear: 'y' },
    ] as Parameters<typeof computeEarnedCredits>[0]

    expect(computeEarnedCredits(sample)).toBe(5)
  })
})

describe('Level 5 - Task 5.1: Standing page sources aggregates from helpers', () => {
  it('should no longer reference currentStanding.totalUnits or .earnedCredits in source', () => {
    const standingPath = join(clientRoot, 'src', 'app', 'dashboard', 'standing', 'page.tsx')
    const contents = fs.readFileSync(standingPath, 'utf-8')

    expect(
      /currentStanding\.totalUnits/.test(contents),
      'standing/page.tsx must no longer read `currentStanding.totalUnits` — derive it from grades.'
    ).toBe(false)
    expect(
      /currentStanding\.earnedCredits/.test(contents),
      'standing/page.tsx must no longer read `currentStanding.earnedCredits` — derive it from grades.'
    ).toBe(false)
  })

  it('should display Total Units = 12 (computed from grades) on the standing page', () => {
    render(<StandingPage />)
    // The "Current Units" stat card title should be near the value 12.
    const twelveOccurrences = screen.getAllByText('12')
    expect(twelveOccurrences.length).toBeGreaterThan(0)
  })

  it('should display Earned Credits = 24 (computed from grades) on the standing page', () => {
    render(<StandingPage />)
    const earnedNodes = screen.getAllByText(/\b24\b/)
    expect(earnedNodes.length).toBeGreaterThan(0)
  })
})

describe('Level 5 - Task 5.1: Dashboard page sources Total Units from helper', () => {
  it('should no longer reference currentStanding.totalUnits in dashboard/page.tsx', () => {
    const dashboardPath = join(clientRoot, 'src', 'app', 'dashboard', 'page.tsx')
    const contents = fs.readFileSync(dashboardPath, 'utf-8')

    expect(
      /currentStanding\.totalUnits/.test(contents),
      'dashboard/page.tsx must no longer read `currentStanding.totalUnits` — derive it from grades.'
    ).toBe(false)
  })

  it('should render Total Units stat as 12 on the dashboard', () => {
    render(<DashboardPage />)
    expect(screen.getAllByText('12').length).toBeGreaterThan(0)
  })
})
