/**
 * Level 3 - Task 3.2: First-Response SLA Indicator
 *
 * Verifies:
 *   - hasAgentReplied detects whether any agent message exists
 *   - getServiceState classifies a conversation's service state
 *   - the agent dashboard badges conversations awaiting a first reply
 */

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { join, resolve } from 'path'
import fs from 'fs'
import AgentPage from '@/app/agent/page'

const clientRoot = process.env.DEVSIM_CLIENT_ROOT ?? resolve(__dirname, '../../../../client')
const slaPath = join(clientRoot, 'src', 'lib', 'sla.ts')

const msgs = (...roles: string[]) => roles.map((role) => ({ role }))

describe('Level 3 - Task 3.2: sla module', () => {
  it('should exist at src/lib/sla.ts', () => {
    expect(
      fs.existsSync(slaPath),
      `Expected sla at ${slaPath} but it was not found.`
    ).toBe(true)
  })

  it('should export hasAgentReplied and getServiceState', async () => {
    expect(fs.existsSync(slaPath)).toBe(true)
    const mod = (await import('@/lib/sla')) as Record<string, unknown>
    expect(typeof mod.hasAgentReplied).toBe('function')
    expect(typeof mod.getServiceState).toBe('function')
  })

  it('hasAgentReplied should be false when no agent message exists', async () => {
    const { hasAgentReplied } = await import('@/lib/sla')
    expect(hasAgentReplied({ messages: msgs('system', 'customer', 'customer') })).toBe(false)
  })

  it('hasAgentReplied should be true once an agent has replied', async () => {
    const { hasAgentReplied } = await import('@/lib/sla')
    expect(hasAgentReplied({ messages: msgs('customer', 'agent') })).toBe(true)
  })

  it('getServiceState should report "resolved" for resolved conversations', async () => {
    const { getServiceState } = await import('@/lib/sla')
    expect(getServiceState({ status: 'resolved', messages: msgs('customer', 'agent') })).toBe(
      'resolved'
    )
  })

  it('getServiceState should report "awaiting-first-reply" when no agent has replied', async () => {
    const { getServiceState } = await import('@/lib/sla')
    expect(getServiceState({ status: 'active', messages: msgs('system', 'customer') })).toBe(
      'awaiting-first-reply'
    )
  })

  it('getServiceState should report "in-progress" once an agent has replied', async () => {
    const { getServiceState } = await import('@/lib/sla')
    expect(
      getServiceState({ status: 'waiting', messages: msgs('system', 'customer', 'agent') })
    ).toBe('in-progress')
  })
})

describe('Level 3 - Task 3.2: SLA badges on the agent dashboard', () => {
  it('should badge conversations that have no agent reply', () => {
    render(<AgentPage />)

    // Seed: John & Maria have only system/customer messages; Robert (resolved)
    // already has an agent message.
    const johnRow = screen.getByRole('button', { name: /john smith/i })
    const mariaRow = screen.getByRole('button', { name: /maria garcia/i })
    const robertRow = screen.getByRole('button', { name: /robert johnson/i })

    expect(within(johnRow).getByText(/awaiting first reply/i)).toBeInTheDocument()
    expect(within(mariaRow).getByText(/awaiting first reply/i)).toBeInTheDocument()
    expect(within(robertRow).queryByText(/awaiting first reply/i)).toBeNull()
  })

  it('should surface more than one conversation awaiting a first reply', () => {
    render(<AgentPage />)
    expect(screen.getAllByText(/awaiting first reply/i).length).toBeGreaterThanOrEqual(2)
  })
})
