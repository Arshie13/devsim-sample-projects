/**
 * Level 2 Task 1 [Server]: Category Fields & CRUD API — Contract Grader
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

const categoryModel = (schema: string): string =>
  schema.slice(schema.indexOf('model Category'), schema.indexOf('}', schema.indexOf('model Category')) + 1);

describe('Level 2 Task 1 [Server]: Category fields & CRUD API', () => {
  it('should add color and icon fields to the Category model', async () => {
    const model = categoryModel(await read('prisma/schema.prisma'));
    expect(model).toMatch(/color\s+String/);
    expect(model).toMatch(/icon\s+String/);
  });

  it('should accept color and icon in the categories API', async () => {
    const code = await read('src/app/api/categories/route.ts');
    expect(code).toMatch(/color/);
    expect(code).toMatch(/icon/);
  });

  it('should expose a PUT handler on the category [id] route', async () => {
    const code = await read('src/app/api/categories/[id]/route.ts');
    expect(code).toMatch(/export\s+(async\s+)?function\s+(PUT|PATCH)|export\s+const\s+(PUT|PATCH)/);
    expect(code).toMatch(/update/);
  });

  it('should expose a DELETE handler on the category [id] route', async () => {
    const code = await read('src/app/api/categories/[id]/route.ts');
    expect(code).toMatch(/export\s+(async\s+)?function\s+DELETE|export\s+const\s+DELETE/);
    expect(code).toMatch(/delete/);
  });
});
