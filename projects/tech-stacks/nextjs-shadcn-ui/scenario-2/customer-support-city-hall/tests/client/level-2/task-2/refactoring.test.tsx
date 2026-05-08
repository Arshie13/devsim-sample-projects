/**
 * Level 2 - Task 2.2: Refactoring & Component Extraction
 *
 * Tests:
 *   1. A reusable MessageBubble component exists at src/components/MessageBubble.tsx
 *   2. The agent page derives its activity counts via a single useMemo
 *      instead of three inline .filter() calls.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { join, resolve } from 'path'
import fs from 'fs'

const clientRoot = process.env.DEVSIM_CLIENT_ROOT ?? resolve(__dirname, '../../../../client')
const componentsDir = join(clientRoot, 'src', 'components')
const messageBubblePath = join(componentsDir, 'MessageBubble.tsx')
const agentPagePath = join(clientRoot, 'src', 'app', 'agent', 'page.tsx')

describe('Level 2 - Task 2.2: MessageBubble Component', () => {
  it('should export a MessageBubble component from src/components/MessageBubble.tsx', () => {
    expect(
      fs.existsSync(messageBubblePath),
      `Expected MessageBubble at ${messageBubblePath} but it was not found.`
    ).toBe(true)

    const source = fs.readFileSync(messageBubblePath, 'utf-8')
    expect(source).toMatch(/export\s+(default\s+)?function\s+MessageBubble|export\s+const\s+MessageBubble/)
  })

  it('should accept a viewer prop on MessageBubble', () => {
    expect(fs.existsSync(messageBubblePath)).toBe(true)
    const source = fs.readFileSync(messageBubblePath, 'utf-8')
    expect(source).toMatch(/viewer/)
  })

  it('should be imported by the agent page', () => {
    expect(fs.existsSync(agentPagePath)).toBe(true)
    const source = fs.readFileSync(agentPagePath, 'utf-8')
    expect(source).toMatch(/import\s+\{?\s*MessageBubble\s*\}?\s+from/)
  })

  it('should be imported by the support page', () => {
    const supportPagePath = join(clientRoot, 'src', 'app', 'support', 'page.tsx')
    expect(fs.existsSync(supportPagePath)).toBe(true)
    const source = fs.readFileSync(supportPagePath, 'utf-8')
    expect(source).toMatch(/import\s+\{?\s*MessageBubble\s*\}?\s+from/)
  })

  it('should render messages in the agent page through the new component', async () => {
    const AgentPage = (await import('@/app/agent/page')).default
    render(<AgentPage />)
    const customerMessage = screen.getByText(/I need help immediately/i)
    expect(customerMessage).toBeInTheDocument()
  })
})

describe('Level 2 - Task 2.2: useMemo for Conversation Stats', () => {
  it('should derive activity counts via useMemo on the agent page', () => {
    expect(fs.existsSync(agentPagePath)).toBe(true)
    const source = fs.readFileSync(agentPagePath, 'utf-8')

    // useMemo should be imported alongside other React hooks
    expect(source).toMatch(/import[^;]*\buseMemo\b[^;]*from\s+['"]react['"]/)

    // useMemo block should reference the conversation stats
    expect(source).toMatch(/useMemo\([^)]*\)|useMemo\s*\(/)
    expect(source).toMatch(/active\s*[:,]/)
    expect(source).toMatch(/waiting\s*[:,]/)
  })

  it('should remove the standalone activeCount/waitingCount filter calls', () => {
    const source = fs.readFileSync(agentPagePath, 'utf-8')
    // The original code had three separate inline filter calls — after the
    // refactor they should be folded into a single useMemo.
    const filterCount = (source.match(/conversations\.filter\(/g) ?? []).length
    expect(
      filterCount,
      `Expected at most one .filter() call after extracting stats into useMemo, but found ${filterCount}.`
    ).toBeLessThanOrEqual(1)
  })
})
