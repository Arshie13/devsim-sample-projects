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
  it('should update the layout metadata title to "SM Tech Library"', () => {
    const layoutPath = join(projectRoot, 'src', 'app', 'layout.tsx')
    const content = fs.readFileSync(layoutPath, 'utf-8')
    expect(content).toContain('SM Tech Library')
    expect(content).not.toContain('BookWise Library')
  })

  it('should update the login page heading to "SM Tech Library"', () => {
    const loginPath = join(projectRoot, 'src', 'app', 'login', 'page.tsx')
    const content = stripComments(fs.readFileSync(loginPath, 'utf-8'))
    expect(content).toContain('SM Tech Library')
    expect(content).not.toContain('BookWise Library')
  })

  it('should replace "Sign Up" with "Register" on the login page', () => {
    const loginPath = join(projectRoot, 'src', 'app', 'login', 'page.tsx')
    const content = stripComments(fs.readFileSync(loginPath, 'utf-8'))
    expect(content).toContain('Register')
    expect(content).not.toContain('Sign Up')
  })

  it('should update the dashboard header brand to "SM Tech Library"', () => {
    const dashboardPath = join(projectRoot, 'src', 'app', 'dashboard', 'page.tsx')
    const content = stripComments(fs.readFileSync(dashboardPath, 'utf-8'))
    expect(content).toContain('SM Tech Library')
    expect(content).not.toContain('BookWise Library')
  })
})
