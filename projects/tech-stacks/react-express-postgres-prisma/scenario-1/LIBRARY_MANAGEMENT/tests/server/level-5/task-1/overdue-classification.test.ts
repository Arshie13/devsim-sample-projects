/**
 * Level 5 Task 1: Stabilize Overdue Report Classification
 *
 * Output-oriented integration tests:
 * - Uses real Express route handlers
 * - Uses real Prisma and database records
 * - Validates endpoint output against production drift scenarios
 *
 * Acceptance Criteria Coverage:
 * - AC-1: Exclude any returned record regardless of status value
 * - AC-1: Include past-due unreturned records
 * - AC-2: Reproduce stale-status discrepancy with deterministic fixtures
 * - AC-2: Validate UTC midnight boundary behavior
 */

// @ts-expect-error Resolved from server package dependencies at runtime.
import express from 'express';
// @ts-expect-error Resolved from server package dependencies at runtime.
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { randomUUID } from 'node:crypto';
import borrowRoutes from '../../../../server/src/routes/borrow.routes.js';
import { errorHandler } from '../../../../server/src/middleware/errorHandler.js';
import { prisma } from '../../../../server/src/utils/prisma.js';

const app = express();
app.use(express.json());
app.use('/api/borrow-records', borrowRoutes);
app.use(errorHandler);

// --- Tracking arrays to scope cleanup to only test-created records ---
const createdBookIds: string[] = [];
const createdMemberIds: string[] = [];
const createdBorrowRecordIds: string[] = [];

const createBook = async (title: string) => {
  const id = randomUUID();
  const book = await prisma.book.create({
    data: {
      id,
      title,
      author: 'Task 1 Author',
      genre: 'Testing',
      description: 'Overdue classification fixture book',
      isbn: `isbn-${id}`,
      totalCopies: 5,
      availableCopies: 3,
    },
  });
  createdBookIds.push(book.id);
  return book;
};

const createMember = async (name: string) => {
  const id = randomUUID();
  const member = await prisma.member.create({
    data: {
      id,
      name,
      email: `member-${id}@test.local`,
      phone: '09123456789',
      idNumber: `ID-${id.slice(0, 8)}`,
      idPhoto: null,
    },
  });
  createdMemberIds.push(member.id);
  return member;
};

const createBorrowRecord = async (input: {
  bookId: string;
  memberId: string;
  borrowedAt: Date;
  dueDate: Date;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  returnedAt?: Date | null;
}) => {
  const record = await prisma.borrowRecord.create({
    data: {
      id: randomUUID(),
      bookId: input.bookId,
      memberId: input.memberId,
      borrowerType: 'MEMBER',
      borrowedAt: input.borrowedAt,
      dueDate: input.dueDate,
      status: input.status,
      returnedAt: input.returnedAt ?? null,
    },
  });
  createdBorrowRecordIds.push(record.id);
  return record;
};

describe('Level 5 Task 1: Overdue Classification Stability (Integration)', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterEach(async () => {
    // Restore real timers if fake timers were used in the test
    vi.useRealTimers();

    // Only delete records created during this test — seed data is preserved
    await prisma.$transaction([
      prisma.borrowRecord.deleteMany({
        where: { id: { in: [...createdBorrowRecordIds] } },
      }),
      prisma.member.deleteMany({
        where: { id: { in: [...createdMemberIds] } },
      }),
      prisma.book.deleteMany({
        where: { id: { in: [...createdBookIds] } },
      }),
    ]);

    // Reset tracking arrays for the next test
    createdBorrowRecordIds.length = 0;
    createdMemberIds.length = 0;
    createdBookIds.length = 0;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('AC-1: excludes returned records even when status is stale', async () => {
    const book = await createBook('Task1 Book A');
    const member = await createMember('Task1 Member A');

    const returnedButBorrowed = await createBorrowRecord({
      bookId: book.id,
      memberId: member.id,
      borrowedAt: new Date('2025-01-01T00:00:00.000Z'),
      dueDate: new Date('2025-01-10T00:00:00.000Z'),
      returnedAt: new Date('2025-01-11T00:00:00.000Z'),
      status: 'BORROWED',
    });

    const returnedButOverdue = await createBorrowRecord({
      bookId: book.id,
      memberId: member.id,
      borrowedAt: new Date('2025-01-01T00:00:00.000Z'),
      dueDate: new Date('2025-01-10T00:00:00.000Z'),
      returnedAt: new Date('2025-01-12T00:00:00.000Z'),
      status: 'OVERDUE',
    });

    const realOverdue = await createBorrowRecord({
      bookId: book.id,
      memberId: member.id,
      borrowedAt: new Date('2025-01-01T00:00:00.000Z'),
      dueDate: new Date('2025-01-10T00:00:00.000Z'),
      returnedAt: null,
      status: 'BORROWED',
    });

    const response = await request(app).get('/api/borrow-records/overdue');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const ids = (response.body.data as Array<{ id: string }>).map((row) => row.id);

    expect(ids).toContain(realOverdue.id);
    expect(ids).not.toContain(returnedButBorrowed.id);
    expect(ids).not.toContain(returnedButOverdue.id);
  });

  it('AC-2: classifies UTC midnight boundary records deterministically', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-03-02T00:00:01.000Z'));

    const book = await createBook('Task1 Book B');
    const member = await createMember('Task1 Member B');

    const overdueByBoundary = await createBorrowRecord({
      bookId: book.id,
      memberId: member.id,
      borrowedAt: new Date('2025-03-01T00:00:00.000Z'),
      dueDate: new Date('2025-03-01T23:59:59.000Z'),
      returnedAt: null,
      status: 'BORROWED',
    });

    const notYetDue = await createBorrowRecord({
      bookId: book.id,
      memberId: member.id,
      borrowedAt: new Date('2025-03-01T00:00:00.000Z'),
      dueDate: new Date('2025-03-02T00:00:05.000Z'),
      returnedAt: null,
      status: 'BORROWED',
    });

    const returnedAtBoundary = await createBorrowRecord({
      bookId: book.id,
      memberId: member.id,
      borrowedAt: new Date('2025-03-01T00:00:00.000Z'),
      dueDate: new Date('2025-03-01T23:59:59.000Z'),
      returnedAt: new Date('2025-03-02T00:00:00.000Z'),
      status: 'BORROWED',
    });

    const response = await request(app).get('/api/borrow-records/overdue');

    expect(response.status).toBe(200);

    const ids = (response.body.data as Array<{ id: string }>).map((row) => row.id);

    expect(ids).toContain(overdueByBoundary.id);
    expect(ids).not.toContain(notYetDue.id);
    expect(ids).not.toContain(returnedAtBoundary.id);
  });
});