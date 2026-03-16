/**
 * Level 4 Task 1: Reservation Queue Foundation - Server Integration Tests
 *
 * Real integration tests against Express routes and Prisma client.
 * No module mocks are used.
 *
 * These tests are output-oriented and are expected to fail
 * on starter code until reservation queue features are implemented.
 */

// @ts-expect-error Resolved from server package dependencies at runtime.
import express from 'express';
// @ts-expect-error Resolved from server package dependencies at runtime.
import request from 'supertest';
import { readFile } from 'node:fs/promises';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { errorHandler } from '../../../../server/src/middleware/errorHandler.js';
import { prisma } from '../../../../server/src/utils/prisma.js';

const buildApp = async () => {
  const app = express();
  app.use(express.json());

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

describe('Level 4 Task 1: Reservation Queue Foundation Server Integration', () => {
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

  describe('AC-1: Reservation Create Contract', () => {
    it('should create reservation for unavailable books and reject duplicate active reservation', async () => {
      const app = await buildApp();
      const book = await createBook({ title: 'Queue Create Book' });
      const member = await createMember({ name: 'Queue Member One' });

      const first = await request(app).post('/api/reservations').send({
        bookId: book.id,
        memberId: member.id,
      });

      expect(first.status).toBe(201);
      expect(first.body.success).toBe(true);
      expect(first.body.data).toHaveProperty('queuePosition');

      const duplicate = await request(app).post('/api/reservations').send({
        bookId: book.id,
        memberId: member.id,
      });

      expect(duplicate.status).toBe(400);
    });
  });

  describe('AC-2: Reservation Queue Read Contract', () => {
    it('should return queue rows with member and book display data ordered by queue position', async () => {
      const app = await buildApp();
      const book = await createBook({ title: 'Queue Read Book' });
      const firstMember = await createMember({ name: 'Queue First Member' });
      const secondMember = await createMember({ name: 'Queue Second Member' });

      await request(app).post('/api/reservations').send({ bookId: book.id, memberId: firstMember.id });
      await request(app).post('/api/reservations').send({ bookId: book.id, memberId: secondMember.id });

      const response = await request(app).get(`/api/reservations?bookId=${book.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);

      const firstRow = response.body.data[0];
      const secondRow = response.body.data[1];

      expect(firstRow).toHaveProperty('queuePosition');
      expect(firstRow).toHaveProperty('member');
      expect(firstRow).toHaveProperty('book');
      expect(firstRow.queuePosition).toBeLessThanOrEqual(secondRow.queuePosition);
    });
  });

  describe('Explicit Contract Names', () => {
    it('should enforce exact file and function names from acceptance criteria', async () => {
      const controllerCode = await readFile(
        new URL('../../../../server/src/controllers/reservation.controller.ts', import.meta.url),
        'utf8',
      ).catch(() => '');
      const routeCode = await readFile(
        new URL('../../../../server/src/routes/reservation.routes.ts', import.meta.url),
        'utf8',
      ).catch(() => '');

      expect(controllerCode).toMatch(/createReservation/);
      expect(routeCode).toMatch(/\/api\/reservations|router\./);
    });
  });

  describe('Edge Cases', () => {
    it('should return HTTP 400 for invalid reservation queue query', async () => {
      const app = await buildApp();
      const response = await request(app).get('/api/reservations?bookId=');
      expect(response.status).toBe(400);
    });

    it('should return empty queue output for a valid book with no reservations', async () => {
      const app = await buildApp();
      const book = await createBook({ title: 'No Queue Yet' });
      const response = await request(app).get(`/api/reservations?bookId=${book.id}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });
});
