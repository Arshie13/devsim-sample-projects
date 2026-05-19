/**
 * Level 1 Task 2 [Server]: Payment Method Field — Contract Grader
 *
 * Output-oriented contract test. Reads the candidate's real source files and
 * verifies the required implementation. Every assertion targets code that does
 * NOT exist in the untouched starter, so the whole file fails until the task
 * is completed.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const read = (rel: string): Promise<string> =>
  readFile(path.join(__dirname, '..', '..', '..', '..', rel), 'utf8');

const expenseModel = (schema: string): string =>
  schema.slice(schema.indexOf('model Expense'), schema.indexOf('}', schema.indexOf('model Expense')) + 1);

describe('Level 1 Task 2 [Server]: Payment method field', () => {
  it('should add an optional paymentMethod field to the Expense model', async () => {
    const model = expenseModel(await read('prisma/schema.prisma'));
    expect(model).toMatch(/paymentMethod\s+String\?/);
  });

  it('should accept paymentMethod in the create-expense Zod schema', async () => {
    const code = await read('src/app/api/expenses/route.ts');
    expect(code).toMatch(/paymentMethod/);
  });

  it('should seed at least one expense with a payment method', async () => {
    const seed = await read('prisma/seed.ts');
    expect(seed).toMatch(/paymentMethod/);
  });
});
