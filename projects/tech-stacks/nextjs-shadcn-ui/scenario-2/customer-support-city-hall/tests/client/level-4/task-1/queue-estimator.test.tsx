/**
 * Level 4 - Task 4.1: Live Queue Estimator
 *
 * Verifies:
 *   - estimateWaitMinutes computes a non-negative wait from a queue position
 *   - formatWait renders human-friendly wait copy with safe fallbacks
 *   - submitting the "Connect with an Agent" form shows a position + wait
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { join, resolve } from 'path'
import fs from 'fs'
import SupportPage from '@/app/support/page'

const clientRoot = process.env.DEVSIM_CLIENT_ROOT ?? resolve(__dirname, '../../../../client')
const queuePath = join(clientRoot, 'src', 'lib', 'queue.ts')

describe('Level 4 - Task 4.1: queue module', () => {
  it('should exist at src/lib/queue.ts', () => {
    expect(
      fs.existsSync(queuePath),
      `Expected queue at ${queuePath} but it was not found.`
    ).toBe(true)
  })

  it('should export estimateWaitMinutes and formatWait', async () => {
    expect(fs.existsSync(queuePath)).toBe(true)
    const mod = (await import('@/lib/queue')) as Record<string, unknown>
    expect(typeof mod.estimateWaitMinutes).toBe('function')
    expect(typeof mod.formatWait).toBe('function')
  })

  it('estimateWaitMinutes should use a default average handle time of 4 minutes', async () => {
    const { estimateWaitMinutes } = await import('@/lib/queue')
    expect(estimateWaitMinutes(3)).toBe(12)
  })

  it('estimateWaitMinutes should honour a custom average handle time', async () => {
    const { estimateWaitMinutes } = await import('@/lib/queue')
    expect(estimateWaitMinutes(2, 10)).toBe(20)
  })

  it('estimateWaitMinutes should never return a negative number', async () => {
    const { estimateWaitMinutes } = await import('@/lib/queue')
    expect(estimateWaitMinutes(-3)).toBe(0)
  })

  it('formatWait should describe sub-minute, minute-scale, and hour-plus waits', async () => {
    const { formatWait } = await import('@/lib/queue')
    expect(formatWait(0)).toMatch(/less than a minute/i)
    expect(formatWait(12)).toMatch(/about 12 minutes/i)
    expect(formatWait(75)).toMatch(/over an hour/i)
  })

  it('formatWait should return an empty string for invalid input', async () => {
    const { formatWait } = await import('@/lib/queue')
    expect(formatWait(NaN)).toBe('')
    expect(formatWait(Infinity)).toBe('')
  })
})

describe('Level 4 - Task 4.1: queue estimate on the support page', () => {
  it('should show a queue position and estimated wait after the form is submitted', () => {
    render(<SupportPage />)

    fireEvent.click(screen.getByRole('button', { name: /talk to agent/i }))

    fireEvent.change(screen.getByPlaceholderText(/enter your full name/i), {
      target: { value: 'Test Citizen' },
    })
    fireEvent.change(screen.getByPlaceholderText(/enter your address/i), {
      target: { value: '123 Test St' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^city$/i), {
      target: { value: 'Springfield' },
    })
    fireEvent.change(screen.getByPlaceholderText(/zip code/i), {
      target: { value: '12345' },
    })
    fireEvent.change(screen.getByPlaceholderText(/describe your issue/i), {
      target: { value: 'My streetlight has been out for two weeks.' },
    })

    fireEvent.click(screen.getByRole('button', { name: /submit request/i }))

    const waitLine = screen.getByText(/estimated wait/i)
    expect(waitLine).toBeInTheDocument()
    expect(waitLine.textContent).toMatch(
      /less than a minute|about \d+ minutes?|over an hour/i
    )
  })
})
