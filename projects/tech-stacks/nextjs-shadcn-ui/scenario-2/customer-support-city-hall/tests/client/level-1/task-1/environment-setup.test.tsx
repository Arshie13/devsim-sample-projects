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

    expect(
      envContent,
      '.env.local should contain NEXT_PUBLIC_APP_NAME with value "City Hall Support"'
    ).toMatch(/NEXT_PUBLIC_APP_NAME\s*=\s*["']?City Hall Support["']?/)

    expect(
      envContent,
      '.env.local should contain NEXT_PUBLIC_SUPPORT_PHONE with value "(555) 123-4567"'
    ).toMatch(/NEXT_PUBLIC_SUPPORT_PHONE\s*=\s*["']?\(555\) 123-4567["']?/)

    expect(
      envContent,
      '.env.local should contain NEXT_PUBLIC_SUPPORT_EMAIL with value "support@cityhall.gov"'
    ).toMatch(/NEXT_PUBLIC_SUPPORT_EMAIL\s*=\s*["']?support@cityhall\.gov["']?/)
  })

  it('should expose NEXT_PUBLIC_APP_NAME after parsing .env.local', () => {
    const envLocalPath = join(clientRoot, '.env.local')
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf-8')
      envContent.split('\n').forEach((line) => {
        const match = line.match(/^NEXT_PUBLIC_APP_NAME\s*=\s*["']?(.+?)["']?$/)
        if (match) {
          process.env.NEXT_PUBLIC_APP_NAME = match[1].trim()
        }
      })
    }
    expect(process.env.NEXT_PUBLIC_APP_NAME).toBe('City Hall Support')
  })

  it('should expose NEXT_PUBLIC_SUPPORT_PHONE after parsing .env.local', () => {
    const envLocalPath = join(clientRoot, '.env.local')
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf-8')
      envContent.split('\n').forEach((line) => {
        const match = line.match(/^NEXT_PUBLIC_SUPPORT_PHONE\s*=\s*["']?(.+?)["']?$/)
        if (match) {
          process.env.NEXT_PUBLIC_SUPPORT_PHONE = match[1].trim()
        }
      })
    }
    expect(process.env.NEXT_PUBLIC_SUPPORT_PHONE).toBe('(555) 123-4567')
  })

  it('should expose NEXT_PUBLIC_SUPPORT_EMAIL after parsing .env.local', () => {
    const envLocalPath = join(clientRoot, '.env.local')
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf-8')
      envContent.split('\n').forEach((line) => {
        const match = line.match(/^NEXT_PUBLIC_SUPPORT_EMAIL\s*=\s*["']?(.+?)["']?$/)
        if (match) {
          process.env.NEXT_PUBLIC_SUPPORT_EMAIL = match[1].trim()
        }
      })
    }
    expect(process.env.NEXT_PUBLIC_SUPPORT_EMAIL).toBe('support@cityhall.gov')
  })
})
