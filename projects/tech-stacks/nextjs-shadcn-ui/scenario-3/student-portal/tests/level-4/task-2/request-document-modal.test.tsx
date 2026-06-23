/**
 * Level 4 - Task 4.2: Multi-Step "Request Document" Modal
 *
 * Verifies:
 *   - <Modal> primitive renders role="dialog" + aria-modal when open, returns null when closed
 *   - <RequestDocumentDialog> walks step 1 -> 2 -> 3 with correct button gating
 *   - Step 3 surfaces "Request submitted!", the chosen type, the purpose, and a REQ-XXXXXX reference
 *   - Dashboard page exposes a "Request Document" trigger button
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'

describe('Level 4 - Task 4.2: <Modal> primitive', () => {
  it('should render role="dialog" + aria-modal when open', async () => {
    const { Modal } = await import('@/components/ui/modal')
    render(
      <Modal open onClose={() => {}}>
        <p>modal body</p>
      </Modal>
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(screen.getByText(/modal body/i)).toBeInTheDocument()
  })

  it('should return null when closed', async () => {
    const { Modal } = await import('@/components/ui/modal')
    const { container } = render(
      <Modal open={false} onClose={() => {}}>
        <p>should not appear</p>
      </Modal>
    )
    expect(container.firstChild).toBeNull()
  })
})

describe('Level 4 - Task 4.2: <RequestDocumentDialog> multi-step flow', () => {
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
})

describe('Level 4 - Task 4.2: Dashboard exposes a Request Document trigger', () => {
  it('should render a button labeled "Request Document" on the dashboard', () => {
    render(<DashboardPage />)
    const trigger =
      screen.queryByRole('button', { name: /request document/i }) ??
      screen.queryByRole('link', { name: /request document/i })
    expect(trigger).not.toBeNull()
  })
})
