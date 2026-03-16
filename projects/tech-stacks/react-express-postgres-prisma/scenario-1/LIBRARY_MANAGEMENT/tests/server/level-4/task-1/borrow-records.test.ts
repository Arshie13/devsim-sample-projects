/**
 * Level 4 Task 1: Borrow Records - Server Integration Tests
 *
 * Integration tests against real route handlers and Prisma client.
 * No module mocks are used.
 *
 * For DevSim, these tests are intentionally output-first and should fail
 * on starter code until the task is implemented.
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

const createBook = async (overrides?: Partial<{ title: string }>) => {
  const id = randomUUID();
  return prisma.book.create({
    data: {
      id,
      title: overrides?.title ?? `Book-${id.slice(0, 8)}`,
      author: 'Test Author',
      genre: 'Testing',
      description: 'Borrow records fixture',
      isbn: `isbn-${id}`,
      totalCopies: 5,
      availableCopies: 3,
    },
  });
};

const createMember = async (overrides?: Partial<{ name: string; email: string }>) => {
  const id = randomUUID();
  return prisma.member.create({
    data: {
      id,
      name: overrides?.name ?? `Member-${id.slice(0, 8)}`,
      email: overrides?.email ?? `member-${id}@test.local`,
      phone: '09123456789',
      idNumber: `ID-${id.slice(0, 8)}`,
      idPhoto: null,
    },
  });
};

const createWalkInBorrower = async (overrides?: Partial<{ name: string; email: string }>) => {
  const id = randomUUID();
  return prisma.walkInBorrower.create({
    data: {
      id,
      name: overrides?.name ?? `WalkIn-${id.slice(0, 8)}`,
      email: overrides?.email ?? `walkin-${id}@test.local`,
      phone: '09198765432',
      idNumber: `WALK-${id.slice(0, 8)}`,
      idPhoto: null,
    },
  });
};

const createBorrowRecord = async (input: {
  bookId: string;
  borrowerType: 'MEMBER' | 'WALK_IN';
  memberId?: string;
  walkInBorrowerId?: string;
  status: 'BORROWED' | 'RETURNED';
  borrowedAt: Date;
  dueDate: Date;
  returnedAt?: Date | null;
}) => {
  return prisma.borrowRecord.create({
    data: {
      id: randomUUID(),
      bookId: input.bookId,
      borrowerType: input.borrowerType,
      memberId: input.memberId ?? null,
      walkInBorrowerId: input.walkInBorrowerId ?? null,
      status: input.status,
      borrowedAt: input.borrowedAt,
      dueDate: input.dueDate,
      returnedAt: input.returnedAt ?? null,
    },
  });
};

describe('Level 4 Task 1: Borrow Records Server Integration', () => {
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

  describe('AC-1: History Endpoint Contract', () => {
    it('should return complete rows with relation fields needed by Borrow Records UI', async () => {
      const book = await createBook({ title: 'History Contract Book' });
      const member = await createMember({ name: 'History Contract Member' });

      await createBorrowRecord({
        bookId: book.id,
        borrowerType: 'MEMBER',
        memberId: member.id,
        status: 'BORROWED',
        borrowedAt: new Date('2026-01-10T00:00:00.000Z'),
        dueDate: new Date('2026-01-24T00:00:00.000Z'),
      });

      const response = await request(app).get('/api/borrow-records');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(1);

      const row = response.body.data[0];
      expect(row).toMatchObject({
        status: 'BORROWED',
        borrowerType: 'MEMBER',
      });
      expect(row).toHaveProperty('borrowedAt');
      expect(row).toHaveProperty('dueDate');
      expect(row).toHaveProperty('returnedAt');

      expect(row.book?.title).toBe('History Contract Book');
      expect(row.member?.name).toBe('History Contract Member');
    });
  });

  describe('AC-2: Status Filtering Contract', () => {
    it('should support BORROWED filter that returns BORROWED rows only', async () => {
      const book = await createBook();
      const member = await createMember();

      await createBorrowRecord({
        bookId: book.id,
        borrowerType: 'MEMBER',
        memberId: member.id,
        status: 'BORROWED',
        borrowedAt: new Date('2026-01-20T00:00:00.000Z'),
        dueDate: new Date('2026-02-03T00:00:00.000Z'),
      });

      await createBorrowRecord({
        bookId: book.id,
        borrowerType: 'MEMBER',
        memberId: member.id,
        status: 'RETURNED',
        borrowedAt: new Date('2026-01-05T00:00:00.000Z'),
        dueDate: new Date('2026-01-19T00:00:00.000Z'),
        returnedAt: new Date('2026-01-15T00:00:00.000Z'),
      });

      const response = await request(app).get('/api/borrow-records?status=BORROWED');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      const statuses = response.body.data.map((row: { status: string }) => row.status);
      expect(statuses).toContain('BORROWED');
      expect(statuses).not.toContain('RETURNED');
    });
  });

  describe('AC-3: Borrow Records Filter Output Contract', () => {
    it('should return both active and returned rows when no status query is provided', async () => {
      const book = await createBook();
      const member = await createMember();

      await createBorrowRecord({
        bookId: book.id,
        borrowerType: 'MEMBER',
        memberId: member.id,
        status: 'BORROWED',
        borrowedAt: new Date('2026-01-20T00:00:00.000Z'),
        dueDate: new Date('2026-02-03T00:00:00.000Z'),
      });

      await createBorrowRecord({
        bookId: book.id,
        borrowerType: 'MEMBER',
        memberId: member.id,
        status: 'RETURNED',
        borrowedAt: new Date('2026-01-10T00:00:00.000Z'),
        dueDate: new Date('2026-01-24T00:00:00.000Z'),
        returnedAt: new Date('2026-01-18T00:00:00.000Z'),
      });

      const response = await request(app).get('/api/borrow-records');

      expect(response.status).toBe(200);
      const statuses = response.body.data.map((row: { status: string }) => row.status);
      expect(statuses).toContain('BORROWED');
      expect(statuses).toContain('RETURNED');
    });
  });

  describe('AC-4: Row Status and Ordering Output', () => {
    it('should return rows sorted by borrowedAt in descending order', async () => {
      const book = await createBook();
      const member = await createMember();

      await createBorrowRecord({
        bookId: book.id,
        borrowerType: 'MEMBER',
        memberId: member.id,
        status: 'BORROWED',
        borrowedAt: new Date('2026-01-01T00:00:00.000Z'),
        dueDate: new Date('2026-01-15T00:00:00.000Z'),
      });

      await createBorrowRecord({
        bookId: book.id,
        borrowerType: 'MEMBER',
        memberId: member.id,
        status: 'BORROWED',
        borrowedAt: new Date('2026-01-05T00:00:00.000Z'),
        dueDate: new Date('2026-01-19T00:00:00.000Z'),
      });

      await createBorrowRecord({
        bookId: book.id,
        borrowerType: 'MEMBER',
        memberId: member.id,
        status: 'RETURNED',
        borrowedAt: new Date('2026-01-03T00:00:00.000Z'),
        dueDate: new Date('2026-01-17T00:00:00.000Z'),
        returnedAt: new Date('2026-01-10T00:00:00.000Z'),
      });

      const response = await request(app).get('/api/borrow-records');

      expect(response.status).toBe(200);
      const rows = response.body.data;
      expect(new Date(rows[0].borrowedAt).getTime()).toBeGreaterThanOrEqual(new Date(rows[1].borrowedAt).getTime());
      expect(new Date(rows[1].borrowedAt).getTime()).toBeGreaterThanOrEqual(new Date(rows[2].borrowedAt).getTime());
    });
  });

  describe('Edge Cases', () => {
    it('should return HTTP 400 for unsupported status query value', async () => {
      const response = await request(app).get('/api/borrow-records?status=INVALID_STATUS');

      expect(response.status).toBe(400);
    });

    it('should return an empty list when there are no borrow records', async () => {
      const response = await request(app).get('/api/borrow-records');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });
});
