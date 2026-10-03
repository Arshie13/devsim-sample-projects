/**
 * Level 4 - Task 4.2: Multi-Step "Request Document" Dialog
 * Tests that the request document flow uses shadcn Dialog component
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'
import { join } from 'path'
import fs from 'fs'

describe('Level 4 - Task 4.2: shadcn Dialog for Request Document', () => {
  it('should have Dialog component installed from shadcn', () => {
    const dialogPath = join(
      process.cwd(),
      'src',
      'components',
      'ui',
      'dialog.tsx'
    )
    expect(fs.existsSync(dialogPath)).toBe(true)
    const content = fs.readFileSync(dialogPath, 'utf-8')
    expect(content).toMatch(/\bDialog\b/)
    expect(content).toMatch(/\bDialogTrigger\b/)
    expect(content).toMatch(/\bDialogContent\b/)
    expect(content).toMatch(/\bDialogHeader\b/)
    expect(content).toMatch(/\bDialogTitle\b/)
    expect(content).toMatch(/\bDialogDescription\b/)
    expect(content).toMatch(/\bDialogFooter\b/)
  })

  it('should render Dialog with role="dialog" + aria-modal when open', async () => {
    const { RequestDocumentDialog } = await import('@/components/RequestDocumentDialog')
    render(<RequestDocumentDialog open onClose={() => {}} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog.getAttribute('aria-modal')).toBe('true')
  })
})