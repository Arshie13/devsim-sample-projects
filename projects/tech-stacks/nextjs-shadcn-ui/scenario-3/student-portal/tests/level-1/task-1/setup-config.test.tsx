// @vitest-environment node

/**
 * Level 1 - Task 1.1: Local Setup & Portal Config Module
 *
 * Verifies:
 *   - Client dependencies are installed
 *   - src/lib/portalConfig.ts exists with SCHOOL_NAME, SCHOOL_TAGLINE, PORTAL_ACCENT
 *   - Dashboard layout brand label is sourced from SCHOOL_NAME (no longer "Student Portal")
 */

import { describe, expect, it } from 'vitest'
import { join, resolve } from 'path'
import fs from 'fs'

const projectRoot =
  process.env.DEVSIM_PROJECT_ROOT ?? resolve(__dirname, '../../../')

describe('Level 1 - Task 1.1: Setup & Portal Config Module', () => {
  it('should have dependencies installed', () => {
    expect(
      fs.existsSync(join(projectRoot, 'node_modules')),
      'node_modules missing. Run "pnpm install" first.'
    ).toBe(true)

    expect(
      fs.existsSync(join(projectRoot, 'node_modules', 'next')),
      'Dependency "next" missing.'
    ).toBe(true)

    expect(
      fs.existsSync(join(projectRoot, 'node_modules', 'react')),
      'Dependency "react" missing.'
    ).toBe(true)
  })

  it('should expose src/lib/portalConfig.ts with the required named exports', () => {
    const configPath = join(projectRoot, 'src', 'lib', 'portalConfig.ts')
    expect(
      fs.existsSync(configPath),
      `Expected config module at ${configPath}.`
    ).toBe(true)

    const contents = fs.readFileSync(configPath, 'utf-8')

    expect(
      contents,
      'portalConfig.ts should `export const SCHOOL_NAME = "Riverside University"`'
    ).toMatch(/export\s+const\s+SCHOOL_NAME\s*=\s*["']Riverside University["']/)

    expect(
      contents,
      'portalConfig.ts should `export const SCHOOL_TAGLINE = "Learn. Grow. Graduate."`'
    ).toMatch(/export\s+const\s+SCHOOL_TAGLINE\s*=\s*["']Learn\. Grow\. Graduate\.["']/)

    expect(
      contents,
      'portalConfig.ts should `export const PORTAL_ACCENT = "blue"`'
    ).toMatch(/export\s+const\s+PORTAL_ACCENT\s*=\s*["']blue["']/)
  })

  it('should import SCHOOL_NAME from portalConfig inside dashboard/layout.tsx', () => {
    const layoutPath = join(projectRoot, 'src', 'app', 'dashboard', 'layout.tsx')
    const contents = fs.readFileSync(layoutPath, 'utf-8')

    expect(
      /import\s*{[^}]*SCHOOL_NAME[^}]*}\s*from\s*["']@\/lib\/portalConfig["']/.test(contents) ||
        /import\s*{[^}]*SCHOOL_NAME[^}]*}\s*from\s*["'].*portalConfig.*["']/.test(contents),
      'dashboard/layout.tsx must import SCHOOL_NAME from @/lib/portalConfig.'
    ).toBe(true)

    expect(
      /<span[^>]*>\s*Student Portal\s*<\/span>/.test(contents),
      'dashboard/layout.tsx still contains the hard-coded "Student Portal" brand label.'
    ).toBe(false)
  })
})
