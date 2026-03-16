/**
 * Level 3 Task 2: Transaction Safety
 * Integration tests against real server route handlers and real Prisma client.
 *
 * IMPORTANT FOR DEVSIM:
 * These tests represent the expected fixed behavior and are intended
 * to fail against the current starter implementation.
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
      description: 'Transaction safety test fixture',
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

describe('Level 3 Task 2: Transaction Safety', () => {
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

  it('AC-1: concurrent return requests should only increment stock once', async () => {
    const book = await createBook({ totalCopies: 1, availableCopies: 0 });
    const member = await createMember();
    const record = await createBorrowRecord(book.id, member.id);

    const [first, second] = await Promise.all([
      request(app).put(`/api/borrow-records/${record.id}/return`),
      request(app).put(`/api/borrow-records/${record.id}/return`),
    ]);

    const successCount = [first, second].filter((r) => r.status === 200).length;
    const failedCount = [first, second].filter((r) => r.status >= 400).length;

    const latestBook = await prisma.book.findUnique({ where: { id: book.id } });

    expect(successCount).toBe(1);
    expect(failedCount).toBe(1);
    expect(latestBook?.availableCopies).toBe(1);
  });

  it('AC-2: should prevent stock underflow under concurrent borrow requests', async () => {
    const book = await createBook({ totalCopies: 1, availableCopies: 1 });
    const member = await createMember();
    const payload = {
      bookId: book.id,
      memberId: member.id,
      dueDate: '2026-04-01T00:00:00.000Z',
    };

    const [first, second] = await Promise.all([
      request(app).post('/api/borrow-records/member').send(payload),
      request(app).post('/api/borrow-records/member').send(payload),
    ]);

    const successCount = [first, second].filter((r) => r.status === 201).length;
    const latestBook = await prisma.book.findUnique({ where: { id: book.id } });
    const recordCount = await prisma.borrowRecord.count({ where: { bookId: book.id } });

    expect(successCount).toBe(1);
    expect(latestBook?.availableCopies).toBeGreaterThanOrEqual(0);
    expect(recordCount).toBe(1);
  });

  it('Edge: return flow should execute through prisma.$transaction', async () => {
    const txSpy = vi.spyOn(prisma, '$transaction');
    const book = await createBook({ totalCopies: 1, availableCopies: 0 });
    const member = await createMember();
    const record = await createBorrowRecord(book.id, member.id);

    const response = await request(app).put(`/api/borrow-records/${record.id}/return`);

    expect(response.status).toBe(200);
    expect(txSpy).toHaveBeenCalledTimes(1);
  });

  it('Edge: should reject a second return attempt and avoid double increment', async () => {
    const book = await createBook({ totalCopies: 1, availableCopies: 0 });
    const member = await createMember();
    const record = await createBorrowRecord(book.id, member.id);

    const firstReturn = await request(app).put(`/api/borrow-records/${record.id}/return`);
    const secondReturn = await request(app).put(`/api/borrow-records/${record.id}/return`);

    const latestBook = await prisma.book.findUnique({ where: { id: book.id } });

    expect(firstReturn.status).toBe(200);
    expect(secondReturn.status).toBe(400);
    expect(latestBook?.availableCopies).toBe(1);
  });
});
