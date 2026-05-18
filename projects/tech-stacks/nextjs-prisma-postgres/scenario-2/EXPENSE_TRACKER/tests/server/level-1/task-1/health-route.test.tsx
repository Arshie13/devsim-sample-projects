/**
 * Level 1 Task 1 [Server]: Onboarding & Health Route — Contract Grader
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

describe('Level 1 Task 1 [Server]: Health route', () => {
  it('should create src/app/api/health/route.ts', async () => {
    const code = await read('src/app/api/health/route.ts');
    expect(code.length).toBeGreaterThan(0);
  });

  it('should export a GET handler', async () => {
    const code = await read('src/app/api/health/route.ts');
    expect(code).toMatch(/export\s+(async\s+)?function\s+GET|export\s+const\s+GET/);
  });

  it('should return a JSON response with an ok status', async () => {
    const code = await read('src/app/api/health/route.ts');
    expect(code).toMatch(/NextResponse\.json|Response\.json|new\s+Response/);
    expect(code).toMatch(/status\s*:/);
    expect(code).toMatch(/['"`]ok['"`]/i);
  });
});
