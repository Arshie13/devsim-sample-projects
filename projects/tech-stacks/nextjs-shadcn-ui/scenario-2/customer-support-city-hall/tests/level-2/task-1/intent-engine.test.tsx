/**
 * Level 2 - Task 2.1: AI Fallback Alert in Support Chat
 *
 * When the AI intent matcher falls back to "unknown" intent, the chat
 * should show a prominent Alert banner offering to transfer to a human agent,
 * rather than just showing a generic fallback message inline.
 *
 * Implementation requirements:
 * - Use the shadcn/ui Alert component (warning variant)
 * - Show the alert only when the AI returns the "fallback" intent
 * - Include an "Escalate to Human Agent" button
 * - Alert should appear above the chat messages
 * - Clicking the button should navigate to /support/queue or trigger a handoff
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import SupportPage from '@/app/support/page'
import { join, resolve } from 'path'
import fs from 'fs'

const clientRoot = process.env.DEVSIM_CLIENT_ROOT ?? resolve(__dirname, '../../../')

describe('Level 2 - Task 2.1: AI Fallback Alert in Support Chat', () => {
  it('shows a fallback alert when AI returns unknown intent', () => {
    render(<SupportPage />)

    // Alert banner should be present when fallback is triggered
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()

    // Uses warning variant for fallback notice
    expect(alert).toHaveClass('border-l-4')
    expect(alert).toHaveClass('border-l-amber-500')
    expect(alert).toHaveClass('bg-amber-50')
    expect(alert).toHaveClass('text-amber-900')

    // AlertTitle mentions human agent / escalation
    const title = screen.getByRole('heading', { level: 5 })
    expect(title).toBeInTheDocument()
    expect(title.textContent).toMatch(/human agent|escalat/i)
  })

  it('includes an "Escalate to Human Agent" button', () => {
    render(<SupportPage />)

    const escalateBtn = screen.getByRole('button', { name: /escalate|transfer|human agent/i })
    expect(escalateBtn).toBeInTheDocument()
  })

  it('button click navigates to handoff/queue page', () => {
    render(<SupportPage />)
    const router = useRouter()

    const escalateBtn = screen.getByRole('button', { name: /escalate|transfer|human agent/i })
    fireEvent.click(escalateBtn)

    expect(router.push).toHaveBeenCalledWith('/support/queue')
    // The banner stays visible so the handoff notice is not lost on navigation.
    expect(escalateBtn).toBeInTheDocument()
  })

  it('imports Alert from @/components/ui/alert in support page', () => {
    const supportPagePath = join(clientRoot, 'src', 'app', 'support', 'page.tsx')
    expect(fs.existsSync(supportPagePath)).toBe(true)
    const source = fs.readFileSync(supportPagePath, 'utf-8')
    expect(source).toMatch(/from\s+['"]@\/components\/ui\/alert['"]/)
    expect(source).toMatch(/Alert(?:Title|Description)?/)
  })
})