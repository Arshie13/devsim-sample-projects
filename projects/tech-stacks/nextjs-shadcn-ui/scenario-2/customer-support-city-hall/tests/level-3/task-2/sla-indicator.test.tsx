/**
 * Level 3 - Task 3.2: First-Response SLA Indicator with shadcn Badge
 * Tests that SLA badges use shadcn Badge component
 */

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { join, resolve } from 'path'
import fs from 'fs'
import AgentPage from '@/app/agent/page'

const clientRoot = process.env.DEVSIM_CLIENT_ROOT ?? resolve(__dirname, '../../../')
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

describe('Level 3 - Task 3.2: SLA Badges with shadcn Badge component', () => {
  it('should have Badge component installed from shadcn', () => {
    const badgePath = join(
      process.cwd(),
      'src',
      'components',
      'ui',
      'badge.tsx'
    )
    expect(fs.existsSync(badgePath)).toBe(true)
    const content = fs.readFileSync(badgePath, 'utf-8')
    expect(content).toMatch(/\bBadge\b/)
    expect(content).toMatch(/variant/)
    expect(content).toMatch(/forwardRef/)
  })

  it('should render SLA badges using shadcn Badge component', () => {
    render(<AgentPage />)

    // Seed: John & Maria have only system/customer messages; Robert (resolved)
    // already has an agent message.
    const johnRow = screen.getByRole('button', { name: /john smith/i })
    const mariaRow = screen.getByRole('button', { name: /maria garcia/i })
    const robertRow = screen.getByRole('button', { name: /robert johnson/i })

    // John & Maria should have "Awaiting First Reply" badge
    const johnBadge = within(johnRow).getByText(/awaiting first reply/i)
    expect(johnBadge).toBeInTheDocument()
    expect(johnBadge.closest('[data-badge]') || johnBadge.closest('[class*="badge"]') || johnBadge.parentElement).toBeInTheDocument()

    const mariaBadge = within(mariaRow).getByText(/awaiting first reply/i)
    expect(mariaBadge).toBeInTheDocument()

    // Robert (resolved) should not have the badge
    expect(within(robertRow).queryByText(/awaiting first reply/i)).toBeNull()
  })

  it('should use Badge component with proper variant classes', () => {
    render(<AgentPage />)

    const johnRow = screen.getByRole('button', { name: /john smith/i })
    const badge = within(johnRow).getByText(/awaiting first reply/i)

    // Badge should have shadcn classes
    expect(badge).toHaveClass('inline-flex')
    expect(badge).toHaveClass('items-center')
    expect(badge).toHaveClass('rounded-full')
    expect(badge).toHaveClass('px-2.5')
    expect(badge).toHaveClass('py-0.5')
    expect(badge).toHaveClass('text-xs')
    expect(badge).toHaveClass('font-medium')
    expect(badge).toHaveClass('transition-colors')
  })

  it('should surface more than one conversation awaiting a first reply', () => {
    render(<AgentPage />)
    expect(screen.getAllByText(/awaiting first reply/i).length).toBeGreaterThanOrEqual(2)
  })

  it('should import Badge from @/components/ui/badge in agent page', () => {
    const agentPagePath = join(
      process.env.DEVSIM_CLIENT_ROOT ?? resolve(__dirname, '../../../'),
      'src',
      'app',
      'agent',
      'page.tsx'
    )
    expect(fs.existsSync(agentPagePath)).toBe(true)
    const source = fs.readFileSync(agentPagePath, 'utf-8')
    expect(source).toMatch(/from\s+['"]@\/components\/ui\/badge['"]/)
    expect(source).toMatch(/Badge/)
  })
})

const msgs = (...roles: string[]) => roles.map((role) => ({ role }))