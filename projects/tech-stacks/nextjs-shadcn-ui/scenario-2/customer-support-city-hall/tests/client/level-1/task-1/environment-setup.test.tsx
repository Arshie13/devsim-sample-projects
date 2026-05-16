// @vitest-environment node

/**
 * Level 1 Task 1.1: Environment Setup Verification (Client)
 *
 * Output-oriented test suite — each test verifies a concrete artifact
 * (node_modules, .env.local) rather than assuming a pre-existing state.
 *
 * Test structure per case:
 *   1. CHECK for node_modules and key dependencies
 *   2. CHECK for .env.local with the expected variables
 *   3. SURFACE actionable error messages on failure
 */

import { describe, expect, it } from 'vitest'
import { join } from 'path'
import fs from 'fs'

// ---------------------------------------------------------------------------
// Path resolution — driven by env vars so Docker containers can override
// these without touching the test file.
// ---------------------------------------------------------------------------
const projectRoot =
  process.env.DEVSIM_PROJECT_ROOT ?? '/workspace'
const clientRoot =
  process.env.DEVSIM_CLIENT_ROOT ?? join(projectRoot, 'client')

// ---------------------------------------------------------------------------
// .env.local parsing helper
//
// Tolerant of how the file was authored — LF or CRLF line endings, surrounding
// whitespace, `export ` prefixes, and single/double quoted values. Previously
// the line scan split only on '\n', so a CRLF-authored file left a trailing
// '\r' that the anchored `$` regex could not match (JS `.` does not match
// '\r'), making the test pass only for LF-only files.
// ---------------------------------------------------------------------------
function readEnvValue(envContent: string, key: string): string | undefined {
  for (const rawLine of envContent.split(/\r?\n/)) {
    const line = rawLine.trim()
    const match = line.match(
      new RegExp(`^(?:export\\s+)?${key}\\s*=\\s*(.*)$`)
    )
    if (match) {
      // Strip a single matching pair of surrounding quotes, if present.
      return match[1].trim().replace(/^(['"])(.*)\1$/, '$2').trim()
    }
  }
  return undefined
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Level 1 Task 1.1: Environment Setup (Client)', () => {
  it('should have client dependencies already installed', () => {
    expect(
      fs.existsSync(join(clientRoot, 'node_modules')),
      'Client node_modules missing. Run "npm install" in client first.'
    ).toBe(true)

    expect(
      fs.existsSync(join(clientRoot, 'node_modules', 'react')),
      'Client dependency "react" missing. Run "npm install" in client first.'
    ).toBe(true)

    expect(
      fs.existsSync(join(clientRoot, 'node_modules', 'next')),
      'Client dependency "next" missing. Run "npm install" in client first.'
    ).toBe(true)
  })

  it('should have a .env.local file at client/ with the expected variables', () => {
    const envLocalPath = join(clientRoot, '.env.local')
    expect(
      fs.existsSync(envLocalPath),
      `.env.local file not found at ${envLocalPath}. Create it with NEXT_PUBLIC_APP_NAME, NEXT_PUBLIC_SUPPORT_PHONE, NEXT_PUBLIC_SUPPORT_EMAIL.`
    ).toBe(true)

    const envContent = fs.readFileSync(envLocalPath, 'utf-8')

    // Parse with the same tolerant helper the tests below use, so quoting
    // style, LF/CRLF line endings, and surrounding whitespace are all handled
    // in one place — instead of per-variable regexes that drift out of sync.
    expect(
      readEnvValue(envContent, 'NEXT_PUBLIC_APP_NAME'),
      '.env.local should contain NEXT_PUBLIC_APP_NAME with value "City Hall Support"'
    ).toBe('City Hall Support')

    expect(
      readEnvValue(envContent, 'NEXT_PUBLIC_SUPPORT_PHONE'),
      '.env.local should contain NEXT_PUBLIC_SUPPORT_PHONE with value "(555) 123-4567"'
    ).toBe('(555) 123-4567')

    expect(
      readEnvValue(envContent, 'NEXT_PUBLIC_SUPPORT_EMAIL'),
      '.env.local should contain NEXT_PUBLIC_SUPPORT_EMAIL with value "support@cityhall.gov"'
    ).toBe('support@cityhall.gov')
  })

  it('should expose NEXT_PUBLIC_APP_NAME after parsing .env.local', () => {
    const envLocalPath = join(clientRoot, '.env.local')
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf-8')
      const value = readEnvValue(envContent, 'NEXT_PUBLIC_APP_NAME')
      if (value !== undefined) {
        process.env.NEXT_PUBLIC_APP_NAME = value
      }
    }
    expect(process.env.NEXT_PUBLIC_APP_NAME).toBe('City Hall Support')
  })

  it('should expose NEXT_PUBLIC_SUPPORT_PHONE after parsing .env.local', () => {
    const envLocalPath = join(clientRoot, '.env.local')
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf-8')
      const value = readEnvValue(envContent, 'NEXT_PUBLIC_SUPPORT_PHONE')
      if (value !== undefined) {
        process.env.NEXT_PUBLIC_SUPPORT_PHONE = value
      }
    }
    expect(process.env.NEXT_PUBLIC_SUPPORT_PHONE).toBe('(555) 123-4567')
  })

  it('should expose NEXT_PUBLIC_SUPPORT_EMAIL after parsing .env.local', () => {
    const envLocalPath = join(clientRoot, '.env.local')
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf-8')
      const value = readEnvValue(envContent, 'NEXT_PUBLIC_SUPPORT_EMAIL')
      if (value !== undefined) {
        process.env.NEXT_PUBLIC_SUPPORT_EMAIL = value
      }
    }
    expect(process.env.NEXT_PUBLIC_SUPPORT_EMAIL).toBe('support@cityhall.gov')
  })
})
