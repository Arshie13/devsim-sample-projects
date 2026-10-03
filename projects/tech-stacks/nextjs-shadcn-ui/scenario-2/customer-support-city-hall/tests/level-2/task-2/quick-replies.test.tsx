/**
 * Level 2 - Task 2.2: Agent Quick-Reply Snippets with shadcn ScrollArea
 * Tests that quick replies are rendered in a shadcn ScrollArea
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { join, resolve } from 'path'
import fs from 'fs'
import AgentPage from '@/app/agent/page'

const clientRoot = process.env.DEVSIM_CLIENT_ROOT ?? resolve(__dirname, '../../../')
const quickRepliesPath = join(clientRoot, 'src', 'lib', 'quickReplies.ts')

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

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
