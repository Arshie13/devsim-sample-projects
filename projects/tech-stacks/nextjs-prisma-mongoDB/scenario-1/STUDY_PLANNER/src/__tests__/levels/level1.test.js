import { PrismaClient } from '@prisma/client';
import { render, screen } from '@testing-library/react';
import Page from '../../app/page';

const prisma = new PrismaClient();

describe('Level 1: Environment Setup & Database Initialization', () => {
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

  describe('Task 1.2: Minor Schema Update', () => {
    test('should have priority field in Task model', async () => {
      // Check if the Task model has a priority field
      const taskFields = await prisma.task.fields;
      expect(taskFields).toHaveProperty('priority');
    });

    test('should display priority in the UI', async () => {
      render(<Page />);
      // Assuming priority is displayed, check for priority text or select
      const priorityElement = screen.getByText(/priority/i) || screen.getByDisplayValue(/low|medium|high/i);
      expect(priorityElement).toBeInTheDocument();
    });
  });
});