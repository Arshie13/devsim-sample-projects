/**
 * Level 2 - Task 2.2: Refactoring & Component Extraction
 *
 * Tests:
 *   1. A reusable StatCard component exists at src/components/StatCard.tsx
 *   2. The fees page derives its tallies via a single useMemo
 *      instead of three back-to-back .filter() calls.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { join, resolve } from 'path'
import fs from 'fs'

const projectRoot = process.env.DEVSIM_PROJECT_ROOT ?? resolve(__dirname, '../../../..')
const componentsDir = join(projectRoot, 'src', 'components')
const statCardPath = join(componentsDir, 'StatCard.tsx')
const feesPagePath = join(projectRoot, 'src', 'app', 'dashboard', 'fees', 'page.tsx')
const dashboardPagePath = join(projectRoot, 'src', 'app', 'dashboard', 'page.tsx')
const schedulePagePath = join(projectRoot, 'src', 'app', 'dashboard', 'schedule', 'page.tsx')
const standingPagePath = join(projectRoot, 'src', 'app', 'dashboard', 'standing', 'page.tsx')

describe('Level 2 - Task 2.2: StatCard Component', () => {
  it('should export a StatCard component from src/components/StatCard.tsx', () => {
    expect(
      fs.existsSync(statCardPath),
      `Expected StatCard at ${statCardPath} but it was not found.`
    ).toBe(true)

    const source = fs.readFileSync(statCardPath, 'utf-8')
    expect(source).toMatch(/export\s+(default\s+)?function\s+StatCard|export\s+const\s+StatCard/)
  })

  it('should accept title, value, and icon props on StatCard', () => {
    expect(fs.existsSync(statCardPath)).toBe(true)
    const source = fs.readFileSync(statCardPath, 'utf-8')
    expect(source).toMatch(/title/)
    expect(source).toMatch(/value/)
    expect(source).toMatch(/icon/i)
  })

  it('should be imported by the dashboard page', () => {
    expect(fs.existsSync(dashboardPagePath)).toBe(true)
    const source = fs.readFileSync(dashboardPagePath, 'utf-8')
    expect(source).toMatch(/import\s+\{?\s*StatCard\s*\}?\s+from/)
  })

  it('should be imported by the fees page', () => {
    expect(fs.existsSync(feesPagePath)).toBe(true)
    const source = fs.readFileSync(feesPagePath, 'utf-8')
    expect(source).toMatch(/import\s+\{?\s*StatCard\s*\}?\s+from/)
  })

  it('should be imported by the schedule page', () => {
    expect(fs.existsSync(schedulePagePath)).toBe(true)
    const source = fs.readFileSync(schedulePagePath, 'utf-8')
    expect(source).toMatch(/import\s+\{?\s*StatCard\s*\}?\s+from/)
  })

  it('should be imported by the standing page', () => {
    expect(fs.existsSync(standingPagePath)).toBe(true)
    const source = fs.readFileSync(standingPagePath, 'utf-8')
    expect(source).toMatch(/import\s+\{?\s*StatCard\s*\}?\s+from/)
  })

  it('should still render the dashboard stat values through the new component', async () => {
    const DashboardPage = (await import('@/app/dashboard/page')).default
    render(<DashboardPage />)
    expect(screen.getByText(/current gpa/i)).toBeInTheDocument()
    expect(screen.getByText(/total units/i)).toBeInTheDocument()
  })
})

describe('Level 2 - Task 2.2: useMemo for Fee Tallies', () => {
  it('should derive fee tallies via useMemo on the fees page', () => {
    expect(fs.existsSync(feesPagePath)).toBe(true)
    const source = fs.readFileSync(feesPagePath, 'utf-8')

    // useMemo should be imported alongside other React hooks
    expect(source).toMatch(/import[^;]*\buseMemo\b[^;]*from\s+['"]react['"]/)

    // useMemo block should reference the fee buckets
    expect(source).toMatch(/useMemo\s*\(/)
    expect(source).toMatch(/paid\s*[:,]/)
    expect(source).toMatch(/pending\s*[:,]/)
    expect(source).toMatch(/overdue\s*[:,]/)
  })

  it('should remove the standalone .filter() calls for paid/pending/overdue', () => {
    const source = fs.readFileSync(feesPagePath, 'utf-8')
    // The original code had three separate inline filter calls — after the
    // refactor they should be folded into a single useMemo.
    const filterCount = (source.match(/tuitionFees\.filter\(/g) ?? []).length
    expect(
      filterCount,
      `Expected at most one .filter() call after extracting tallies into useMemo, but found ${filterCount}.`
    ).toBeLessThanOrEqual(1)
  })
})
