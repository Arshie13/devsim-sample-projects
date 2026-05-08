/**
 * Shared test utilities and mock data for the Student Portal tests.
 */

export interface MockNote {
  id: string
  courseCode: string
  content: string
  createdAt: string
}

export const mockStudentNotes: MockNote[] = [
  {
    id: 'note-1',
    courseCode: 'CS 301',
    content: 'Review big-O notation before midterm.',
    createdAt: '2026-04-22T10:00:00.000Z',
  },
  {
    id: 'note-2',
    courseCode: 'MATH 301',
    content: 'Discrete math proof sets due Friday.',
    createdAt: '2026-05-01T09:30:00.000Z',
  },
]

export const validStudentId = '12-346-78'
export const validPassword = 'sample'

/**
 * Date utilities re-implemented for use in test assertions.
 * Mirrors the contract students implement in `src/lib/dateUtils.ts` (Level 5 Task 2).
 */
export function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Returns whole calendar days between two dates (positive if `target` is after `from`).
 */
export function diffCalendarDays(target: Date, from: Date = new Date()): number {
  const a = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const b = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  return Math.round((a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000))
}
