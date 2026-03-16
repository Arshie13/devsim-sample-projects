/**
 * Level 2 Task 2: Adopt Availability Helper in Borrow Flow
 *
 * Acceptance Criteria:
 * - AC-1: BorrowRecords uses shared helper output for availability filtering
 * - AC-2: Borrow flow behavior remains correct after refactor
 */

/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { BorrowRecords } from '../../../../client/src/pages/BorrowRecords';

const { mockUseLibrary, mockIsBookAvailable } = vi.hoisted(() => ({
  mockUseLibrary: vi.fn(),
  mockIsBookAvailable: vi.fn((availableCopies: number) => availableCopies > 0),
}));

vi.mock('../../../../client/src/context/LibraryContext', () => ({
  useLibrary: mockUseLibrary,
}));

vi.mock('../../../../client/src/utils/helpers', async () => {
  const actual = await vi.importActual<typeof import('../../../../client/src/utils/helpers')>(
    '../../../../client/src/utils/helpers',
  );

  return {
    ...actual,
    isBookAvailable: (availableCopies: number) => mockIsBookAvailable(availableCopies),
  };
});

const openIssueModal = () => {
  fireEvent.click(screen.getByRole('button', { name: /\+ Issue Book/i }));
};

const getBookOptionLabels = () => {
  const placeholderOption = screen.getByRole('option', { name: 'Select a book' });
  const select = placeholderOption.closest('select');
  if (!select) throw new Error('Book select not found');

  return within(select)
    .getAllByRole('option')
    .map((option) => option.textContent?.trim() ?? '');
};

const setupBorrowRecords = (
  books: Array<{ id: string; title: string; availableCopies: number }>,
) => {
  mockUseLibrary.mockReturnValue({
    books,
    members: [{ id: 'member-1', name: 'John Doe', email: 'john@example.com' }],
    borrowRecords: [],
    loading: false,
    borrowBookMember: vi.fn(async () => true),
    borrowBookWalkIn: vi.fn(async () => true),
    returnBook: vi.fn(async () => true),
    getBorrowerName: vi.fn(() => 'John Doe'),
    error: null,
    clearError: vi.fn(),
  });

  render(React.createElement(BorrowRecords));
};

describe('Level 2 Task 2: Availability Helper Adoption', () => {
  beforeEach(() => {
    mockUseLibrary.mockReset();
    mockIsBookAvailable.mockReset();
    mockIsBookAvailable.mockImplementation(
      (availableCopies: number) => availableCopies > 0,
    );
  });

  describe('AC-1: Helper Adoption in Borrow Flow', () => {
    it('should keep only helper-available books as selectable in Issue Book flow', () => {
      setupBorrowRecords([
        { id: 'b1', title: 'Available A', availableCopies: 2 },
        { id: 'b2', title: 'Available B', availableCopies: 1 },
        { id: 'b3', title: 'Unavailable Zero', availableCopies: 0 },
        { id: 'b4', title: 'Unavailable Negative', availableCopies: -2 },
      ]);

      openIssueModal();
      const labels = getBookOptionLabels();

      expect(labels).toContain('Available A (2 available)');
      expect(labels).toContain('Available B (1 available)');
      expect(labels.includes('Unavailable Zero (0 available)')).toBe(false);
      expect(labels.includes('Unavailable Negative (-2 available)')).toBe(false);
    });

    it('should follow helper output when helper logic changes', () => {
      mockIsBookAvailable.mockImplementation(
        (availableCopies: number) => availableCopies > 0 && availableCopies % 2 === 0,
      );

      setupBorrowRecords([
        { id: 'b1', title: 'Odd One', availableCopies: 1 },
        { id: 'b2', title: 'Even Two', availableCopies: 2 },
        { id: 'b3', title: 'Odd Three', availableCopies: 3 },
        { id: 'b4', title: 'Even Four', availableCopies: 4 },
      ]);

      openIssueModal();
      const labels = getBookOptionLabels();

      expect(labels).toContain('Even Two (2 available)');
      expect(labels).toContain('Even Four (4 available)');
      expect(labels.includes('Odd One (1 available)')).toBe(false);
      expect(labels.includes('Odd Three (3 available)')).toBe(false);
    });

    it('should evaluate availability through helper for each candidate book', () => {
      setupBorrowRecords([
        { id: 'b1', title: 'Book One', availableCopies: 1 },
        { id: 'b2', title: 'Book Zero', availableCopies: 0 },
        { id: 'b3', title: 'Book Two', availableCopies: 2 },
      ]);

      openIssueModal();

      expect(mockIsBookAvailable).toHaveBeenCalledWith(1);
      expect(mockIsBookAvailable).toHaveBeenCalledWith(0);
      expect(mockIsBookAvailable).toHaveBeenCalledWith(2);
    });
  });

  describe('AC-2: Behavior Preservation', () => {
    it('should keep selectable list stable across repeated modal open/close cycles', () => {
      setupBorrowRecords([
        { id: 'b1', title: 'Stable A', availableCopies: 2 },
        { id: 'b2', title: 'Stable B', availableCopies: 0 },
      ]);

      openIssueModal();
      const firstOpenLabels = getBookOptionLabels();
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      openIssueModal();
      const secondOpenLabels = getBookOptionLabels();

      expect(firstOpenLabels).toEqual(secondOpenLabels);
    });

    it('should preserve helper-driven behavior for mixed copy counts', () => {
      setupBorrowRecords([
        { id: 'b1', title: 'Positive', availableCopies: 3 },
        { id: 'b2', title: 'Zero', availableCopies: 0 },
        { id: 'b3', title: 'Negative', availableCopies: -1 },
      ]);

      openIssueModal();
      const labels = getBookOptionLabels();

      expect(labels).toContain('Positive (3 available)');
      expect(labels.includes('Zero (0 available)')).toBe(false);
      expect(labels.includes('Negative (-1 available)')).toBe(false);
    });
  });
});

describe('Level 2 Task 2: Hidden Specificity Guards', () => {
  it('should produce no selectable books when helper denies all books', () => {
    mockIsBookAvailable.mockImplementation(() => false);

    setupBorrowRecords([
      { id: 'b1', title: 'Book A', availableCopies: 10 },
      { id: 'b2', title: 'Book B', availableCopies: 1 },
    ]);

    openIssueModal();
    const labels = getBookOptionLabels();

    expect(labels).toEqual(['Select a book']);
  });

  it('should preserve boundary behavior controlled by helper implementation', () => {
    mockIsBookAvailable.mockImplementation(
      (availableCopies: number) => availableCopies > Number.EPSILON,
    );

    setupBorrowRecords([
      { id: 'b1', title: 'Boundary Zero', availableCopies: 0 },
      { id: 'b2', title: 'Boundary Epsilon', availableCopies: Number.EPSILON },
      { id: 'b3', title: 'Boundary Above', availableCopies: 0.0001 },
    ]);

    openIssueModal();
    const labels = getBookOptionLabels();

    expect(labels.includes('Boundary Zero (0 available)')).toBe(false);
    expect(labels.includes(`Boundary Epsilon (${Number.EPSILON} available)`)).toBe(false);
    expect(labels).toContain('Boundary Above (0.0001 available)');
  });
});
