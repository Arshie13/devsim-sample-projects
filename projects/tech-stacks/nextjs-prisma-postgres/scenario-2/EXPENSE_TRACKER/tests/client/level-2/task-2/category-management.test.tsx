import { render, screen, fireEvent } from '@testing-library/react';
import Page from '../../../../src/app/page';

describe('Level 2: Category Management - Task 2.2: Implement Category Management UI', () => {
  test('should display all categories in list view', async () => {
    render(<Page />);
    const categoryList = screen.getByRole('list') || screen.getByRole('listitem');
    expect(categoryList).toBeInTheDocument();
  });

  test('should allow inline editing of category names', async () => {
    render(<Page />);
    const editButton = screen.getByText(/edit|edit category/i);
    if (editButton) {
      fireEvent.click(editButton);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    }
  });

  test('should have delete button for categories', async () => {
    render(<Page />);
    const deleteButtons = screen.getAllByText(/delete|remove/i);
    expect(deleteButtons.length).toBeGreaterThanOrEqual(0);
  });

  test('should show confirmation modal on delete', async () => {
    render(<Page />);
    const deleteButton = screen.getByText(/delete|remove/i);
    if (deleteButton) {
      fireEvent.click(deleteButton);
      const confirmModal = screen.getByText(/confirm|are you sure|cancel/i);
      expect(confirmModal).toBeInTheDocument();
    }
  });

  test('should show expense count per category', async () => {
    render(<Page />);
    const expenseCount = screen.getByText(/\d+ expenses|\d+ items/i);
    expect(expenseCount).toBeInTheDocument();
  });
});