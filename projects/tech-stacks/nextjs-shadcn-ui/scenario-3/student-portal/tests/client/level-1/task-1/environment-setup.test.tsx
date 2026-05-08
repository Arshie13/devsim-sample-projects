// @vitest-environment node

/**
 * Level 1 Task 1.1: Environment Setup Verification
 *
 * Output-oriented test suite — each test verifies a concrete artifact
 * (node_modules, .env.local) rather than assuming a pre-existing state.
 */

import { describe, expect, it } from 'vitest'
import { join, resolve } from 'path'
import fs from 'fs'

const projectRoot =
  process.env.DEVSIM_PROJECT_ROOT ?? resolve(__dirname, '../../../..')

describe('Level 1 Task 1.1: Environment Setup', () => {
  it('should have project dependencies already installed', () => {
    expect(
      fs.existsSync(join(projectRoot, 'node_modules')),
      'node_modules missing. Run "npm install" first.'
    ).toBe(true)

    expect(
      fs.existsSync(join(projectRoot, 'node_modules', 'react')),
      'Dependency "react" missing. Run "npm install" first.'
    ).toBe(true)

    expect(
      fs.existsSync(join(projectRoot, 'node_modules', 'next')),
      'Dependency "next" missing. Run "npm install" first.'
    ).toBe(true)
  })

  it('should have a .env.local file at the project root with the expected variables', () => {
    const envLocalPath = join(projectRoot, '.env.local')
    expect(
      fs.existsSync(envLocalPath),
      `.env.local file not found at ${envLocalPath}. Create it with NEXT_PUBLIC_SCHOOL_NAME, NEXT_PUBLIC_REGISTRAR_EMAIL, NEXT_PUBLIC_ACADEMIC_YEAR.`
    ).toBe(true)

    const envContent = fs.readFileSync(envLocalPath, 'utf-8')

    expect(
      envContent,
      '.env.local should contain NEXT_PUBLIC_SCHOOL_NAME with value "Riverside University"'
    ).toMatch(/NEXT_PUBLIC_SCHOOL_NAME\s*=\s*["']?Riverside University["']?/)

    expect(
      envContent,
      '.env.local should contain NEXT_PUBLIC_REGISTRAR_EMAIL with value "registrar@riverside.edu"'
    ).toMatch(/NEXT_PUBLIC_REGISTRAR_EMAIL\s*=\s*["']?registrar@riverside\.edu["']?/)

    expect(
      envContent,
      '.env.local should contain NEXT_PUBLIC_ACADEMIC_YEAR with value "2025-2026"'
    ).toMatch(/NEXT_PUBLIC_ACADEMIC_YEAR\s*=\s*["']?2025-2026["']?/)
  })

  it('should expose NEXT_PUBLIC_SCHOOL_NAME after parsing .env.local', () => {
    const envLocalPath = join(projectRoot, '.env.local')
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf-8')
      envContent.split('\n').forEach((line) => {
        const match = line.match(/^NEXT_PUBLIC_SCHOOL_NAME\s*=\s*["']?(.+?)["']?$/)
        if (match) {
          process.env.NEXT_PUBLIC_SCHOOL_NAME = match[1].trim()
        }
      })
    }
    expect(process.env.NEXT_PUBLIC_SCHOOL_NAME).toBe('Riverside University')
  })

  it('should expose NEXT_PUBLIC_REGISTRAR_EMAIL after parsing .env.local', () => {
    const envLocalPath = join(projectRoot, '.env.local')
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf-8')
      envContent.split('\n').forEach((line) => {
        const match = line.match(/^NEXT_PUBLIC_REGISTRAR_EMAIL\s*=\s*["']?(.+?)["']?$/)
        if (match) {
          process.env.NEXT_PUBLIC_REGISTRAR_EMAIL = match[1].trim()
        }
      })
    }
    expect(process.env.NEXT_PUBLIC_REGISTRAR_EMAIL).toBe('registrar@riverside.edu')
  })

  it('should expose NEXT_PUBLIC_ACADEMIC_YEAR after parsing .env.local', () => {
    const envLocalPath = join(projectRoot, '.env.local')
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf-8')
      envContent.split('\n').forEach((line) => {
        const match = line.match(/^NEXT_PUBLIC_ACADEMIC_YEAR\s*=\s*["']?(.+?)["']?$/)
        if (match) {
          process.env.NEXT_PUBLIC_ACADEMIC_YEAR = match[1].trim()
        }
      })
    }
    expect(process.env.NEXT_PUBLIC_ACADEMIC_YEAR).toBe('2025-2026')
  })
})
