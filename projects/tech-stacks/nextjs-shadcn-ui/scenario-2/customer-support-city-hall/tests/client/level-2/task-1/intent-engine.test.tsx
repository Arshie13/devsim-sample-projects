/**
 * Level 2 - Task 2.1: Intent-Matching AI Engine
 *
 * The starter `getAIResponse` helper matches the FIRST keyword that appears
 * anywhere in the input — order-dependent and easily fooled. This task replaces
 * it with a scored intent matcher in src/lib/intentMatcher.ts.
 *
 * Verifies:
 *   - matchIntent scores keyword hits and returns the strongest intent
 *   - unmatched input resolves to the "fallback" intent
 *   - getAssistantReply returns intent copy; the fallback offers a human agent
 *   - the support page wires getAssistantReply into its chat flow
 */

import { describe, it, expect } from 'vitest'
import { join, resolve } from 'path'
import fs from 'fs'

const clientRoot = process.env.DEVSIM_CLIENT_ROOT ?? resolve(__dirname, '../../../../client')
const intentMatcherPath = join(clientRoot, 'src', 'lib', 'intentMatcher.ts')
const supportPagePath = join(clientRoot, 'src', 'app', 'support', 'page.tsx')

describe('Level 2 - Task 2.1: intentMatcher module', () => {
  it('should exist at src/lib/intentMatcher.ts', () => {
    expect(
      fs.existsSync(intentMatcherPath),
      `Expected intentMatcher at ${intentMatcherPath} but it was not found.`
    ).toBe(true)
  })

  it('should export matchIntent and getAssistantReply', async () => {
    expect(fs.existsSync(intentMatcherPath)).toBe(true)
    const mod = (await import('@/lib/intentMatcher')) as Record<string, unknown>
    expect(typeof mod.matchIntent).toBe('function')
    expect(typeof mod.getAssistantReply).toBe('function')
  })

  it('matchIntent should detect the permits intent', async () => {
    const { matchIntent } = await import('@/lib/intentMatcher')
    const result = matchIntent('How do I apply for a building permit license?')
    expect(result.intent).toBe('permits')
    expect(result.score).toBeGreaterThan(0)
  })

  it('matchIntent should detect the taxes intent', async () => {
    const { matchIntent } = await import('@/lib/intentMatcher')
    expect(matchIntent('I need to pay my property tax bill').intent).toBe('taxes')
  })

  it('matchIntent should pick the intent with the most keyword hits', async () => {
    const { matchIntent } = await import('@/lib/intentMatcher')
    // Three trash keywords (trash, garbage, pickup) vs one permits keyword.
    const result = matchIntent('my trash and garbage pickup was missed, also a permit question')
    expect(result.intent).toBe('trash')
  })

  it('matchIntent should fall back when nothing matches', async () => {
    const { matchIntent } = await import('@/lib/intentMatcher')
    const result = matchIntent('zxcvbnm qwerty asdfgh')
    expect(result.intent).toBe('fallback')
    expect(result.score).toBe(0)
  })

  it('getAssistantReply should return a non-empty reply for a known intent', async () => {
    const { getAssistantReply } = await import('@/lib/intentMatcher')
    const reply = getAssistantReply('Where do I get a parking permit?')
    expect(typeof reply).toBe('string')
    expect(reply.length).toBeGreaterThan(0)
  })

  it('getAssistantReply should offer a human agent on the fallback path', async () => {
    const { getAssistantReply } = await import('@/lib/intentMatcher')
    expect(getAssistantReply('zxcvbnm qwerty asdfgh')).toMatch(/agent/i)
  })
})

describe('Level 2 - Task 2.1: support page integration', () => {
  it('should route chat replies through the intentMatcher module', () => {
    expect(fs.existsSync(supportPagePath)).toBe(true)
    const source = fs.readFileSync(supportPagePath, 'utf-8')
    expect(source).toMatch(/from\s+['"][^'"]*intentMatcher['"]/)
    expect(source).toMatch(/getAssistantReply/)
  })
})
