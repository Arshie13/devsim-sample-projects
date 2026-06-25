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
  it('should render "Riverside University" in the dashboard header brand', () => {
    const layoutPath = join(projectRoot, 'src', 'app', 'dashboard', 'layout.tsx')
    const content = stripComments(fs.readFileSync(layoutPath, 'utf-8'))
    expect(content).toContain('Riverside University')
    expect(content).not.toContain('Student Portal')
  })

  it('should render "Riverside University" as the login page heading', () => {
    const loginPath = join(projectRoot, 'src', 'app', 'login', 'page.tsx')
    const content = stripComments(fs.readFileSync(loginPath, 'utf-8'))
    expect(content).toContain('Riverside University')
    expect(content).not.toContain('Student Portal')
  })
})
