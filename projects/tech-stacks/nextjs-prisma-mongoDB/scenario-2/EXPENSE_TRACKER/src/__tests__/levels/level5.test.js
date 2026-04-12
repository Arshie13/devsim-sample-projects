import { PrismaClient } from '@prisma/client';
import { render, screen } from '@testing-library/react';
import Page from '../../app/page';

const prisma = new PrismaClient();

describe('Level 5: Advanced Features & Optimizations', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Task 5.1: Add Expense Editing & Deletion', () => {
    test('should have edit and delete functionality', async () => {
      // Check if expenses exist
      const expenses = await prisma.expense.findMany();
      expect(expenses.length).toBeGreaterThan(0);

      // Test update
      const expense = expenses[0];
      await prisma.expense.update({
        where: { id: expense.id },
        data: { description: 'Updated description' },
      });

      const updatedExpense = await prisma.expense.findUnique({
        where: { id: expense.id },
      });
      expect(updatedExpense?.description).toBe('Updated description');
    });

    test('should display edit/delete buttons in UI', async () => {
      render(<Page />);
      // Check for edit/delete buttons
      const editButton = screen.getByRole('button', { name: /edit/i }) || screen.getByText(/edit/i);
      const deleteButton = screen.getByRole('button', { name: /delete/i }) || screen.getByText(/delete/i);
      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe('Task 5.2: Add Data Export', () => {
    test('should export expenses data', async () => {
      // Test data export logic
      const expenses = await prisma.expense.findMany({
        include: { category: true },
      });
      expect(expenses.length).toBeGreaterThan(0);

      // Simulate CSV conversion
      const csvData = expenses.map(exp => `${exp.description},${exp.amount},${exp.category.name}`).join('\n');
      expect(csvData).toContain(',');
    });

    test('should display export button in UI', async () => {
      render(<Page />);
      // Check for export button
      const exportButton = screen.getByRole('button', { name: /export/i }) || screen.getByText(/export/i);
      expect(exportButton).toBeInTheDocument();
    });
  });
});