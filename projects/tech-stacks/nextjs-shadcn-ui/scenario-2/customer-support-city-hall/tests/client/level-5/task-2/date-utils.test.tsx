/**
 * Level 5 - Task 5.2: Date Utilities & Documentation
 *
 * Verifies:
 *   - src/lib/dateUtils.ts exports formatRelativeTime, isStale, formatTimestamp
 *   - The agent page uses formatRelativeTime instead of its inline helper
 *   - README.md is populated with project documentation
 */

import { describe, it, expect } from 'vitest'
import { join, resolve } from 'path'
import fs from 'fs'

const clientRoot = process.env.DEVSIM_CLIENT_ROOT ?? resolve(__dirname, '../../../../client')
const dateUtilsPath = join(clientRoot, 'src', 'lib', 'dateUtils.ts')
const agentPagePath = join(clientRoot, 'src', 'app', 'agent', 'page.tsx')
const readmePath = join(clientRoot, 'README.md')

describe('Level 5 - Task 5.2: Date Utilities', () => {
  it('should exist at src/lib/dateUtils.ts', () => {
    expect(
      fs.existsSync(dateUtilsPath),
      `Expected dateUtils at ${dateUtilsPath} but it was not found.`
    ).toBe(true)
  })

  it('should export formatRelativeTime, isStale, and formatTimestamp', async () => {
    expect(fs.existsSync(dateUtilsPath)).toBe(true)
    const mod = (await import('@/lib/dateUtils')) as Record<string, unknown>

    expect(typeof mod.formatRelativeTime).toBe('function')
    expect(typeof mod.isStale).toBe('function')
    expect(typeof mod.formatTimestamp).toBe('function')
  })

  it('formatRelativeTime should return "Just now" for sub-minute deltas', async () => {
    const { formatRelativeTime } = (await import('@/lib/dateUtils')) as {
      formatRelativeTime: (d: Date | string) => string
    }
    const now = new Date()
    expect(formatRelativeTime(new Date(now.getTime() - 30_000))).toMatch(/just now/i)
  })

  it('formatRelativeTime should return "Nm ago" for minute-scale deltas', async () => {
    const { formatRelativeTime } = (await import('@/lib/dateUtils')) as {
      formatRelativeTime: (d: Date | string) => string
    }
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60_000)
    expect(formatRelativeTime(fiveMinutesAgo)).toMatch(/^5m ago$/)
  })

  it('formatRelativeTime should return "Nh ago" for hour-scale deltas', async () => {
    const { formatRelativeTime } = (await import('@/lib/dateUtils')) as {
      formatRelativeTime: (d: Date | string) => string
    }
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60_000)
    expect(formatRelativeTime(threeHoursAgo)).toMatch(/^3h ago$/)
  })

  it('formatRelativeTime should return a safe fallback for invalid input', async () => {
    const { formatRelativeTime } = (await import('@/lib/dateUtils')) as {
      formatRelativeTime: (d: Date | string) => string
    }
    expect(formatRelativeTime('not-a-date')).toBe('')
    expect(formatRelativeTime('')).toBe('')
  })

  it('isStale should return true for dates older than 24 hours', async () => {
    const { isStale } = (await import('@/lib/dateUtils')) as {
      isStale: (d: Date | string) => boolean
    }
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60_000)
    expect(isStale(twoDaysAgo)).toBe(true)
  })

  it('isStale should return false for recent dates', async () => {
    const { isStale } = (await import('@/lib/dateUtils')) as {
      isStale: (d: Date | string) => boolean
    }
    const oneHourAgo = new Date(Date.now() - 60 * 60_000)
    expect(isStale(oneHourAgo)).toBe(false)
  })

  it('isStale should return false for invalid input', async () => {
    const { isStale } = (await import('@/lib/dateUtils')) as {
      isStale: (d: Date | string) => boolean
    }
    expect(isStale('invalid')).toBe(false)
    expect(isStale('')).toBe(false)
  })

  it('formatTimestamp should produce a "Mon DD, YYYY HH:MM" formatted string', async () => {
    const { formatTimestamp } = (await import('@/lib/dateUtils')) as {
      formatTimestamp: (d: Date | string) => string
    }
    const result = formatTimestamp(new Date('2026-01-15T14:32:00'))
    // Loose check — locale formatting can introduce a comma or non-breaking space
    expect(result).toMatch(/Jan/i)
    expect(result).toMatch(/15/)
    expect(result).toMatch(/2026/)
    expect(result).toMatch(/14:32|2:32/)
  })
})

describe('Level 5 - Task 5.2: Agent Page Uses formatRelativeTime', () => {
  it('should import formatRelativeTime from the new module', () => {
    expect(fs.existsSync(agentPagePath)).toBe(true)
    const source = fs.readFileSync(agentPagePath, 'utf-8')

    expect(source).toMatch(/import\s+\{?[^}]*formatRelativeTime[^}]*\}?\s+from\s+['"][^'"]*dateUtils['"]/)
  })

  it('should not redefine an inline formatTime helper', () => {
    const source = fs.readFileSync(agentPagePath, 'utf-8')
    // The original inline function began with `const formatTime = (date: Date)` —
    // after the refactor it should have been replaced with the imported util.
    expect(source).not.toMatch(/const\s+formatTime\s*=\s*\(/)
  })
})

describe('Level 5 - Task 5.2: README Documentation', () => {
  it('should populate README.md with project documentation', () => {
    expect(
      fs.existsSync(readmePath),
      `Expected README.md at ${readmePath} but it was not found.`
    ).toBe(true)

    const content = fs.readFileSync(readmePath, 'utf-8')

    // Reasonable length — students should add sections, not leave the bootstrap text
    expect(
      content.length,
      'README.md still looks like the create-next-app boilerplate. Add project docs.'
    ).toBeGreaterThan(400)

    // Required sections / keywords
    expect(content).toMatch(/city hall/i)
    expect(content).toMatch(/admin/) // demo credentials
    expect(content).toMatch(/admin123/) // demo credentials
    expect(content).toMatch(/\/support/) // routes section
    expect(content).toMatch(/\/agent/)
  })
})
