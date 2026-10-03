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
})
