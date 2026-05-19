/**
 * Level 3 Task 1 [Server]: Recurrence Fields & Generation API — Contract Grader
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

describe('Level 3 Task 1 [Server]: Recurrence fields & generation API', () => {
  it('should add isRecurring and recurrence fields to the Expense model', async () => {
    const model = expenseModel(await read('prisma/schema.prisma'));
    expect(model).toMatch(/isRecurring\s+Boolean/);
    expect(model).toMatch(/recurrence\s+String/);
  });

  it('should accept the recurrence fields in the expenses API', async () => {
    const code = await read('src/app/api/expenses/route.ts');
    expect(code).toMatch(/isRecurring/);
    expect(code).toMatch(/recurrence/);
  });

  it('should create a recurring-generation route', async () => {
    const code = await read('src/app/api/expenses/recurring/route.ts');
    expect(code).toMatch(/export\s+(async\s+)?function\s+(GET|POST)|export\s+const\s+(GET|POST)/);
  });

  it('should compute the next date from the recurrence interval', async () => {
    const code = await read('src/app/api/expenses/recurring/route.ts');
    expect(code).toMatch(/recurrence|isRecurring/);
    expect(code).toMatch(/setDate|setMonth|getDate|getMonth|addDays|addMonths/);
  });
});
