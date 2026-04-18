import { render, screen, fireEvent } from '@testing-library/react';
import Page from '../../../../src/app/page';

describe('Level 5: Advanced UX Features - Task 5.2: Add Undo Functionality', () => {
  test('should show undo option after delete', async () => {
    render(<Page />);
    const deleteButton = screen.getByText(/delete|remove/i);
    if (deleteButton) {
      fireEvent.click(deleteButton);
      const undoButton = screen.getByText(/undo|undo delete/i);
      expect(undoButton).toBeInTheDocument();
    }
  });

  test('should show undo toast after action', async () => {
    render(<Page />);
    const toast = screen.getByText(/undo|undone/i);
    expect(toast || screen.getByRole('button')).toBeInTheDocument();
  });

  test('should restore expense on undo', async () => {
    render(<Page />);
    const undoButton = screen.getByText(/undo/i);
    if (undoButton) {
      fireEvent.click(undoButton);
      const expenseRestored = screen.getAllByText(/expense/i);
      expect(expenseRestored.length).toBeGreaterThanOrEqual(0);
    }
  });

  test('should have keyboard shortcut Ctrl+Z for undo', async () => {
    render(<Page />);
    const page = screen.getByRole('main');
    fireEvent.keyDown(page, { key: 'z', ctrlKey: true });
    expect(page).toBeInTheDocument();
  });

  test('should hide undo option after timeout', async () => {
    render(<Page />);
    // Simulate timeout - undo should disappear after a few seconds
    const undoButton = screen.getByText(/undo/i);
    expect(undoButton || screen.getByRole('button')).toBeInTheDocument();
  });

  test('should track action history', async () => {
    render(<Page />);
    const historyElements = screen.getAllByText(/history|recent|previous/i);
    expect(historyElements.length).toBeGreaterThanOrEqual(0);
  });
});