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
  it('should update the layout metadata title to "City Hall Support"', () => {
    const layoutPath = join(projectRoot, 'src', 'app', 'layout.tsx')
    const content = fs.readFileSync(layoutPath, 'utf-8')
    expect(content).toContain('City Hall Support')
    expect(content).not.toContain('Create Next App')
  })

  it('should replace "Sign In" with "Login" on the agent login page', () => {
    const loginPath = join(projectRoot, 'src', 'app', 'agent', 'login', 'page.tsx')
    const content = stripComments(fs.readFileSync(loginPath, 'utf-8'))
    expect(content).toContain('Login')
    expect(content).not.toContain('Sign In')
  })

  it('should replace "Return to menu" with "Back to Home" on the support page', () => {
    const supportPath = join(projectRoot, 'src', 'app', 'support', 'page.tsx')
    const content = stripComments(fs.readFileSync(supportPath, 'utf-8'))
    expect(content).toContain('Back to Home')
    expect(content).not.toContain('Return to menu')
  })
})
