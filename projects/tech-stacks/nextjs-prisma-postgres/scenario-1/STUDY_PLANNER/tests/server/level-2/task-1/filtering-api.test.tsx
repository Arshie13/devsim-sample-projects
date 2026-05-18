/**
 * Level 2 Task 1 [Server]: Filtering & Search API — Contract Grader
 *
 * Output-oriented contract test. Reads the candidate's real source files and
 * verifies the required implementation. Every assertion targets code that does
 * NOT exist in the untouched starter, so the whole file fails until the task
 * is completed.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const read = (rel: string): Promise<string> =>
  readFile(fileURLToPath(new URL(`../../../../${rel}`, import.meta.url)), 'utf8');

describe('Level 2 Task 1 [Server]: Task filtering & search API', () => {
  it('should read query parameters in the tasks GET handler', async () => {
    const code = await read('src/app/api/tasks/route.ts');
    expect(code).toMatch(/searchParams/);
  });

  it('should build a Prisma where clause from the parameters', async () => {
    const code = await read('src/app/api/tasks/route.ts');
    expect(code).toMatch(/where\s*[:=]/);
  });

  it('should read the subjectId filter parameter', async () => {
    const code = await read('src/app/api/tasks/route.ts');
    expect(code).toMatch(/get\(\s*['"]subjectId['"]\s*\)/);
  });

  it('should read the completed filter parameter', async () => {
    const code = await read('src/app/api/tasks/route.ts');
    expect(code).toMatch(/get\(\s*['"]completed['"]\s*\)/);
  });

  it('should support a case-insensitive title search', async () => {
    const code = await read('src/app/api/tasks/route.ts');
    expect(code).toMatch(/get\(\s*['"]search['"]\s*\)/);
    expect(code).toMatch(/contains/);
    expect(code).toMatch(/insensitive/);
  });
});
