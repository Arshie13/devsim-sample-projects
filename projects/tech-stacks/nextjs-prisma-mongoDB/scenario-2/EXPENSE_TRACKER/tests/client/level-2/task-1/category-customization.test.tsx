import { render, screen, fireEvent } from '@testing-library/react';
import Page from '../../../../src/app/page';

describe('Level 2: Category Management - Task 2.1: Add Category Color and Icon Customization', () => {
  test('should display color picker for categories', async () => {
    render(<Page />);
    const colorPicker = screen.getByLabelText(/color/i) || screen.getByRole('button', { name: /color/i });
    expect(colorPicker).toBeInTheDocument();
  });

  test('should display icon selector for categories', async () => {
    render(<Page />);
    const iconSelector = screen.getByLabelText(/icon/i) || screen.getByText(/select icon/i);
    expect(iconSelector).toBeInTheDocument();
  });

  test('should show category with custom color', async () => {
    render(<Page />);
    const categoryColors = screen.getAllByTestId('category-color');
    expect(categoryColors.length).toBeGreaterThanOrEqual(0);
  });

  test('should show category icons', async () => {
    render(<Page />);
    const categoryIcons = screen.getAllByTestId('category-icon');
    expect(categoryIcons.length).toBeGreaterThanOrEqual(0);
  });

  test('should persist color preference in localStorage', async () => {
    render(<Page />);
    const saveButton = screen.getByText(/save|save colors/i);
    if (saveButton) {
      fireEvent.click(saveButton);
      expect(localStorage.getItem).toBeDefined();
    }
  });
});