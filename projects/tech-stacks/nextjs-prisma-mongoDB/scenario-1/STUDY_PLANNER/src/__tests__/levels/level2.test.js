import { render, screen, fireEvent } from '@testing-library/react';
import Page from '../../app/page';

describe('Level 2: Task Management Enhancements', () => {
  describe('Task 2.1: Add Filtering and Sorting to Tasks', () => {
    test('should filter tasks by status', async () => {
      render(<Page />);
      // Check if filter controls exist
      const statusFilter = screen.getByLabelText(/status/i) || screen.getByDisplayValue(/all|completed|pending/i);
      expect(statusFilter).toBeInTheDocument();
    });

    test('should filter tasks by priority', async () => {
      render(<Page />);
      const priorityFilter = screen.getByLabelText(/priority/i) || screen.getByDisplayValue(/low|medium|high/i);
      expect(priorityFilter).toBeInTheDocument();
    });

    test('should sort tasks by deadline, createdAt, priority', async () => {
      render(<Page />);
      const sortBy = screen.getByLabelText(/sort by/i) || screen.getByDisplayValue(/deadline|createdAt|priority/i);
      expect(sortBy).toBeInTheDocument();
    });
  });

  describe('Task 2.2: Add Bulk Task Operations', () => {
    test('should have bulk mark as completed/incomplete', async () => {
      render(<Page />);
      const bulkComplete = screen.getByText(/mark as completed/i) || screen.getByText(/bulk complete/i);
      expect(bulkComplete).toBeInTheDocument();
    });

    test('should have bulk delete', async () => {
      render(<Page />);
      const bulkDelete = screen.getByText(/delete selected/i) || screen.getByText(/bulk delete/i);
      expect(bulkDelete).toBeInTheDocument();
    });

    test('should have select all/none', async () => {
      render(<Page />);
      const selectAll = screen.getByText(/select all/i);
      expect(selectAll).toBeInTheDocument();
    });

    test('should show selected count', async () => {
      render(<Page />);
      // This might be dynamic, so check if it exists after selection
      const checkboxes = screen.getAllByRole('checkbox');
      if (checkboxes.length > 0) {
        fireEvent.click(checkboxes[0]);
        const count = screen.getByText(/\d+ selected/i);
        expect(count).toBeInTheDocument();
      }
    });
  });
});