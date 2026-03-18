/**
 * Level 3 Task 1: Return Flow Analysis
 * Integration tests against real server route handlers and real Prisma client.
 *
 * IMPORTANT FOR DEVSIM:
 * These tests are intentionally aligned to the expected fixed implementation,
 * so they should fail on the current starter code.
 *
 * Acceptance Criteria:
 * - AC-1: A reproducible case for negative stock is documented
 * - AC-1: Problematic backend logic path is identified with evidence
 * - AC-2: Backend controller/service flow is validated
 * - AC-2: Prisma query sequence is validated
 */

import express from 'express';
import request from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { randomUUID } from 'node:crypto';
import borrowRoutes from '../../../../server/src/routes/borrow.routes.js';
import { errorHandler } from '../../../../server/src/middleware/errorHandler.js';
import { prisma } from '../../../../server/src/utils/prisma.js';

const app = express();
app.use(express.json());
app.use('/api/borrow-records', borrowRoutes);
app.use(errorHandler);

const createBook = async (overrides?: Partial<{ totalCopies: number; availableCopies: number }>) => {
  const id = randomUUID();
  return prisma.book.create({
    data: {
      id,
      title: `Book-${id.slice(0, 8)}`,
      author: 'Tester',
      genre: 'Testing',
      description: 'Return flow test fixture',
      isbn: `isbn-${id}`,
      totalCopies: overrides?.totalCopies ?? 1,
      availableCopies: overrides?.availableCopies ?? 1,
    },
  });
};

const createMember = async () => {
  const id = randomUUID();
  return prisma.member.create({
    data: {
      id,
      name: `Member-${id.slice(0, 8)}`,
      email: `member-${id}@test.local`,
      phone: '09123456789',
      idNumber: `ID-${id.slice(0, 8)}`,
      idPhoto: null,
    },
  });
};

const createBorrowRecord = async (bookId: string, memberId: string) => {
  const id = randomUUID();
  return prisma.borrowRecord.create({
    data: {
      id,
      bookId,
      memberId,
      borrowerType: 'MEMBER',
      dueDate: new Date('2026-12-31T00:00:00.000Z'),
      status: 'BORROWED',
    },
  });
};

describe('Level 3 Task 1: Return Flow Analysis', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(() => {
    return prisma.$transaction([
      prisma.borrowRecord.deleteMany(),
      prisma.walkInBorrower.deleteMany(),
      prisma.member.deleteMany(),
      prisma.book.deleteMany(),
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('AC-1 Root Cause Analysis', () => {
    it('should execute return mutation inside prisma.$transaction', async () => {
      const txSpy = vi.spyOn(prisma, '$transaction');
      const book = await createBook({ totalCopies: 1, availableCopies: 0 });
      const member = await createMember();
      const record = await createBorrowRecord(book.id, member.id);

      const response = await request(app).put(`/api/borrow-records/${record.id}/return`);

      expect(response.status).toBe(200);
      expect(txSpy).toHaveBeenCalledTimes(1);
    });

    it('should keep inventory within total copies after repeated return attempts', async () => {
      const book = await createBook({ totalCopies: 1, availableCopies: 0 });
      const member = await createMember();
      const record = await createBorrowRecord(book.id, member.id);

      await request(app).put(`/api/borrow-records/${record.id}/return`);
      await request(app).put(`/api/borrow-records/${record.id}/return`);

      const latestBook = await prisma.book.findUnique({ where: { id: book.id } });
      expect(latestBook?.availableCopies).toBeLessThanOrEqual(book.totalCopies);
    });
  });

  describe('AC-2 Backend Verification', () => {
    it('should rollback record update when inventory update fails', async () => {
      const book = await createBook({ totalCopies: 2, availableCopies: 1 });
      const member = await createMember();
      const record = await createBorrowRecord(book.id, member.id);

      vi.spyOn(prisma.book, 'update').mockRejectedValueOnce(new Error('forced book update failure'));

      const response = await request(app).put(`/api/borrow-records/${record.id}/return`);
      const latestRecord = await prisma.borrowRecord.findUnique({ where: { id: record.id } });

      expect(response.status).toBe(500);
      expect(latestRecord?.status).toBe('BORROWED');
      expect(latestRecord?.returnedAt).toBeNull();
    });

    it('should reject returning an already returned record', async () => {
      const book = await createBook({ totalCopies: 1, availableCopies: 0 });
      const member = await createMember();
      const record = await createBorrowRecord(book.id, member.id);

      const firstReturn = await request(app).put(`/api/borrow-records/${record.id}/return`);
      const secondReturn = await request(app).put(`/api/borrow-records/${record.id}/return`);

      expect(firstReturn.status).toBe(200);
      expect(secondReturn.status).toBe(400);
    });
  });
});
