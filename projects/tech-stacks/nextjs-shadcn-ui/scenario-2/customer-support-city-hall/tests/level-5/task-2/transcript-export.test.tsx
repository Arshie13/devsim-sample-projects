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
})

