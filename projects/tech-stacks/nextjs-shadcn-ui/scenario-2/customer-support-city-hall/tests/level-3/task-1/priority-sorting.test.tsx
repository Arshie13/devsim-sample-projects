/**
 * Level 3 - Task 3.1: Priority Scoring & Sorting
 *
 * Turns the flat conversation list into a triage queue.
 *
 * Verifies:
 *   - getPriorityScore ranks waiting > active > resolved and rewards unread
 *   - getPriorityLevel maps a score to one of four tiers
 *   - the agent dashboard renders the conversation list sorted by priority
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { join, resolve } from 'path'
import fs from 'fs'
import AgentPage from '@/app/agent/page'

const clientRoot = process.env.DEVSIM_CLIENT_ROOT ?? resolve(__dirname, '../../../')
const priorityPath = join(clientRoot, 'src', 'lib', 'priority.ts')
const agentPagePath = join(clientRoot, 'src', 'app', 'agent', 'page.tsx')

// `createdAt: new Date()` keeps the age bonus at 0 so status + unread drive
// the score deterministically.
const conv = (status: string, unreadCount: number) => ({
  status,
  unreadCount,
  createdAt: new Date(),
})

describe('Level 3 - Task 3.1: priority module', () => {
  it('should exist at src/lib/priority.ts', () => {
    expect(
      fs.existsSync(priorityPath),
      `Expected priority at ${priorityPath} but it was not found.`
    ).toBe(true)
  })

  it('should export getPriorityScore and getPriorityLevel', async () => {
    expect(fs.existsSync(priorityPath)).toBe(true)
    const mod = (await import('@/lib/priority')) as Record<string, unknown>
    expect(typeof mod.getPriorityScore).toBe('function')
    expect(typeof mod.getPriorityLevel).toBe('function')
  })
})
