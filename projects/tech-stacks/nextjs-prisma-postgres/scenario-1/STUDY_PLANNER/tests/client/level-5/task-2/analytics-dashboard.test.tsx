/**
 * Level 5 Task 2 [Client]: Analytics Dashboard — Contract Grader
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

describe('Level 5 Task 2 [Client]: Analytics dashboard', () => {
  it('should create src/app/analytics/page.tsx', async () => {
    const page = await read('src/app/analytics/page.tsx');
    expect(page.length).toBeGreaterThan(0);
  });

  it('should fetch data from the analytics API', async () => {
    const page = await read('src/app/analytics/page.tsx');
    expect(page).toMatch(/\/api\/analytics/);
  });

  it('should visualize a per-subject breakdown with charts', async () => {
    const page = await read('src/app/analytics/page.tsx');
    expect(page).toMatch(/subject/i);
    expect(page).toMatch(/chart|bar|progress/i);
  });

  it('should display a completion trend over time', async () => {
    const page = await read('src/app/analytics/page.tsx');
    expect(page).toMatch(/trend/i);
  });

  it('should display percentage-based insights', async () => {
    const page = await read('src/app/analytics/page.tsx');
    expect(page).toMatch(/%|percent/i);
  });
});
