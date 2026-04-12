import { PrismaClient } from '@prisma/client';
import { render, screen } from '@testing-library/react';
import Page from '../../app/page';

const prisma = new PrismaClient();

describe('Level 2: Category Management', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Task 2.1: Add Category CRUD Operations', () => {
    test('should have Category model with CRUD operations', async () => {
      // Check if the Category model exists and has expected fields
      const categoryFields = await prisma.category.fields;
      expect(categoryFields).toHaveProperty('name');
      expect(categoryFields).toHaveProperty('createdAt');
    });

    test('should display category management UI', async () => {
      render(<Page />);
      // Check for category management elements
      const categoryElement = screen.getByText(/categories/i) || screen.getByText(/add category/i);
      expect(categoryElement).toBeInTheDocument();
    });
  });

  describe('Task 2.2: Update Expense Form to Use Dynamic Categories', () => {
    test('should load categories dynamically', async () => {
      // Check if categories can be fetched from database
      const categories = await prisma.category.findMany();
      expect(categories.length).toBeGreaterThan(0);
    });

    test('should display dynamic categories in expense form', async () => {
      render(<Page />);
      // Check for category dropdown or selection
      const selectElement = screen.getByRole('combobox') || screen.getByDisplayValue(/food|transport/i);
      expect(selectElement).toBeInTheDocument();
    });
  });
});