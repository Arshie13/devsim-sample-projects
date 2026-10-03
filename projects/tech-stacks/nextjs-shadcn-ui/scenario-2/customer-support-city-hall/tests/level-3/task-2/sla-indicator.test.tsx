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
})
