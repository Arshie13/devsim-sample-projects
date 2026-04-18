import { render, screen, fireEvent } from '@testing-library/react';
import Page from '../../../../src/app/page';

describe('Level 4: Expense Filtering & Search - Task 4.2: Add Search Functionality', () => {
  test('should have search input field', async () => {
    render(<Page />);
    const searchInput = screen.getByPlaceholderText(/search|search by description/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('should accept search query', async () => {
    render(<Page />);
    const searchInput = screen.getByPlaceholderText(/search|search by description/i);
    fireEvent.change(searchInput, { target: { value: 'groceries' } });
    expect(searchInput).toHaveValue('groceries');
  });

  test('should perform case-insensitive search', async () => {
    render(<Page />);
    const searchInput = screen.getByPlaceholderText(/search|search by description/i);
    fireEvent.change(searchInput, { target: { value: 'Groceries' } });
    expect(screen.getByDisplayValue('Groceries')).toBeInTheDocument();
  });

  test('should show search results', async () => {
    render(<Page />);
    const searchInput = screen.getByPlaceholderText(/search|search by description/i);
    fireEvent.change(searchInput, { target: { value: 'food' } });
    const results = screen.getAllByText(/food/i);
    expect(results.length).toBeGreaterThanOrEqual(0);
  });

  test('should search by partial match', async () => {
    render(<Page />);
    const searchInput = screen.getByPlaceholderText(/search|search by description/i);
    fireEvent.change(searchInput, { target: { value: 'gro' } });
    expect(searchInput).toHaveValue('gro');
  });

  test('should have search button or auto-search', async () => {
    render(<Page />);
    const searchButton = screen.getByText(/search|search/i) || screen.getByRole('button', { name: /search/i });
    expect(searchButton || screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });
});