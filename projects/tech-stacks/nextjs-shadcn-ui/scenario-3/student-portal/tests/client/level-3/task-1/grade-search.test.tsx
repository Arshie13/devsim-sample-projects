/**
 * Level 3 - Task 3.1: Grade Search & Semester Filter
 *
 * Verifies:
 *   - A search input above the grades card filters by course code OR name
 *   - Semester filter chips (All / 1st Semester / 2nd Semester) work alongside search
 *   - "No grades found" appears when filters yield zero results
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import GradesPage from '@/app/dashboard/grades/page'

const switchToAllSemestersTab = () => {
  const allTab = screen.getByRole('tab', { name: /all semesters/i })
  fireEvent.click(allTab)
}

describe('Level 3 - Task 3.1: Grade Search', () => {
  it('should render a search input with the grades placeholder', () => {
    render(<GradesPage />)
    const searchInput = screen.getByPlaceholderText(/search grades/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('should filter grade rows by course code (case-insensitive) on the All Semesters tab', () => {
    render(<GradesPage />)
    switchToAllSemestersTab()
    const searchInput = screen.getByPlaceholderText(/search grades/i)

    fireEvent.change(searchInput, { target: { value: 'cs 301' } })

    expect(screen.getByText(/data structures and algorithms/i)).toBeInTheDocument()
    expect(screen.queryByText(/discrete mathematics/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/linear algebra/i)).not.toBeInTheDocument()
  })

  it('should filter grade rows by course name (case-insensitive)', () => {
    render(<GradesPage />)
    switchToAllSemestersTab()
    const searchInput = screen.getByPlaceholderText(/search grades/i)

    fireEvent.change(searchInput, { target: { value: 'database' } })

    expect(screen.getByText(/database management systems/i)).toBeInTheDocument()
    expect(screen.queryByText(/operating systems/i)).not.toBeInTheDocument()
  })

  it('should show "No grades found" when search yields no matches', () => {
    render(<GradesPage />)
    switchToAllSemestersTab()
    const searchInput = screen.getByPlaceholderText(/search grades/i)

    fireEvent.change(searchInput, { target: { value: 'zzz-no-such-course' } })

    expect(screen.getByText(/no grades found/i)).toBeInTheDocument()
  })

  it('should clear the filter and show all grades when input is emptied', () => {
    render(<GradesPage />)
    switchToAllSemestersTab()
    const searchInput = screen.getByPlaceholderText(/search grades/i)

    fireEvent.change(searchInput, { target: { value: 'database' } })
    fireEvent.change(searchInput, { target: { value: '' } })

    expect(screen.getByText(/data structures and algorithms/i)).toBeInTheDocument()
    expect(screen.getByText(/discrete mathematics/i)).toBeInTheDocument()
    expect(screen.getByText(/linear algebra/i)).toBeInTheDocument()
  })
})

describe('Level 3 - Task 3.1: Semester Filter', () => {
  it('should render filter chips for All, 1st Semester, 2nd Semester', () => {
    render(<GradesPage />)
    switchToAllSemestersTab()
    expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: /1st semester/i }).length
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByRole('button', { name: /2nd semester/i }).length
    ).toBeGreaterThan(0)
  })

  it('should hide non-matching grades when a semester chip is clicked', () => {
    render(<GradesPage />)
    switchToAllSemestersTab()

    const secondSemChip = screen.getAllByRole('button', { name: /2nd semester/i })[0]
    fireEvent.click(secondSemChip)

    // Linear Algebra is 2nd Semester 2024-2025 → should remain
    expect(screen.getByText(/linear algebra/i)).toBeInTheDocument()
    // Data Structures is 1st Semester 2025-2026 → should be filtered out
    expect(screen.queryByText(/data structures and algorithms/i)).not.toBeInTheDocument()
  })

  it('should combine search input with semester filter', () => {
    render(<GradesPage />)
    switchToAllSemestersTab()

    const firstSemChip = screen.getAllByRole('button', { name: /1st semester/i })[0]
    fireEvent.click(firstSemChip)

    const searchInput = screen.getByPlaceholderText(/search grades/i)
    fireEvent.change(searchInput, { target: { value: 'software' } })

    // Software Engineering is 1st Semester → should show
    expect(screen.getByText(/software engineering/i)).toBeInTheDocument()
    // Computer Networks is 2nd Semester → should be hidden
    expect(screen.queryByText(/computer networks/i)).not.toBeInTheDocument()
  })
})
