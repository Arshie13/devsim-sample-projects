// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { join, resolve } from 'path'
import fs from 'fs'

const projectRoot =
  process.env.DEVSIM_PROJECT_ROOT ?? resolve(__dirname, '../../../')

function stripComments(content: string): string {
  return content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
}

describe('Level 1 Task 2: Branding Update', () => {
  it('should replace "Sign In" with "Log In" on the login page', () => {
    const loginPath = join(projectRoot, 'src', 'app', 'login', 'page.tsx')
    const content = stripComments(fs.readFileSync(loginPath, 'utf-8'))
    expect(content).toContain('Log In')
    expect(content).not.toContain('Sign In')
  })
})
