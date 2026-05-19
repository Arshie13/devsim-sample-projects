/**
 * Level 5 Task 1 [Server]: Bulk & CSV API — Contract Grader
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

describe('Level 5 Task 1 [Server]: Bulk & CSV API', () => {
  it('should create a bulk route accepting an array of expense ids', async () => {
    const code = await read('src/app/api/expenses/bulk/route.ts');
    expect(code).toMatch(/ids/);
  });

  it('should support bulk delete and bulk recategorize', async () => {
    const code = await read('src/app/api/expenses/bulk/route.ts');
    expect(code).toMatch(/deleteMany/);
    expect(code).toMatch(/updateMany/);
  });

  it('should create an export route that returns CSV', async () => {
    const code = await read('src/app/api/expenses/export/route.ts');
    expect(code).toMatch(/export\s+(async\s+)?function\s+GET|export\s+const\s+GET/);
    expect(code).toMatch(/text\/csv|\.csv/i);
  });

  it('should create an import route that parses CSV and creates expenses', async () => {
    const code = await read('src/app/api/expenses/import/route.ts');
    expect(code).toMatch(/export\s+(async\s+)?function\s+POST|export\s+const\s+POST/);
    expect(code).toMatch(/split|parse|csv/i);
    expect(code).toMatch(/create|createMany/);
  });
});
