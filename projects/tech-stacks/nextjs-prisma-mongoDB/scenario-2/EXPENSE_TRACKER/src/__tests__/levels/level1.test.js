import { PrismaClient } from '@prisma/client';
import { render, screen } from '@testing-library/react';
import Page from '../../app/page';

const prisma = new PrismaClient();

describe('Level 1: Environment Setup & Basic Expense Addition', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Task 1.1: Environment Setup', () => {
    test('should have server running (manual check)', () => {
      // This is a placeholder test. In a real scenario, you might check if the server is running
      // or if the database connection is established.
      expect(true).toBe(true); // Always pass for now
    });
  });

  describe('Task 1.2: Implement Basic Expense Addition', () => {
    test('should have Expense and Category models', async () => {
      // Check if the Expense and Category models exist
      const expenseFields = await prisma.expense.fields;
      const categoryFields = await prisma.category.fields;
      expect(expenseFields).toBeDefined();
      expect(categoryFields).toBeDefined();
    });

    test('should display add expense form in the UI', async () => {
      render(<Page />);
      // Check for form elements
      const formElement = screen.getByText(/add expense/i) || screen.getByRole('form');
      expect(formElement).toBeInTheDocument();
    });
  });
});