// @vitest-environment node

import { describe, expect, it, afterAll } from 'vitest'
import { spawn, type ChildProcess } from 'child_process'
import { join, resolve } from 'path'
import fs from 'fs'

const projectRoot =
  process.env.DEVSIM_PROJECT_ROOT ?? resolve(__dirname, '../../../')

describe('Level 1 Task 1: Project Setup', () => {
  let devProcess: ChildProcess | null = null

  afterAll(() => {
    if (devProcess) {
      devProcess.kill()
      devProcess = null
    }
  })

  it('should have dependencies installed', () => {
    expect(
      fs.existsSync(join(projectRoot, 'node_modules')),
      'node_modules missing — run "pnpm install" first.'
    ).toBe(true)

    expect(
      fs.existsSync(join(projectRoot, 'node_modules', 'next')),
      'Dependency "next" missing — run "pnpm install" first.'
    ).toBe(true)

    expect(
      fs.existsSync(join(projectRoot, 'node_modules', 'react')),
      'Dependency "react" missing — run "pnpm install" first.'
    ).toBe(true)
  })

  it('should start the dev server successfully', async () => {
    const started = new Promise<void>((resolvePromise, reject) => {
      const proc = spawn('pnpm', ['dev'], {
        cwd: projectRoot,
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: process.platform === 'win32',
      })
      devProcess = proc

      const timer = setTimeout(() => {
        proc.kill()
        devProcess = null
        reject(new Error('Dev server did not start within 30 seconds'))
      }, 30_000)

      const onData = (data: Buffer) => {
        const text = data.toString()
        if (/ready|Local:/i.test(text)) {
          clearTimeout(timer)
          proc.kill()
          devProcess = null
          resolvePromise()
        }
      }

      proc.stdout!.on('data', onData)
      proc.stderr!.on('data', onData)
      proc.on('error', (err) => {
        clearTimeout(timer)
        devProcess = null
        reject(err)
      })
      proc.on('exit', (code) => {
        // next dev exits after first successful build by default
        if (code !== null && code !== 0) {
          clearTimeout(timer)
          devProcess = null
          reject(new Error(`Dev server exited with code ${code}`))
        }
      })
    })

    await expect(started).resolves.toBeUndefined()
  }, 60_000)

  it('should have the alert component from shadcn', () => {
    const alertPath = join(projectRoot, 'src', 'components', 'ui', 'alert.tsx')
    expect(
      fs.existsSync(alertPath),
      'alert.tsx not found. Run "pnpm dlx shadcn@latest add alert" to add it.'
    ).toBe(true)

    const content = fs.readFileSync(alertPath, 'utf-8')
    expect(content).toMatch(/\bAlert\b/)
    expect(content).toMatch(/\bAlertTitle\b/)
    expect(content).toMatch(/\bAlertDescription\b/)
  })
})
