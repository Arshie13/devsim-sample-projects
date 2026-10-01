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

describe('Level 2 - Task 2.2: quick replies on the agent dashboard with shadcn ScrollArea', () => {
  it('should have ScrollArea component installed from shadcn', () => {
    const scrollAreaPath = join(clientRoot, 'src', 'components', 'ui', 'scroll-area.tsx')
    expect(fs.existsSync(scrollAreaPath)).toBe(true)
    const content = fs.readFileSync(scrollAreaPath, 'utf-8')
    expect(content).toMatch(/\bScrollArea\b/)
    expect(content).toMatch(/\bScrollBar\b/)
    expect(content).toMatch(/\bScrollAreaViewport\b/)
  })

  it('should render quick-reply buttons inside a ScrollArea', async () => {
    const list = await loadSnippets()
    render(<AgentPage />)

    // Find the ScrollArea viewport
    const scrollArea = screen.getByRole('region', { name: /quick replies|quick replies/i })
    expect(scrollArea).toBeInTheDocument()

    // ScrollArea should have proper shadcn classes
    const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]') || scrollArea
    expect(viewport).toBeInTheDocument()

    // ScrollBar should be present
    const scrollBar = scrollArea.querySelector('[data-radix-scroll-area-scrollbar]')
    expect(scrollBar).toBeInTheDocument()
  })

  it('should render a button for each quick-reply snippet inside ScrollArea', async () => {
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

  it('should import ScrollArea from @/components/ui/scroll-area in agent page', () => {
    const agentPagePath = join(clientRoot, 'src', 'app', 'agent', 'page.tsx')
    expect(fs.existsSync(agentPagePath)).toBe(true)
    const source = fs.readFileSync(agentPagePath, 'utf-8')
    expect(source).toMatch(/from\s+['"]@\/components\/ui\/scroll-area['"]/)
    expect(source).toMatch(/ScrollArea(?:Viewport|ScrollBar)?/)
  })
})

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const exactName = (label: string) => new RegExp(`^${escapeRegExp(label)}$`, 'i')

async function loadSnippets(): Promise<Array<{ id: string; label: string; text: string }>> {
  const mod = (await import('@/lib/quickReplies')) as Record<string, unknown>
  return (mod.quickReplies ?? mod.default) as Array<{ id: string; label: string; text: string }>
}