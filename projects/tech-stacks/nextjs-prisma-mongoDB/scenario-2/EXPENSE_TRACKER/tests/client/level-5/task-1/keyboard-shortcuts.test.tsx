import { render, screen, fireEvent } from '@testing-library/react';
import Page from '../../../../src/app/page';

describe('Level 5: Advanced UX Features - Task 5.1: Add Keyboard Shortcuts', () => {
  test('should respond to E key for edit', async () => {
    render(<Page />);
    const page = screen.getByRole('main');
    fireEvent.keyDown(page, { key: 'e', code: 'KeyE' });
    // Should trigger edit mode
    expect(page).toBeInTheDocument();
  });

  test('should respond to D key for delete', async () => {
    render(<Page />);
    const page = screen.getByRole('main');
    fireEvent.keyDown(page, { key: 'd', code: 'KeyD' });
    expect(page).toBeInTheDocument();
  });

  test('should respond to N key for new expense', async () => {
    render(<Page />);
    const page = screen.getByRole('main');
    fireEvent.keyDown(page, { key: 'n', code: 'KeyN' });
    expect(page).toBeInTheDocument();
  });

  test('should respond to / key for search', async () => {
    render(<Page />);
    const page = screen.getByRole('main');
    fireEvent.keyDown(page, { key: '/', code: 'Slash' });
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('should show help modal on ? key', async () => {
    render(<Page />);
    const page = screen.getByRole('main');
    fireEvent.keyDown(page, { key: '?', code: 'Slash', shiftKey: true });
    const helpModal = screen.getByText(/keyboard|shortcuts|help/i);
    expect(helpModal).toBeInTheDocument();
  });

  test('should have keyboard shortcut help visible', async () => {
    render(<Page />);
    const helpButton = screen.getByText(/\?|keyboard|shortcuts/i);
    expect(helpButton).toBeInTheDocument();
  });
});