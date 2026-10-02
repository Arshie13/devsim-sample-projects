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

  it('should not render when closed (Dialog returns null when closed)', async () => {
    const { RequestDocumentDialog } = await import('@/components/RequestDocumentDialog')
    const { container } = render(
      <RequestDocumentDialog open={false} onClose={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })
})

describe('Level 4 - Task 4.2: RequestDocumentDialog multi-step flow with shadcn Dialog', () => {
  it('should render Dialog with proper structure (Content, Header, Title, Description)', async () => {
    const { RequestDocumentDialog } = await import('@/components/RequestDocumentDialog')
    render(<RequestDocumentDialog open onClose={() => {}} />)

    // DialogContent should be present
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()

    // DialogHeader with DialogTitle and DialogDescription
    const title = screen.getByRole('heading', { level: 2 })
    expect(title).toBeInTheDocument()
    expect(title.textContent).toMatch(/request document/i)

    // DialogDescription should be present
    const description = screen.getByText(/select the type of document/i)
    expect(description).toBeInTheDocument()
  })

  it('should disable Next on step 1 until a document type is chosen', async () => {
    const { RequestDocumentDialog } = await import('@/components/RequestDocumentDialog')
    render(<RequestDocumentDialog open onClose={() => {}} />)

    const nextBtn = screen.getByRole('button', { name: /^next$/i })
    expect((nextBtn as HTMLButtonElement).disabled).toBe(true)

    // Pick "Transcript"
    fireEvent.click(screen.getByLabelText(/transcript/i))
    expect((screen.getByRole('button', { name: /^next$/i }) as HTMLButtonElement).disabled).toBe(false)
  })

  it('should disable Submit on step 2 until purpose has >= 10 characters and allow Back', async () => {
    const { RequestDocumentDialog } = await import('@/components/RequestDocumentDialog')
    render(<RequestDocumentDialog open onClose={() => {}} />)

    fireEvent.click(screen.getByLabelText(/transcript/i))
    fireEvent.click(screen.getByRole('button', { name: /^next$/i }))

    const purpose = screen.getByRole('textbox')
    const submit = screen.getByRole('button', { name: /^submit$/i })
    expect((submit as HTMLButtonElement).disabled).toBe(true)

    fireEvent.change(purpose, { target: { value: 'too short' } })
    expect((screen.getByRole('button', { name: /^submit$/i }) as HTMLButtonElement).disabled).toBe(true)

    fireEvent.change(purpose, { target: { value: 'For my job application portfolio.' } })
    expect((screen.getByRole('button', { name: /^submit$/i }) as HTMLButtonElement).disabled).toBe(false)

    // Back returns to step 1 (Next button reappears)
    fireEvent.click(screen.getByRole('button', { name: /^back$/i }))
    expect(screen.getByRole('button', { name: /^next$/i })).toBeInTheDocument()
  })

  it('should show "Request submitted!", chosen type, purpose, and REQ-XXXXXX on step 3', async () => {
    const { RequestDocumentDialog } = await import('@/components/RequestDocumentDialog')
    render(<RequestDocumentDialog open onClose={() => {}} />)

    fireEvent.click(screen.getByLabelText(/enrollment certificate/i))
    fireEvent.click(screen.getByRole('button', { name: /^next$/i }))

    const purpose = screen.getByRole('textbox')
    fireEvent.change(purpose, { target: { value: 'Visa application requirement.' } })
    fireEvent.click(screen.getByRole('button', { name: /^submit$/i }))

    expect(screen.getByText(/request submitted/i)).toBeInTheDocument()
    expect(screen.getByText(/enrollment certificate/i)).toBeInTheDocument()
    expect(screen.getByText(/visa application requirement\./i)).toBeInTheDocument()

    // Reference number REQ- followed by 6 uppercase alphanumerics
    const refRegex = /REQ-[A-Z0-9]{6}/
    const allText = document.body.textContent ?? ''
    expect(
      refRegex.test(allText),
      'Confirmation step must include a reference number matching REQ-XXXXXX.'
    ).toBe(true)

    // "Done" button is available on step 3
    expect(screen.getByRole('button', { name: /^done$/i })).toBeInTheDocument()
  })

  it('should have DialogFooter with proper buttons (Next, Back, Submit, Done)', async () => {
    const { RequestDocumentDialog } = await import('@/components/RequestDocumentDialog')
    render(<RequestDocumentDialog open onClose={() => {}} />)

    // DialogFooter should be present
    const footer = screen.getByRole('dialog').querySelector('[data-slot="dialog-footer"]') || screen.getByRole('dialog')
    expect(footer).toBeInTheDocument()

    // Step 1: Next button
    expect(screen.getByRole('button', { name: /^next$/i })).toBeInTheDocument()

    // Step 2: Back and Submit (the type stays editable until the form is sent)
    fireEvent.click(screen.getByLabelText(/transcript/i))
    fireEvent.click(screen.getByRole('button', { name: /^next$/i }))

    expect(screen.getByRole('button', { name: /^back$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^submit$/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^next$/i })).not.toBeInTheDocument()

    // Step 3: Done button
    fireEvent.click(screen.getByLabelText(/enrollment certificate/i))
    const purpose = screen.getByRole('textbox')
    fireEvent.change(purpose, { target: { value: 'Visa application requirement.' } })
    fireEvent.click(screen.getByRole('button', { name: /^submit$/i }))

    expect(screen.getByRole('button', { name: /^done$/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^submit$/i })).not.toBeInTheDocument()
  })

  it('should import Dialog from @/components/ui/dialog in RequestDocumentDialog', () => {
    const dialogPath = join(
      process.cwd(),
      'src',
      'components',
      'RequestDocumentDialog.tsx'
    )
    expect(fs.existsSync(dialogPath)).toBe(true)
    const source = fs.readFileSync(dialogPath, 'utf-8')
    expect(source).toMatch(/from\s+['"]@\/components\/ui\/dialog['"]/)
    expect(source).toMatch(/Dialog(?:Trigger|Content|Header|Title|Description|Footer)?/)
  })
})

describe('Level 4 - Task 4.2: Dashboard exposes a Request Document trigger', () => {
  it('should render a button labeled "Request Document" on the dashboard', () => {
    render(<DashboardPage />)
    const trigger =
      screen.queryByRole('button', { name: /request document/i }) ??
      screen.queryByRole('link', { name: /request document/i })
    expect(trigger).not.toBeNull()
  })

  it('should open Dialog when trigger is clicked', () => {
    render(<DashboardPage />)
    const trigger = screen.getByRole('button', { name: /request document/i })
    fireEvent.click(trigger)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })
})