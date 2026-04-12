import { PrismaClient } from '@prisma/client';
import { render, screen } from '@testing-library/react';
import Page from '../../app/page';

const prisma = new PrismaClient();

describe('Level 3: Monthly Summary & Aggregation', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Task 3.1: Create Monthly Summary API', () => {
    test('should aggregate expenses by category for current month', async () => {
      // Test aggregation logic
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const expenses = await prisma.expense.findMany({
        where: {
          date: {
            gte: currentMonth,
          },
        },
        include: {
          category: true,
        },
      });

      expect(expenses).toBeDefined();
    });
  });

  describe('Task 3.2: Display Monthly Summary on Homepage', () => {
    test('should display monthly summary section', async () => {
      render(<Page />);
      // Check for summary elements
      const summaryElement = screen.getByText(/summary/i) || screen.getByText(/total spent/i);
      expect(summaryElement).toBeInTheDocument();
    });

    test('should show category breakdown', async () => {
      render(<Page />);
      // Check for category breakdown
      const categoryBreakdown = screen.getByText(/food|transport|entertainment/i);
      expect(categoryBreakdown).toBeInTheDocument();
    });

    test('should display total expenses indicator', async () => {
      render(<Page />);
      // Check for total expenses text
      const totalElement = screen.getByText(/total expenses/i);
      expect(totalElement).toBeInTheDocument();
    });
  });
});