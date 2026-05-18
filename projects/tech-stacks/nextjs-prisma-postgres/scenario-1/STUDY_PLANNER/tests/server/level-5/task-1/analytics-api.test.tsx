/**
 * Level 5 Task 1 [Server]: Analytics Aggregation API — Contract Grader
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

const readAny = async (rels: string[]): Promise<string> => {
  for (const rel of rels) {
    try {
      return await read(rel);
    } catch {
      /* try the next candidate path */
    }
  }
  throw new Error(`Expected one of these files to exist: ${rels.join(', ')}`);
};

const analyticsRoute = (): Promise<string> =>
  readAny([
    'src/app/api/analytics/route.ts',
    'src/app/api/analytics/overview/route.ts',
  ]);

describe('Level 5 Task 1 [Server]: Analytics aggregation API', () => {
  it('should create an analytics route with a GET handler', async () => {
    const code = await analyticsRoute();
    expect(code).toMatch(/export\s+(async\s+)?function\s+GET|export\s+const\s+GET/);
  });

  it('should use Prisma aggregation rather than in-memory math', async () => {
    const code = await analyticsRoute();
    expect(code).toMatch(/aggregate|groupBy|_avg|_count/);
  });

  it('should report a completion rate and average progress', async () => {
    const code = await analyticsRoute();
    expect(code).toMatch(/completion/i);
    expect(code).toMatch(/progress|average|avg/i);
  });

  it('should produce a per-subject breakdown', async () => {
    const code = await analyticsRoute();
    expect(code).toMatch(/subject/i);
  });

  it('should provide a completion trend grouped by week or month', async () => {
    const code = await analyticsRoute();
    expect(code).toMatch(/trend/i);
    expect(code).toMatch(/week|month/i);
  });
});
