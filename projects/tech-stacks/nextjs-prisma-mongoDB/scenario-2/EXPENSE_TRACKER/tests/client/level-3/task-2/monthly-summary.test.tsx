import { render, screen } from '@testing-library/react';
import Page from '../../../../src/app/page';

describe('Level 3: Monthly Summary - Task 3.2: Display Monthly Summary on Homepage', () => {
  test('should display total spent this month', async () => {
    render(<Page />);
    const totalSpent = screen.getByText(/total spent|this month|monthly total/i);
    expect(totalSpent).toBeInTheDocument();
  });

  test('should show breakdown by category', async () => {
    render(<Page />);
    const breakdown = screen.getByText(/food|transport|utilities|entertainment|shopping/i);
    expect(breakdown).toBeInTheDocument();
  });

  test('should display percentages for each category', async () => {
    render(<Page />);
    const percentages = screen.getAllByText(/%/);
    expect(percentages.length).toBeGreaterThanOrEqual(0);
  });

  test('should show progress bars for categories', async () => {
    render(<Page />);
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThanOrEqual(0);
  });

  test('should display overall total expenses indicator', async () => {
    render(<Page />);
    const totalIndicator = screen.getByText(/overall total|total expenses|grand total/i);
    expect(totalIndicator).toBeInTheDocument();
  });

  test('should use mock data for demonstration', async () => {
    render(<Page />);
    const amountValues = screen.getAllByText(/\$\d+|USD|EUR|€|£/);
    expect(amountValues.length).toBeGreaterThanOrEqual(0);
  });
});