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

  it('getPriorityScore should always score a resolved conversation at 0', async () => {
    const { getPriorityScore } = await import('@/lib/priority')
    expect(getPriorityScore(conv('resolved', 9))).toBe(0)
  })

  it('getPriorityScore should rank waiting above active', async () => {
    const { getPriorityScore } = await import('@/lib/priority')
    expect(getPriorityScore(conv('waiting', 0))).toBeGreaterThan(
      getPriorityScore(conv('active', 0))
    )
  })

  it('getPriorityScore should reward unread messages', async () => {
    const { getPriorityScore } = await import('@/lib/priority')
    expect(getPriorityScore(conv('active', 5))).toBeGreaterThan(
      getPriorityScore(conv('active', 0))
    )
  })

  it('getPriorityLevel should map scores to the four tiers', async () => {
    const { getPriorityLevel } = await import('@/lib/priority')
    expect(getPriorityLevel(conv('waiting', 3))).toBe('urgent') // 40 + 30 = 70
    expect(getPriorityLevel(conv('waiting', 0))).toBe('high') //  40
    expect(getPriorityLevel(conv('active', 0))).toBe('normal') // 10
    expect(getPriorityLevel(conv('resolved', 4))).toBe('low') //  0
  })
})

describe('Level 3 - Task 3.1: agent dashboard sorting', () => {
  it('should import the priority module', () => {
    expect(fs.existsSync(agentPagePath)).toBe(true)
    const source = fs.readFileSync(agentPagePath, 'utf-8')
    expect(source).toMatch(/from\s+['"][^'"]*priority['"]/)
  })

  it('should order the conversation list by priority, highest first', () => {
    render(<AgentPage />)

    // Conversation rows are <button> elements; collect them in DOM order.
    const order = screen
      .getAllByRole('button')
      .map((b) => b.textContent ?? '')
      .filter((t) => /(john smith|maria garcia|robert johnson)/i.test(t))

    const indexOf = (re: RegExp) => order.findIndex((t) => re.test(t))

    // Seed scores: Maria (waiting) 40+ > John (active, 2 unread) 30 > Robert (resolved) 0
    expect(order.length).toBe(3)
    expect(indexOf(/maria garcia/i)).toBe(0)
    expect(indexOf(/john smith/i)).toBe(1)
    expect(indexOf(/robert johnson/i)).toBe(2)
  })
})
