/**
 * Level 2 - Task 2.2: Agent Quick-Reply Snippets
 *
 * Agents retype the same opening/closing lines all day. This task adds a
 * library of canned snippets (src/lib/quickReplies.ts) and a row of one-click
 * buttons above the agent message input that insert a snippet's text.
 *
 * Verifies:
 *   - quickReplies exports a non-empty array of { id, label, text } snippets
 *   - the agent dashboard renders a button per snippet
 *   - clicking a snippet appends its text to the message input
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { join, resolve } from 'path'
import fs from 'fs'
import AgentPage from '@/app/agent/page'

const clientRoot = process.env.DEVSIM_CLIENT_ROOT ?? resolve(__dirname, '../../../../client')
const quickRepliesPath = join(clientRoot, 'src', 'lib', 'quickReplies.ts')

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Anchored, case-insensitive match on a button's full accessible name.
const exactName = (label: string) => new RegExp(`^${escapeRegExp(label)}$`, 'i')

async function loadSnippets(): Promise<Array<{ id: string; label: string; text: string }>> {
  const mod = (await import('@/lib/quickReplies')) as Record<string, unknown>
  return (mod.quickReplies ?? mod.default) as Array<{ id: string; label: string; text: string }>
}

describe('Level 2 - Task 2.2: quickReplies module', () => {
  it('should exist at src/lib/quickReplies.ts', () => {
    expect(
      fs.existsSync(quickRepliesPath),
      `Expected quickReplies at ${quickRepliesPath} but it was not found.`
    ).toBe(true)
  })

  it('should export a non-empty array of { id, label, text } snippets', async () => {
    expect(fs.existsSync(quickRepliesPath)).toBe(true)
    const list = await loadSnippets()
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBeGreaterThan(0)
    for (const snippet of list) {
      expect(typeof snippet.id).toBe('string')
      expect(typeof snippet.label).toBe('string')
      expect(typeof snippet.text).toBe('string')
      expect(snippet.text.length).toBeGreaterThan(0)
    }
  })
})

describe('Level 2 - Task 2.2: quick replies on the agent dashboard', () => {
  it('should render a button for each quick-reply snippet', async () => {
    const list = await loadSnippets()
    render(<AgentPage />)
    for (const snippet of list) {
      expect(
        screen.getByRole('button', { name: exactName(snippet.label) }),
        `Expected a quick-reply button labelled "${snippet.label}".`
      ).toBeInTheDocument()
    }
  })

  it('should append the snippet text to the message input when clicked', async () => {
    const list = await loadSnippets()
    const first = list[0]

    render(<AgentPage />)
    const input = screen.getByPlaceholderText(/type your response/i) as HTMLInputElement

    fireEvent.click(screen.getByRole('button', { name: exactName(first.label) }))

    expect(input.value).toContain(first.text)
  })

  it('should preserve text the agent already typed when inserting a snippet', async () => {
    const list = await loadSnippets()
    const first = list[0]

    render(<AgentPage />)
    const input = screen.getByPlaceholderText(/type your response/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Hi there. ' } })

    fireEvent.click(screen.getByRole('button', { name: exactName(first.label) }))

    expect(input.value).toContain('Hi there.')
    expect(input.value).toContain(first.text)
  })
})
