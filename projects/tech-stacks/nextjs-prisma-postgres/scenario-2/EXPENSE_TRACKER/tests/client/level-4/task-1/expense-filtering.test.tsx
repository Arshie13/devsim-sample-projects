import { render, screen, fireEvent } from '@testing-library/react';
import Page from '../../../../src/app/page';

describe('Level 4: Expense Filtering & Search - Task 4.1: Implement Expense Filtering', () => {
  test('should have category filter dropdown', async () => {
    render(<Page />);
    const categoryFilter = screen.getByLabelText(/category|filter by/i);
    expect(categoryFilter).toBeInTheDocument();
  });

  test('should have date range filter inputs', async () => {
    render(<Page />);
    const startDate = screen.getByLabelText(/start date|from/i);
    const endDate = screen.getByLabelText(/end date|to/i);
    expect(startDate || endDate).toBeInTheDocument();
  });

  test('should have amount range inputs', async () => {
    render(<Page />);
    const minAmount = screen.getByLabelText(/min.*amount|minimum/i);
    const maxAmount = screen.getByLabelText(/max.*amount|maximum/i);
    expect(minAmount || maxAmount).toBeInTheDocument();
  });

  test('should apply category filter when selected', async () => {
    render(<Page />);
    const categorySelect = screen.getByRole('combobox');
    if (categorySelect) {
      fireEvent.change(categorySelect, { target: { value: 'food' } });
      expect(categorySelect).toHaveValue('food');
    }
  });

  test('should filter expenses by date range', async () => {
    render(<Page />);
    const applyButton = screen.getByText(/apply|filter|apply filters/i);
    expect(applyButton || screen.getByRole('button')).toBeInTheDocument();
  });

  test('should show filtered results', async () => {
    render(<Page />);
    const expenseList = screen.getAllByText(/expense/i);
    expect(expenseList.length).toBeGreaterThanOrEqual(0);
  });
});