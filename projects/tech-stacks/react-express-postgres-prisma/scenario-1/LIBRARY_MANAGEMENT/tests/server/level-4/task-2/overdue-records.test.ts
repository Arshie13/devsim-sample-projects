/**
 * Level 4 Task 2: Overdue Records - Server Integration Tests
 *
 * Real integration tests against Express routes and Prisma.
 * No module mocks are used.
 *
 * These tests are output-oriented and expected to fail on starter code
 * until overdue filtering is implemented.
 */

// @ts-expect-error Resolved from server package dependencies at runtime.
import express from 'express';
// @ts-expect-error Resolved from server package dependencies at runtime.
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import borrowRoutes from '../../../../server/src/routes/borrow.routes.js';
import { errorHandler } from '../../../../server/src/middleware/errorHandler.js';
import { prisma } from '../../../../server/src/utils/prisma.js';

const app = express();
app.use(express.json());
app.use('/api/borrow-records', borrowRoutes);
app.use(errorHandler);

const createBook = async (title: string) => {
  const id = randomUUID();
  return prisma.book.create({
    data: {
      id,
      title,
      author: 'Task 2 Author',
      genre: 'Testing',
      description: 'Overdue fixture book',
      isbn: `isbn-${id}`,
      totalCopies: 5,
      availableCopies: 3,
    },
  });
};

const createMember = async (name: string) => {
  const id = randomUUID();
  return prisma.member.create({
    data: {
      id,
      name,
      email: `member-${id}@test.local`,
      phone: '09123456789',
      idNumber: `ID-${id.slice(0, 8)}`,
      idPhoto: null,
    },
  });
};

const createBorrowRecord = async (input: {
  bookId: string;
  memberId: string;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  dueDate: Date;
  borrowedAt: Date;
  returnedAt?: Date | null;
}) => {
  return prisma.borrowRecord.create({
    data: {
      id: randomUUID(),
      bookId: input.bookId,
      memberId: input.memberId,
      borrowerType: 'MEMBER',
      status: input.status,
      borrowedAt: input.borrowedAt,
      dueDate: input.dueDate,
      returnedAt: input.returnedAt ?? null,
    },
  });
};

describe('Level 4 Task 2: Overdue Records Server Integration', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.borrowRecord.deleteMany(),
      prisma.walkInBorrower.deleteMany(),
      prisma.member.deleteMany(),
      prisma.book.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('AC-1: Backend Data Support', () => {
    it('should support dedicated overdue filter and only return currently overdue rows', async () => {
      const book = await createBook('Overdue Target Book');
      const member = await createMember('Overdue Target Member');

      await createBorrowRecord({
        bookId: book.id,
        memberId: member.id,
        status: 'OVERDUE',
        borrowedAt: new Date('2026-01-01T00:00:00.000Z'),
        dueDate: new Date('2026-01-10T00:00:00.000Z'),
      });

      await createBorrowRecord({
        bookId: book.id,
        memberId: member.id,
        status: 'BORROWED',
        borrowedAt: new Date('2026-02-01T00:00:00.000Z'),
        dueDate: new Date('2026-02-20T00:00:00.000Z'),
      });

      await createBorrowRecord({
        bookId: book.id,
        memberId: member.id,
        status: 'RETURNED',
        borrowedAt: new Date('2026-03-01T00:00:00.000Z'),
        dueDate: new Date('2026-03-15T00:00:00.000Z'),
        returnedAt: new Date('2026-03-12T00:00:00.000Z'),
      });

      const response = await request(app).get('/api/borrow-records?status=OVERDUE');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.every((r: { status: string }) => r.status === 'OVERDUE')).toBe(true);
    });

    it('should include fields required to compute overdue view output', async () => {
      const book = await createBook('Overdue Fields Book');
      const member = await createMember('Overdue Fields Member');

      await createBorrowRecord({
        bookId: book.id,
        memberId: member.id,
        status: 'OVERDUE',
        borrowedAt: new Date('2026-01-01T00:00:00.000Z'),
        dueDate: new Date('2026-01-10T00:00:00.000Z'),
      });

      const response = await request(app).get('/api/borrow-records?status=OVERDUE');

      expect(response.status).toBe(200);
      const row = response.body.data[0];

      expect(row).toHaveProperty('status', 'OVERDUE');
      expect(row).toHaveProperty('dueDate');
      expect(row).toHaveProperty('returnedAt');
      expect(row.book?.title).toBe('Overdue Fields Book');
      expect(row.member?.name).toBe('Overdue Fields Member');
    });
  });

  describe('AC-2: Overdue Row Output Contract', () => {
    it('should return overdue rows with computed daysOverdue field for rendering', async () => {
      const book = await createBook('Days Overdue Book');
      const member = await createMember('Days Overdue Member');

      await createBorrowRecord({
        bookId: book.id,
        memberId: member.id,
        status: 'OVERDUE',
        borrowedAt: new Date('2026-01-01T00:00:00.000Z'),
        dueDate: new Date('2026-01-10T00:00:00.000Z'),
      });

      const response = await request(app).get('/api/borrow-records?status=OVERDUE');

      expect(response.status).toBe(200);
      const row = response.body.data[0];
      expect(typeof row.daysOverdue).toBe('number');
      expect(row.daysOverdue).toBeGreaterThan(0);
    });

    it('should keep overdue rows sorted by highest daysOverdue first', async () => {
      const book = await createBook('Sort Overdue Book');
      const member = await createMember('Sort Overdue Member');

      await createBorrowRecord({
        bookId: book.id,
        memberId: member.id,
        status: 'OVERDUE',
        borrowedAt: new Date('2026-01-01T00:00:00.000Z'),
        dueDate: new Date('2026-01-02T00:00:00.000Z'),
      });

      await createBorrowRecord({
        bookId: book.id,
        memberId: member.id,
        status: 'OVERDUE',
        borrowedAt: new Date('2026-01-01T00:00:00.000Z'),
        dueDate: new Date('2026-01-20T00:00:00.000Z'),
      });

      const response = await request(app).get('/api/borrow-records?status=OVERDUE');

      expect(response.status).toBe(200);
      const rows = response.body.data;
      expect(rows[0].daysOverdue).toBeGreaterThanOrEqual(rows[1].daysOverdue);
    });
  });

  describe('Edge Cases', () => {
    it('should not include returned rows even if dueDate is in the past', async () => {
      const book = await createBook('Returned Exclusion Book');
      const member = await createMember('Returned Exclusion Member');

      await createBorrowRecord({
        bookId: book.id,
        memberId: member.id,
        status: 'RETURNED',
        borrowedAt: new Date('2026-01-01T00:00:00.000Z'),
        dueDate: new Date('2026-01-10T00:00:00.000Z'),
        returnedAt: new Date('2026-01-11T00:00:00.000Z'),
      });

      const response = await request(app).get('/api/borrow-records?status=OVERDUE');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('should return 400 for invalid overdue query variant', async () => {
      const response = await request(app).get('/api/borrow-records?status=overdue');

      expect(response.status).toBe(400);
    });
  });
});
