/**
 * Level 5 - Task 5.2: Transcript Export & Toast Component
 * Tests for transcript module, export affordance, and shadcn/ui Toast component
 *
 * This task uses the Toast component installed in Level 1.
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { join, resolve } from 'path'
import fs from 'fs'
import AgentPage from '@/app/agent/page'

const clientRoot = process.env.DEVSIM_CLIENT_ROOT ?? resolve(__dirname, '../../../')
const transcriptPath = join(clientRoot, 'src', 'lib', 'transcript.ts')
const agentPagePath = join(clientRoot, 'src', 'app', 'agent', 'page.tsx')

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
    expect(source).toMatch(/formatTranscript/)
  })

  it('should render an "Export Transcript" affordance', () => {
    render(<AgentPage />)
    expect(screen.getByRole('button', { name: /export transcript/i })).toBeInTheDocument()
  })
})

describe('Level 5 - Task 5.2: shadcn/ui Toast Component (installed in Level 1)', () => {
  it('should use the Toast component installed in Level 1', () => {
    const toastPath = join(clientRoot, 'src', 'components', 'ui', 'toast.tsx')
    expect(fs.existsSync(toastPath)).toBe(true)
    const content = fs.readFileSync(toastPath, 'utf-8')
    expect(content).toMatch(/\bToast\b/)
    expect(content).toMatch(/\bToastProvider\b/)
    expect(content).toMatch(/\bToastViewport\b/)
    expect(content).toMatch(/\bToastTitle\b/)
    expect(content).toMatch(/\bToastDescription\b/)
    expect(content).toMatch(/\bToastAction\b/)
    expect(content).toMatch(/\buseToast\b/)
  })

  it('should show a toast when transcript is exported', () => {
    render(<AgentPage />)

    const exportButton = screen.getByRole('button', { name: /export transcript/i })
    fireEvent.click(exportButton)

    // Toast should appear
    const toast = screen.getByRole('status', { name: /exported|complete|success/i })
    expect(toast).toBeInTheDocument()
  })

  it('should import Toast from @/components/ui/toast in agent page', () => {
    expect(fs.existsSync(agentPagePath)).toBe(true)
    const source = fs.readFileSync(agentPagePath, 'utf-8')
    expect(source).toMatch(/from\s+['"]@\/components\/ui\/toast['"]/)
    expect(source).toMatch(/Toast(?:Provider|Viewport|Title|Description|Action)?/)
    expect(source).toMatch(/useToast/)
  })
})

