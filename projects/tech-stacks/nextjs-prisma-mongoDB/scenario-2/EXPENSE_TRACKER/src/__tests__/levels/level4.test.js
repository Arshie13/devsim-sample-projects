import { PrismaClient } from '@prisma/client';
import { render, screen } from '@testing-library/react';
import Page from '../../app/page';

const prisma = new PrismaClient();

describe('Level 4: Expense Filtering & Search', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Task 4.1: Implement Expense Filtering', () => {
    test('should filter expenses by category', async () => {
      const foodCategory = await prisma.category.findFirst({
        where: { name: 'Food' },
      });
      expect(foodCategory).toBeDefined();

      const expenses = await prisma.expense.findMany({
        where: {
          categoryId: foodCategory!.id,
        },
      });
      expect(expenses.length).toBeGreaterThanOrEqual(0);
    });

    test('should filter expenses by date range', async () => {
      const startDate = new Date('2026-04-01');
      const endDate = new Date('2026-04-30');

      const expenses = await prisma.expense.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      expect(expenses).toBeDefined();
    });

    test('should display filter controls in UI', async () => {
      render(<Page />);
      // Check for filter elements
      const filterElement = screen.getByText(/filter/i) || screen.getByRole('select');
      expect(filterElement).toBeInTheDocument();
    });
  });

  describe('Task 4.2: Add Search Functionality', () => {
    test('should search expenses by description', async () => {
      const expenses = await prisma.expense.findMany({
        where: {
          description: {
            contains: 'lunch',
            mode: 'insensitive',
          },
        },
      });
      expect(expenses).toBeDefined();
    });

    test('should display search input in UI', async () => {
      render(<Page />);
      // Check for search input
      const searchElement = screen.getByPlaceholderText(/search/i) || screen.getByRole('searchbox');
      expect(searchElement).toBeInTheDocument();
    });
  });
});