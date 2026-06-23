/**
 * Level 5 - Task 5.2: Transcript Export & Documentation
 *
 * Verifies:
 *   - src/lib/transcript.ts exports formatTranscript
 *   - formatTranscript renders a readable transcript and never throws
 *   - the agent dashboard exposes an "Export Transcript" affordance
 *   - README.md is populated with project documentation
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { join, resolve } from 'path'
import fs from 'fs'
import AgentPage from '@/app/agent/page'

const clientRoot = process.env.DEVSIM_CLIENT_ROOT ?? resolve(__dirname, '../../../')
const transcriptPath = join(clientRoot, 'src', 'lib', 'transcript.ts')
const agentPagePath = join(clientRoot, 'src', 'app', 'agent', 'page.tsx')
const readmePath = join(clientRoot, 'README.md')

const sampleConversation = {
  customer: { fullName: 'Jane Tester' },
  status: 'active',
  messages: [
    {
      role: 'customer',
      content: 'My streetlight has been out for two weeks.',
      timestamp: new Date('2026-05-07T10:01:00'),
    },
    {
      role: 'agent',
      content: 'Thanks for reporting it — I have logged a repair ticket.',
      timestamp: new Date('2026-05-07T10:05:00'),
    },
  ],
}

describe('Level 5 - Task 5.2: transcript module', () => {
  it('should exist at src/lib/transcript.ts', () => {
    expect(
      fs.existsSync(transcriptPath),
      `Expected transcript at ${transcriptPath} but it was not found.`
    ).toBe(true)
  })

  it('should export formatTranscript', async () => {
    expect(fs.existsSync(transcriptPath)).toBe(true)
    const mod = (await import('@/lib/transcript')) as Record<string, unknown>
    expect(typeof mod.formatTranscript).toBe('function')
  })

  it('formatTranscript should include the customer name and every message', async () => {
    const { formatTranscript } = await import('@/lib/transcript')
    const out = formatTranscript(sampleConversation)

    expect(typeof out).toBe('string')
    expect(out).toContain('Jane Tester')
    expect(out).toContain('My streetlight has been out for two weeks.')
    expect(out).toContain('Thanks for reporting it — I have logged a repair ticket.')
    expect(out).toMatch(/customer/i)
    expect(out).toMatch(/agent/i)
  })

  it('formatTranscript should return a string for a conversation with no messages', async () => {
    const { formatTranscript } = await import('@/lib/transcript')
    const out = formatTranscript({ customer: { fullName: 'Empty Case' }, status: 'active', messages: [] })
    expect(typeof out).toBe('string')
  })
})

describe('Level 5 - Task 5.2: transcript export on the agent dashboard', () => {
  it('should import the transcript module', () => {
    expect(fs.existsSync(agentPagePath)).toBe(true)
    const source = fs.readFileSync(agentPagePath, 'utf-8')
    expect(source).toMatch(/from\s+['"][^'"]*transcript['"]/)
  })

  it('should render an "Export Transcript" affordance', () => {
    render(<AgentPage />)
    expect(screen.getByRole('button', { name: /export transcript/i })).toBeInTheDocument()
  })
})

describe('Level 5 - Task 5.2: README documentation', () => {
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

    expect(content).toMatch(/city hall/i)
    expect(content).toMatch(/admin/) // demo credentials
    expect(content).toMatch(/admin123/) // demo credentials
    expect(content).toMatch(/\/support/) // routes section
    expect(content).toMatch(/\/agent/)
  })
})
