/**
 * Level 3 - Task 3.2: Student Notes Page
 *
 * Verifies:
 *   - The /dashboard/notes route exists and renders saved notes from
 *     localStorage key "studentNotes"
 *   - Submitting the new-note form persists a new entry
 *   - The dashboard sidebar links to the notes page
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { mockStudentNotes } from '../../../utils/render-utils'

describe('Level 3 - Task 3.2: Student Notes Page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render entries from localStorage "studentNotes"', async () => {
    localStorage.setItem('studentNotes', JSON.stringify(mockStudentNotes))

    const NotesPage = (await import('@/app/dashboard/notes/page')).default
    render(<NotesPage />)

    expect(screen.getByText(/review big-o notation before midterm/i)).toBeInTheDocument()
    expect(screen.getByText(/discrete math proof sets due friday/i)).toBeInTheDocument()
  })

  it('should show an empty-state message when no notes exist', async () => {
    const NotesPage = (await import('@/app/dashboard/notes/page')).default
    render(<NotesPage />)

    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument()
  })

  it('should display the course code for each note', async () => {
    localStorage.setItem('studentNotes', JSON.stringify(mockStudentNotes))

    const NotesPage = (await import('@/app/dashboard/notes/page')).default
    render(<NotesPage />)

    expect(screen.getAllByText(/cs 301/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/math 301/i).length).toBeGreaterThan(0)
  })
})

describe('Level 3 - Task 3.2: Sidebar Links to Notes', () => {
  it('should expose a "Notes" link in the dashboard sidebar', async () => {
    const DashboardLayout = (await import('@/app/dashboard/layout')).default
    render(
      <DashboardLayout>
        <div>child content</div>
      </DashboardLayout>
    )

    const notesLink =
      screen.queryByRole('link', { name: /notes/i }) ??
      screen.queryByRole('button', { name: /notes/i })

    expect(notesLink).not.toBeNull()
  })
})

describe('Level 3 - Task 3.2: Persisting New Notes', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should persist a new entry to "studentNotes" when the form is submitted', async () => {
    const NotesPage = (await import('@/app/dashboard/notes/page')).default
    render(<NotesPage />)

    const courseInput = screen.getByPlaceholderText(/course code/i)
    const contentInput = screen.getByPlaceholderText(/note|content/i)
    const addButton = screen.getByRole('button', { name: /add note/i })

    fireEvent.change(courseInput, { target: { value: 'CS 303' } })
    fireEvent.change(contentInput, {
      target: { value: 'Sprint planning meeting Wednesday at 3pm.' },
    })
    fireEvent.click(addButton)

    await waitFor(() => {
      const stored = localStorage.getItem('studentNotes')
      expect(stored).not.toBeNull()
      const parsed = JSON.parse(stored as string)
      expect(parsed.length).toBeGreaterThan(0)
      const last = parsed[parsed.length - 1]
      expect(last.courseCode).toBe('CS 303')
      expect(last.content).toMatch(/sprint planning/i)
      expect(typeof last.createdAt).toBe('string')
      expect(typeof last.id).toBe('string')
    })
  })
})
