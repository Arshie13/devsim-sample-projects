/**
 * Level 5 - Task 5.2: Date Utilities & Documentation
 *
 * Verifies:
 *   - src/lib/dateUtils.ts exports formatDueDate, isOverdue, daysUntilDue
 *   - The fees page uses formatDueDate instead of its inline formatDate helper
 *   - README.md is populated with project documentation
 */

import { describe, it, expect } from 'vitest'
import { join, resolve } from 'path'
import fs from 'fs'

const projectRoot = process.env.DEVSIM_PROJECT_ROOT ?? resolve(__dirname, '../../../..')
const dateUtilsPath = join(projectRoot, 'src', 'lib', 'dateUtils.ts')
const feesPagePath = join(projectRoot, 'src', 'app', 'dashboard', 'fees', 'page.tsx')
const readmePath = join(projectRoot, 'README.md')

const ONE_DAY = 24 * 60 * 60_000

const todayAt = (hours = 12) => {
  const d = new Date()
  d.setHours(hours, 0, 0, 0)
  return d
}

describe('Level 5 - Task 5.2: Date Utilities', () => {
  it('should exist at src/lib/dateUtils.ts', () => {
    expect(
      fs.existsSync(dateUtilsPath),
      `Expected dateUtils at ${dateUtilsPath} but it was not found.`
    ).toBe(true)
  })

  it('should export formatDueDate, isOverdue, and daysUntilDue', async () => {
    expect(fs.existsSync(dateUtilsPath)).toBe(true)
    const mod = (await import('@/lib/dateUtils')) as Record<string, unknown>

    expect(typeof mod.formatDueDate).toBe('function')
    expect(typeof mod.isOverdue).toBe('function')
    expect(typeof mod.daysUntilDue).toBe('function')
  })

  it('formatDueDate should return "Due Today" for the current calendar day', async () => {
    const { formatDueDate } = (await import('@/lib/dateUtils')) as {
      formatDueDate: (d: Date | string) => string
    }
    expect(formatDueDate(todayAt())).toMatch(/due today/i)
  })

  it('formatDueDate should return "Due Tomorrow" for the next day', async () => {
    const { formatDueDate } = (await import('@/lib/dateUtils')) as {
      formatDueDate: (d: Date | string) => string
    }
    const tomorrow = new Date(todayAt().getTime() + ONE_DAY)
    expect(formatDueDate(tomorrow)).toMatch(/due tomorrow/i)
  })

  it('formatDueDate should return "Due in N days" for 2..7 days out', async () => {
    const { formatDueDate } = (await import('@/lib/dateUtils')) as {
      formatDueDate: (d: Date | string) => string
    }
    const fiveDaysOut = new Date(todayAt().getTime() + 5 * ONE_DAY)
    expect(formatDueDate(fiveDaysOut)).toMatch(/^due in 5 days$/i)
  })

  it('formatDueDate should return "Overdue by N days" for past dates', async () => {
    const { formatDueDate } = (await import('@/lib/dateUtils')) as {
      formatDueDate: (d: Date | string) => string
    }
    const threeDaysAgo = new Date(todayAt().getTime() - 3 * ONE_DAY)
    expect(formatDueDate(threeDaysAgo)).toMatch(/^overdue by 3 days$/i)
  })

  it('formatDueDate should return a safe fallback for invalid input', async () => {
    const { formatDueDate } = (await import('@/lib/dateUtils')) as {
      formatDueDate: (d: Date | string) => string
    }
    expect(formatDueDate('not-a-date')).toBe('')
    expect(formatDueDate('')).toBe('')
  })

  it('isOverdue should return true for dates strictly in the past', async () => {
    const { isOverdue } = (await import('@/lib/dateUtils')) as {
      isOverdue: (d: Date | string) => boolean
    }
    const yesterday = new Date(todayAt().getTime() - ONE_DAY)
    expect(isOverdue(yesterday)).toBe(true)
  })

  it('isOverdue should return false for today and future dates', async () => {
    const { isOverdue } = (await import('@/lib/dateUtils')) as {
      isOverdue: (d: Date | string) => boolean
    }
    expect(isOverdue(todayAt())).toBe(false)
    const tomorrow = new Date(todayAt().getTime() + ONE_DAY)
    expect(isOverdue(tomorrow)).toBe(false)
  })

  it('isOverdue should return false for invalid input', async () => {
    const { isOverdue } = (await import('@/lib/dateUtils')) as {
      isOverdue: (d: Date | string) => boolean
    }
    expect(isOverdue('invalid')).toBe(false)
    expect(isOverdue('')).toBe(false)
  })

  it('daysUntilDue should return positive whole-day diff for future dates', async () => {
    const { daysUntilDue } = (await import('@/lib/dateUtils')) as {
      daysUntilDue: (d: Date | string) => number
    }
    const sevenDaysOut = new Date(todayAt().getTime() + 7 * ONE_DAY)
    expect(daysUntilDue(sevenDaysOut)).toBe(7)
  })

  it('daysUntilDue should return negative whole-day diff for past dates', async () => {
    const { daysUntilDue } = (await import('@/lib/dateUtils')) as {
      daysUntilDue: (d: Date | string) => number
    }
    const fourDaysAgo = new Date(todayAt().getTime() - 4 * ONE_DAY)
    expect(daysUntilDue(fourDaysAgo)).toBe(-4)
  })

  it('daysUntilDue should return 0 for today and invalid input', async () => {
    const { daysUntilDue } = (await import('@/lib/dateUtils')) as {
      daysUntilDue: (d: Date | string) => number
    }
    expect(daysUntilDue(todayAt())).toBe(0)
    expect(daysUntilDue('invalid')).toBe(0)
    expect(daysUntilDue('')).toBe(0)
  })
})

describe('Level 5 - Task 5.2: Fees Page Uses formatDueDate', () => {
  it('should import formatDueDate from the new module', () => {
    expect(fs.existsSync(feesPagePath)).toBe(true)
    const source = fs.readFileSync(feesPagePath, 'utf-8')

    expect(source).toMatch(
      /import\s+\{?[^}]*formatDueDate[^}]*\}?\s+from\s+['"][^'"]*dateUtils['"]/
    )
  })

  it('should not redefine an inline formatDate helper', () => {
    const source = fs.readFileSync(feesPagePath, 'utf-8')
    expect(source).not.toMatch(/const\s+formatDate\s*=\s*\(/)
  })
})

describe('Level 5 - Task 5.2: README Documentation', () => {
  it('should populate README.md with project documentation', () => {
    expect(
      fs.existsSync(readmePath),
      `Expected README.md at ${readmePath} but it was not found.`
    ).toBe(true)

    const content = fs.readFileSync(readmePath, 'utf-8')

    expect(
      content.length,
      'README.md still looks like the create-next-app boilerplate. Add project docs.'
    ).toBeGreaterThan(400)

    // Required sections / keywords
    expect(content).toMatch(/student portal|riverside/i)
    expect(content).toMatch(/12-346-78/) // demo credentials
    expect(content).toMatch(/sample/) // demo password
    expect(content).toMatch(/\/dashboard/) // routes section
    expect(content).toMatch(/\/login/)
    expect(content).toMatch(/\/dashboard\/grades/)
  })
})
