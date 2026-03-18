/**
 * Level 4 Task 2: Reservation Lifecycle - Server Integration Tests
 *
 * Real integration tests against Express routes and Prisma.
 * No module mocks are used.
 *
 * These tests are output-oriented and expected to fail on starter code
 * until reservation lifecycle behavior is implemented.
 */

// @ts-expect-error Resolved from server package dependencies at runtime.
import express from 'express';
// @ts-expect-error Resolved from server package dependencies at runtime.
import request from 'supertest';
import { readFile } from 'node:fs/promises';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import borrowRoutes from '../../../../server/src/routes/borrow.routes.js';
import { errorHandler } from '../../../../server/src/middleware/errorHandler.js';
import { prisma } from '../../../../server/src/utils/prisma.js';

const buildApp = async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/borrow-records', borrowRoutes);

  try {
    const module = await import('../../../../server/src/routes/reservation.routes.js');
    const routes = module.default;
    app.use('/api/reservations', routes);
  } catch {
    // Keep app bootable on starter code where reservation routes do not yet exist.
  }

  app.use(errorHandler);
  return app;
};

const clearReservationTableIfExists = async () => {
  try {
    const rows = await prisma.$queryRawUnsafe<Array<{ exists: string | null }>>(
      "SELECT to_regclass('public.\"Reservation\"') AS exists",
    );
    if (rows?.[0]?.exists) {
      await prisma.$executeRawUnsafe('DELETE FROM "Reservation"');
    }
  } catch {
    // Ignore when table does not exist yet.
  }
};

const createBook = async (title: string) => {
  const id = randomUUID();
  return prisma.book.create({
    data: {
      id,
      title,
      author: 'Reservation Author',
      genre: 'Testing',
      description: 'Reservation lifecycle fixture book',
      isbn: `isbn-${id}`,
      totalCopies: 5,
      availableCopies: 0,
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
  status: 'BORROWED' | 'RETURNED';
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

describe('Level 4 Task 2: Reservation Lifecycle Server Integration', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await clearReservationTableIfExists();
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

  describe('AC-1: Return Flow Reservation Fulfillment', () => {
    it('should promote the first queued reservation to READY_FOR_PICKUP after a return', async () => {
      const app = await buildApp();
      const book = await createBook('Lifecycle Promotion Book');
      const reserverA = await createMember('Reserver A');
      const reserverB = await createMember('Reserver B');
      const borrower = await createMember('Current Borrower');

      const borrowRecord = await createBorrowRecord({
        bookId: book.id,
        memberId: borrower.id,
        status: 'BORROWED',
        borrowedAt: new Date('2026-01-01T00:00:00.000Z'),
        dueDate: new Date('2026-01-20T00:00:00.000Z'),
      });

      await request(app).post('/api/reservations').send({ bookId: book.id, memberId: reserverA.id });
      await request(app).post('/api/reservations').send({ bookId: book.id, memberId: reserverB.id });

      const returned = await request(app).put(`/api/borrow-records/${borrowRecord.id}/return`);
      expect(returned.status).toBe(200);

      const queueResponse = await request(app).get(`/api/reservations?bookId=${book.id}`);
      expect(queueResponse.status).toBe(200);
      expect(Array.isArray(queueResponse.body.data)).toBe(true);
      expect(queueResponse.body.data[0].status).toBe('READY_FOR_PICKUP');
    });
  });

  describe('AC-2: Reservation Cancellation Contract', () => {
    it('should cancel reservation and reindex remaining queue positions', async () => {
      const app = await buildApp();
      const book = await createBook('Lifecycle Cancellation Book');
      const reserverA = await createMember('Cancelable Member');
      const reserverB = await createMember('Next In Line Member');

      await request(app).post('/api/reservations').send({ bookId: book.id, memberId: reserverA.id });
      await request(app).post('/api/reservations').send({ bookId: book.id, memberId: reserverB.id });

      const queueBefore = await request(app).get(`/api/reservations?bookId=${book.id}`);
      const reservationId = queueBefore.body.data[0]?.id;

      const cancelResponse = await request(app).delete(`/api/reservations/${reservationId}`);
      expect(cancelResponse.status).toBe(200);

      const queueAfter = await request(app).get(`/api/reservations?bookId=${book.id}`);
      expect(queueAfter.status).toBe(200);
      expect(queueAfter.body.data[0]?.queuePosition).toBe(1);
    });

    it('should reject cancellation of non-active reservation with HTTP 400', async () => {
      const app = await buildApp();
      const response = await request(app).delete('/api/reservations/non-existent-id');
      expect(response.status).toBe(400);
    });
  });

  describe('Explicit Contract Names', () => {
    it('should enforce exact function names required by acceptance criteria', async () => {
      const borrowControllerCode = await readFile(
        new URL('../../../../server/src/controllers/borrow.controller.ts', import.meta.url),
        'utf8',
      ).catch(() => '');
      const reservationControllerCode = await readFile(
        new URL('../../../../server/src/controllers/reservation.controller.ts', import.meta.url),
        'utf8',
      ).catch(() => '');

      expect(borrowControllerCode).toMatch(/returnBook/);
      expect(reservationControllerCode).toMatch(/promoteNextReservation/);
      expect(reservationControllerCode).toMatch(/cancelReservation/);
    });
  });

  describe('Edge Cases', () => {
    it('should keep real integration behavior without mocks by hitting real endpoints', async () => {
      const app = await buildApp();
      const response = await request(app).get('/api/reservations?bookId=missing-id');
      expect(response.status).toBe(400);
    });
  });
});
