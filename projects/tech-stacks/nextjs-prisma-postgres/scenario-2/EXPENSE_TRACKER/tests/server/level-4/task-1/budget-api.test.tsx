/**
 * Level 4 Task 1 [Server]: Budget Model & Tracking API — Contract Grader
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

describe('Level 4 Task 1 [Server]: Budget model & tracking API', () => {
  it('should define a Budget model with amount, month and a category relation', async () => {
    const schema = await read('prisma/schema.prisma');
    expect(schema).toMatch(/model\s+Budget/);
    const model = schema.slice(
      schema.indexOf('model Budget'),
      schema.indexOf('}', schema.indexOf('model Budget')) + 1,
    );
    expect(model).toMatch(/amount\s+Float/);
    expect(model).toMatch(/month/i);
    expect(model).toMatch(/category|categoryId/i);
  });

  it('should expose GET and POST handlers on the budgets route', async () => {
    const code = await read('src/app/api/budgets/route.ts');
    expect(code).toMatch(/export\s+(async\s+)?function\s+GET|export\s+const\s+GET/);
    expect(code).toMatch(/export\s+(async\s+)?function\s+POST|export\s+const\s+POST/);
  });

  it('should aggregate actual spend with a Prisma sum', async () => {
    const code = await read('src/app/api/budgets/route.ts');
    expect(code).toMatch(/_sum|aggregate/);
  });

  it('should report spent, remaining and an over-budget flag', async () => {
    const code = await read('src/app/api/budgets/route.ts');
    expect(code).toMatch(/spent/i);
    expect(code).toMatch(/remaining|left/i);
    expect(code).toMatch(/overBudget|over.?budget|exceed/i);
  });
});
